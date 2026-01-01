/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { getProductReviews } from "@/lib/api";
import { cn } from "@/lib/utils";

export default async function ReviewsList({
  productId,
}: {
  productId: string;
}) {
  let reviews = [];
  try {
    reviews = await getProductReviews(productId);
  } catch (error) {
    reviews = [];
  }

  if (reviews.length === 0) return null;

  return (
    <div className="mt-8 space-y-6">
      {reviews.map((review: any) => (
        <div key={review._id} className="border-b pb-6 last:border-0">
          <div className="flex items-center gap-4 mb-2">
            <Avatar>
              <AvatarImage src={review.user?.profileImage} />
              <AvatarFallback>
                {review.user?.name?.slice(0, 2).toUpperCase() || "CN"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-sm">{review.user?.name}</p>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-3 w-3",
                      star <= review.ratings
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
            <span className="ml-auto text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-muted-foreground text-sm pl-14">
            {review.title || "No comment provided."}
          </p>
        </div>
      ))}
    </div>
  );
}
