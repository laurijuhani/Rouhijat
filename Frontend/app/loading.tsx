import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-3/4 mx-auto flex justify-center items-center">
      <div className="flex space-x-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[200px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-[30px] w-[150px] mx-auto" />
            <Skeleton className="h-[30px] w-[150px] mx-auto" />
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}