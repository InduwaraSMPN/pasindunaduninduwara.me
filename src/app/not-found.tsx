import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Layered glow orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-warm/4 blur-[150px] -z-10" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-accent-warm/6 blur-[100px] -z-10" />

        <div className="text-center">
          <p className="text-accent-warm/20 font-heading font-bold text-[10rem] md:text-[14rem] leading-none tracking-tighter select-none">
            404
          </p>
          <div className="-mt-8 md:-mt-12 relative z-10">
            <h1 className="text-2xl md:text-3xl font-heading font-semibold mb-3 tracking-tight">Page Not Found</h1>
            <div className="mx-auto w-10 h-0.5 bg-accent-warm/40 rounded-full mb-5" />
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-[0.938rem]">
              The page you are looking for doesn&apos;t exist or has been moved.
            </p>
            <Button asChild className="bg-accent-warm text-accent-warm-foreground hover:bg-accent-warm/90 font-heading shadow-lg shadow-accent-warm/20 transition-all duration-300">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
