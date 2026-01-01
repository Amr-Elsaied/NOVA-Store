import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center space-y-4 bg-background">
      <h1 className="text-9xl font-black text-zinc-200 dark:text-zinc-800">
        404
      </h1>
      <h2 className="text-2xl font-bold">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button size="lg">Back to Home</Button>
      </Link>
    </div>
  );
}
