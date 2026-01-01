import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function ProductViewSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-20">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="flex gap-4 overflow-hidden">
            <Skeleton className="h-24 w-24 rounded-lg shrink-0" />
            <Skeleton className="h-24 w-24 rounded-lg shrink-0" />
            <Skeleton className="h-24 w-24 rounded-lg shrink-0" />
            <Skeleton className="h-24 w-24 rounded-lg shrink-0" />
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>

          <div className="space-y-2 py-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>

          <div className="flex gap-4 pt-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          <div className="mt-4 p-4 border rounded-lg space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  )
}