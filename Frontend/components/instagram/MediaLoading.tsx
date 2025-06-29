import Spinner from "../basics/Spinner";

const MediaLoading = () => {
  return (
    <div className="relative w-full max-w-[500px] aspect-square mb-4 bg-white/10 rounded">
      <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

export default MediaLoading;
