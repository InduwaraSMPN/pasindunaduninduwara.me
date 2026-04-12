import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-warm/5 blur-[120px] -z-10" />

      <p className="text-accent-warm font-heading font-bold text-8xl md:text-9xl mb-2 tracking-tighter">404</p>
      <h1 className="text-2xl md:text-3xl font-heading font-semibold mb-4 tracking-tight">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild className="bg-accent-warm text-accent-warm-foreground hover:bg-accent-warm/90 font-heading">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return Home
        </Link>
      </Button>
    </div>
  );
}
