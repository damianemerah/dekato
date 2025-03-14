import { Card, CardContent } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden rounded-none border-none shadow-none">
      <div className="relative w-full overflow-hidden pb-[133.33%]">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      </div>
      <CardContent className="flex flex-1 flex-col items-center space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        {Math.random() > 0.5 && (
          <div className="mt-2 flex gap-2">
            {[...Array(3)].map((_, j) => (
              <Skeleton key={j} className="h-6 w-6 rounded-full" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
