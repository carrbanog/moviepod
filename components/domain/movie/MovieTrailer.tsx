interface MovieTrailerProps {
  trailerKey: string;
  movieTitle: string;
}

export default function MovieTrailer({
  trailerKey,
  movieTitle,
}: MovieTrailerProps) {
  return (
    <div className="mt-4 space-y-4">
      <figure className="relative w-full overflow-hidden rounded-xl border bg-black aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${trailerKey}?rel=0`}
          title={`${movieTitle} 공식 예고편`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-0 left-0 h-full w-full border-0"
          tabIndex={-1} //화면 위치를 중간으로 내리는걸 제외
        />
      </figure>
    </div>
  );
}
