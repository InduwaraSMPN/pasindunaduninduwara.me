'use client'

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Download, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SiteHeaderProps {
  showAvatar?: boolean;
  activePage?: 'home' | 'projects' | 'blog' | 'contact' | 'cv';
}

const navLinks = [
  { label: 'About', href: '/#about', page: 'home' as const },
  { label: 'Projects', href: '/projects', homeHref: '#projects', page: 'projects' as const },
  { label: 'Blog', href: '/blog', homeHref: '#blog', page: 'blog' as const },
  { label: 'CV', href: '/cv', page: 'cv' as const },
  { label: 'Contact', href: '/#contact', homeHref: '#contact', page: 'contact' as const },
];

export function SiteHeader({ showAvatar = true, activePage = 'home' }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Avatar className="h-9 w-9 ring-2 ring-accent-warm/20 transition-all duration-300 group-hover:ring-accent-warm/50">
            <AvatarImage src="/logo.png" alt="Pasindu Induwara logo" />
            <AvatarFallback className="bg-accent-warm text-accent-warm-foreground font-heading font-bold text-sm">PI</AvatarFallback>
          </Avatar>
          <span className="font-heading font-semibold text-sm tracking-tight hidden sm:block">
            Pasindu<span className="text-accent-warm">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <nav>
            <ul className="flex gap-1">
              {navLinks.map((link) => {
                const href = activePage === 'home' && link.homeHref ? link.homeHref : link.href;
                const isActive = activePage === link.page;
                return (
                  <li key={link.label}>
                    <Link
                      href={href}
                      className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isActive
                          ? 'text-accent-warm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent-warm rounded-full"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="ml-2 h-5 w-px bg-border" />
          <Button variant="ghost" size="sm" asChild className="ml-1 text-muted-foreground hover:text-accent-warm">
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
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <nav className="container mx-auto px-4 py-4">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const href = activePage === 'home' && link.homeHref ? link.homeHref : link.href;
                  const isActive = activePage === link.page;
                  return (
                    <li key={link.label}>
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'text-accent-warm bg-accent-warm/10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
                <li className="mt-2 pt-2 border-t border-border/40">
                  <Link
                    href="/Pasindu_Induwara_CV.pdf"
                    download
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-accent-warm rounded-md"
                  >
                    <Download className="h-4 w-4" />
                    Download CV
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
