import Link from "next/link";
import { Download } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import TextPressure from "@/components/TextPressure/TextPressure";

export function SiteFooter() {
  return (
    <footer className="py-8 relative overflow-hidden">
      {/* FlickeringGrid Background with TopFadeOpacity */}
      <div
        className="absolute inset-0 z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,1) 50%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,1) 50%)'
        }}
      >
        <FlickeringGrid
          className="w-full h-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.1}
          flickerChance={1}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
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
                <Link href="/Pasindu_Induwara_CV.pdf" download className="text-muted-foreground hover:text-primary flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download CV
                </Link>
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
        <div className="text-center">
          <div className="w-full mx-auto">
            <TextPressure
              text="pasindunaduninduwara"
              textColor="#f2f2f2"
              minFontSize={242}
              width={true}
              weight={true}
              italic={true}
              flex={true}
              scale={true}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
