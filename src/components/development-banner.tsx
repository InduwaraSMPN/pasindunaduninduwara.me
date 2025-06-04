'use client'

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DevelopmentBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 relative">
      <div className="container mx-auto flex items-center justify-center text-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium text-sm md:text-base">
              🚧 This website is currently under development
            </span>
          </div>
          <span className="hidden md:inline text-sm opacity-90">
            • Some features may not work as expected
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-6 w-6 p-0"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
