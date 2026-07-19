import { useState, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface UseInfiniteScrollProps<T> {
  initialData: T[];
  fetchMore: (nextPage: number) => Promise<T[]>;
  initialPage?: number;
}

export function useInfiniteScroll<T>({
  initialData,
  fetchMore,
  initialPage = 1,
}: UseInfiniteScrollProps<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const isFetchingRef = useRef(false);
  const pageRef = useRef(initialPage);
  const { ref: targetRef } = useInView({
    threshold: 0,
    onChange: async (inView) => {
      // 보이지 않거나, 이미 패칭 중이거나, 더 이상 데이터가 없으면 중단
      if (!inView || isFetchingRef.current || !hasMore) return;

      isFetchingRef.current = true;
      setIsLoading(true);

      try {
        const nextPage = pageRef.current + 1;
        const newData = await fetchMore(nextPage);

        if (newData.length === 0) {
          setHasMore(false);
        } else {
          setData((prev) => [...prev, ...newData]);
          pageRef.current = nextPage;
        }
      } catch (error) {
        console.error("무한 스크롤 데이터 페칭 에러:", error);
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
      }
    },
  });

  return { data, hasMore, isLoading, targetRef };
}