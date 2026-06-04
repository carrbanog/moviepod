// app/loading.tsx
export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        {/* 애니메이션 없이 은은한 회색 상자만 둡니다. */}
        <div className="h-12 w-64 rounded-md bg-muted/50 sm:w-96" />
        <div className="h-6 w-48 rounded-md bg-muted/50 sm:w-80" />
      </div>

      <section className="mt-8 space-y-6">
        <div className="h-8 w-48 rounded-md bg-muted/50" />
        
        {/* 영화 카드 10개 자리 확보 */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border p-3 shadow-sm">
              <div className="aspect-[2/3] w-full rounded-md bg-muted/50" />
              <div className="mt-2 space-y-2">
                <div className="h-4 w-5/6 rounded bg-muted/50" />
                <div className="h-3 w-1/2 rounded bg-muted/50" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}