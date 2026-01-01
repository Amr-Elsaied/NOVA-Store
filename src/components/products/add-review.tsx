/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Star, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl"; 

export default function AddReview({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useAuth();
  const t = useTranslations("AddReview");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (rating === 0) {
      toast.error(t("messages.selectStar"));
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token!,
        },
        body: JSON.stringify({
          title: comment,
          ratings: rating,
          product: productId,
        }),
      });

      const data = await res.json();

      if (data.message === "success" || data.status === "success") {
        toast.success(t("messages.success"));
        setRating(0);
        setComment("");
      } else {
        toast.error(
          data.message || data.errors?.msg || t("messages.failed")
        );
      }
    } catch (error) {
      toast.error(t("messages.error"));
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center border border-dashed">
        <p className="text-muted-foreground mb-4">
          {t("loginReq")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-4">{t("title")}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-colors",
                  (hoverRating || rating) >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                )}
              />
            </button>
          ))}
          <span className="mx-2 text-sm text-muted-foreground font-medium">
            {rating > 0 ? `${rating} ${t("stars")}` : t("selectRating")}
          </span>
        </div>

        <Textarea
          placeholder={t("placeholder")}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px]"
          required
        />

        <Button type="submit" disabled={isLoading} className="font-bold gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4 " />
          )}
          {t("submit")}
        </Button>
      </form>
    </div>
  );
}