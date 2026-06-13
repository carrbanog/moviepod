export default function ErrorFallback({ message }: { message?: string }) {
  return (
    <div className="py-20 mt-8 text-center text-destructive bg-destructive/10 border border-destructive/20 border-dashed rounded-xl">
      <p className="font-semibold">데이터를 불러오지 못했습니다.</p>
      <p className="text-sm mt-2 text-muted-foreground">
        {message || "잠시 후 다시 시도해 주세요."}
      </p>
    </div>
  );
}