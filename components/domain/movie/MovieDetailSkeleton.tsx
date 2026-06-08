export default function MovieDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 md:flex-row animate-pulse">
      {/* 이미지 스켈레톤 */}
      <div className="aspect-[2/3] w-full shrink-0 rounded-lg bg-muted md:w-[300px]" />

      {/* 텍스트 스켈레톤 */}
      <div className="flex flex-1 flex-col justify-center space-y-4">
        <div className="h-10 w-3/4 rounded bg-muted" />
        <div className="h-10 w-32 rounded bg-muted" />
        <div className="h-6 w-1/2 rounded bg-muted" />
        <div className="h-24 w-full rounded bg-muted" />
      </div>
    </div>
  );
}
