'use client'

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DevelopmentBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-accent-warm text-accent-warm-foreground px-4 py-2 relative">
      <div className="container mx-auto flex items-center justify-center text-center">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-accent-warm-foreground rounded-full animate-pulse" />
          <span className="font-heading font-medium text-sm">
            This website is under development
          </span>
          <span className="hidden md:inline text-sm opacity-75">
            — Some features may not work as expected
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-accent-warm-foreground hover:bg-accent-warm-foreground/20 h-6 w-6 p-0"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
