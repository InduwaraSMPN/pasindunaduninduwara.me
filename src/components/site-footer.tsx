import Link from "next/link";
import { Download } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import TextPressure from "@/components/TextPressure/TextPressure";

interface SiteFooterProps {
  activePage?: 'home' | 'projects' | 'blog' | 'contact' | 'cv';
}

export function SiteFooter({ activePage = 'home' }: SiteFooterProps) {
  return (
    <footer className="py-12 relative overflow-hidden">
      {/* FlickeringGrid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 60%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 60%)'
        }}
      >
        <FlickeringGrid
          className="w-full h-full"
          squareSize={4}
          gridGap={6}
          color="#d4a054"
          maxOpacity={0.15}
          flickerChance={1}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-widest text-accent-warm mb-4">Contact</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:pasindunaduninduwara@gmail.com" className="text-sm text-muted-foreground hover:text-accent-warm transition-colors">
                  pasindunaduninduwara@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+94703477582" className="text-sm text-muted-foreground hover:text-accent-warm transition-colors">
                  (+94) 703 477 582
                </a>
              </li>
              <li className="text-sm text-muted-foreground">
                Anuradhapura, Sri Lanka
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-widest text-accent-warm mb-4">Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About', href: '/#about' },
                { label: 'Projects', href: '/projects' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-accent-warm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/Pasindu_Induwara_CV.pdf" download className="text-sm text-muted-foreground hover:text-accent-warm transition-colors inline-flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Download CV
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-widest text-accent-warm mb-4">Connect</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com/InduwaraSMPN"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-accent-warm hover:bg-accent-warm/10 transition-all"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/induwarasmpn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-accent-warm hover:bg-accent-warm/10 transition-all"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {activePage === 'home' && (
          <div className="text-center mt-4">
            <div className="w-full mx-auto">
              <TextPressure
                text="pasindunaduninduwara"
                textColor="var(--foreground)"
                minFontSize={242}
                width={true}
                weight={true}
                italic={true}
                flex={true}
                scale={true}
              />
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground/60">
          Copyright &copy; {new Date().getFullYear()} Pasindu Nadun Induwara. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
