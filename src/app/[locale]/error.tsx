"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-6 text-center px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => (window.location.href = "/")} variant="outline">
          Go Home
        </Button>
        <Button onClick={() => reset()}>Try Again</Button>
      </div>
    </div>
  );
}
