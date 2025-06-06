import Link from "next/link";
import { Download } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:pasindunaduninduwara@gmail.com" className="text-muted-foreground hover:text-primary">
                  pasindunaduninduwara@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+94703477582" className="text-muted-foreground hover:text-primary">
                  (+94) 703 477 582
                </a>
              </li>
              <li className="text-muted-foreground">
                No 72, Thissa Mawatha, Old Town, Anuradhapura
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#about" className="text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="text-muted-foreground hover:text-primary">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <a href="/Pasindu_Induwara_CV.pdf" download="Pasindu_Induwara_CV.pdf" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download CV
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/InduwaraSMPN" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/induwarasmpn" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Pasindu Nadun Induwara. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
