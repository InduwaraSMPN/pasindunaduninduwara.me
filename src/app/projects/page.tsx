import ProjectsList from "@/components/projects-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function ProjectsPage() {
	return (
		<div className="min-h-screen bg-background">
			<SiteHeader showAvatar={false} activePage="projects" />

			<main>
				<section className="py-16 md:py-20 px-4">
					<div className="container mx-auto max-w-5xl">
						<ScrollReveal>
							<p className="text-accent-warm font-heading font-semibold text-sm tracking-widest uppercase mb-3">
								My Work
							</p>
							<h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">
								My Projects
							</h1>
							<p className="text-lg text-muted-foreground mb-16 max-w-lg">
								A collection of my digital design work and projects.
							</p>
						</ScrollReveal>

						<ProjectsList limit={9} isHomePage={true} />
					</div>
				</section>
			</main>

			<SiteFooter activePage="projects" />
		</div>
	);
}
