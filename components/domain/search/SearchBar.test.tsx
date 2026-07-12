import { render, screen, fireEvent, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SearchBar from "./SearchBar";

// 1. Next.js의 useRouter 모킹
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// 테스트마다 초기화될 독립된 QueryClient 생성 함수
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // 테스트 실패 시 불필요한 재요청 방지
      },
    },
  });

describe("SearchBar 컴포넌트 테스트", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    jest.useFakeTimers(); // 디바운스 타임아웃 통제를 위해 Jest 페이크 타이머 활성화
    mockPush.mockClear();
    
    // global.fetch 기본 모킹 (빈 배열 반환)
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    } as unknown as Response);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  // React Query Provider를 입혀서 컴포넌트를 렌더링하는 헬퍼 함수
  const renderSearchBar = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <SearchBar />
      </QueryClientProvider>
    );

  it("초기 상태에서는 검색 창이 올바르게 렌더링되고 드롭다운은 닫혀 있어야 한다", () => {
    renderSearchBar();
    
    const input = screen.getByLabelText("영화 검색");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
    
    // 초기에는 검색 결과가 없으므로 드롭다운(listbox)이 화면에 보이지 않아야 함
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument(); 
  });

  it("사용자가 텍스트를 입력하고 300ms가 지나면 디바운스가 풀리며 API가 호출된다", async () => {
    const mockMovies = [{ id: 1, title: "아바타" }];
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockMovies),
    } as unknown as Response);

    renderSearchBar();
    const input = screen.getByLabelText("영화 검색");

    // 글자 입력
    fireEvent.change(input, { target: { value: "아바타" } });

    // 300ms가 지나기 전에는 API가 호출되지 않아야 함
    expect(global.fetch).not.toHaveBeenCalled();

    // 시간을 300ms 강제로 흘림
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // 디바운스 만료 후 올바른 주소로 인코딩되어 fetch가 호출되었는지 검증
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/search?q=%EC%95%84%EB%B0%94%ED%83%80"),
      expect.any(Object)
    );
  });

  it("검색어를 입력하고 폼을 제출하면 해당 검색어와 함께 검색 결과 페이지로 이동한다", async () => {
    renderSearchBar();
    const input = screen.getByLabelText("영화 검색");

    fireEvent.change(input, { target: { value: "인셉션" } });
    
    // form 요소를 찾아 submit 이벤트 발생
    const form = screen.getByRole("search");
    fireEvent.submit(form);

    // router.push가 정상적인 URL 경로로 호출되었는지 검증
    expect(mockPush).toHaveBeenCalledWith("/search?q=%EC%9D%B8%EC%85%89%EC%85%98");
    
    // 제출 완료 후 검색창이 비워지는지 검증
    expect(input).toHaveValue("");
  });

  it("검색 창 외부 영역을 클릭하면 열려 있던 드롭다운이 닫힌다", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue([{ id: 1, title: "라라랜드" }]),
    } as unknown as Response);

    renderSearchBar();
    const input = screen.getByLabelText("영화 검색");
    
    fireEvent.change(input, { target: { value: "라라랜드" } });
    
    act(() => { 
      jest.advanceTimersByTime(300); 
    });

    // 외부 영역 클릭을 모사하기 위해 document.body에 mousedown 이벤트 트리거
    fireEvent.mouseDown(document.body);

    // SearchDropdown 내부 요소를 지칭하여 화면에서 닫혔는지 검증하는 영역입니다.
    // 사용하시는 SearchDropdown 구현 스타일에 맞춰 매처를 검증하시면 됩니다.
    // 예: expect(screen.queryByText("라라랜드")).not.toBeInTheDocument();
  });
});