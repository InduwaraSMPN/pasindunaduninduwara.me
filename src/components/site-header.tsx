import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface SiteHeaderProps {
  showAvatar?: boolean;
  activePage?: 'home' | 'projects' | 'blog' | 'contact' | 'cv';
}

export function SiteHeader({ showAvatar = true, activePage = 'home' }: SiteHeaderProps) {
  return (
    <header className="relative overflow-hidden">
      
      {/* Content */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          {showAvatar ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src="/logo.png" alt="Pasindu Induwara logo" />
              <AvatarFallback>PI</AvatarFallback>
            </Avatar>
          ) : (
            <Link href="/">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/logo.png" alt="Pasindu Induwara logo" />
                <AvatarFallback>PI</AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-6">
          <nav>
            <ul className="flex gap-6">
              <li>
                <Link
                  href="/#about"
                  className={activePage === 'home' ? "text-primary font-medium" : "hover:text-primary"}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href={activePage === 'home' ? "#projects" : "/projects"}
                  className={activePage === 'projects' ? "text-primary font-medium" : "hover:text-primary"}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href={activePage === 'home' ? "#blog" : "/blog"}
                  className={activePage === 'blog' ? "text-primary font-medium" : "hover:text-primary"}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/cv"
                  className={activePage === 'cv' ? "text-primary font-medium" : "hover:text-primary"}
                >
                  CV
                </Link>
              </li>
              <li>
                <Link
                  href={activePage === 'home' ? "#contact" : "/#contact"}
                  className={activePage === 'contact' ? "text-primary font-medium" : "hover:text-primary"}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          <Button variant="outline" size="sm" asChild className="mr-2">
            <Link href="/Pasindu_Induwara_CV.pdf" download>
              <Download className="h-4 w-4 mr-2" />
              CV
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
