'use client'

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Download, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SiteHeaderProps {
  showAvatar?: boolean;
  activePage?: 'home' | 'projects' | 'blog' | 'contact' | 'cv';
}

const navLinks = [
  { label: 'About', href: '/#about', page: 'home' as const, sectionId: 'about' },
  { label: 'Projects', href: '/projects', homeHref: '#projects', page: 'projects' as const, sectionId: 'projects' },
  { label: 'Blog', href: '/blog', homeHref: '#blog', page: 'blog' as const, sectionId: 'blog' },
  { label: 'Contact', href: '/#contact', homeHref: '#contact', page: 'contact' as const, sectionId: 'contact' },
  { label: 'CV', href: '/cv', page: 'cv' as const, sectionId: null },
];

function useActiveSection(enabled: boolean) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const sectionIds = navLinks.map(l => l.sectionId).filter(Boolean) as string[];
    const elements = sectionIds.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return activeSection;
}

function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}

export function SiteHeader({ showAvatar = true, activePage = 'home' }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = activePage === 'home';
  const activeSection = useActiveSection(isHome);
  const scrolled = useScrolled();

  const getIsActive = (link: typeof navLinks[number]) => {
    if (isHome && activeSection) {
      return link.sectionId === activeSection;
    }
    return activePage === link.page;
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      scrolled
        ? 'bg-background/70 backdrop-blur-2xl backdrop-saturate-150 shadow-sm shadow-black/[0.03]'
        : 'bg-background/40 backdrop-blur-xl'
    }`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Avatar className={`h-9 w-9 transition-all duration-500 ${
            scrolled
              ? 'ring-2 ring-accent-warm/30 group-hover:ring-accent-warm/60'
              : 'ring-2 ring-accent-warm/15 group-hover:ring-accent-warm/40'
          }`}>
            <AvatarImage src="/logo.png" alt="Pasindu Induwara logo" />
            <AvatarFallback className="bg-accent-warm text-accent-warm-foreground font-heading font-bold text-sm">PI</AvatarFallback>
          </Avatar>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <nav>
            <ul className="flex gap-0.5">
              {navLinks.map((link) => {
                const href = isHome && link.homeHref ? link.homeHref : link.href;
                const isActive = getIsActive(link);
                return (
                  <li key={link.label}>
                    <Link
                      href={href}
                      className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'text-accent-warm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          initial={false}
                          className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent-warm rounded-full"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="ml-2 h-4 w-px bg-border/50" />
          <Button variant="ghost" size="sm" asChild className="ml-1 text-muted-foreground hover:text-accent-warm hover:bg-accent-warm/8">
            <Link href="/Pasindu_Induwara_CV.pdf" download>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              CV
            </Link>
          </Button>
          <ThemeToggle />
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="h-9 w-9"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden overflow-hidden border-t border-border/30 bg-background/95 backdrop-blur-2xl"
          >
            <nav className="container mx-auto px-4 py-4">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const href = isHome && link.homeHref ? link.homeHref : link.href;
                  const isActive = getIsActive(link);
                  return (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                    >
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'text-accent-warm bg-accent-warm/8 border border-accent-warm/15'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
                <motion.li
                  className="mt-2 pt-2 border-t border-border/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    href="/Pasindu_Induwara_CV.pdf"
                    download
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-accent-warm rounded-xl transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download CV
                  </Link>
                </motion.li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
