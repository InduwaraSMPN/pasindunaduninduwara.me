import type { Metadata } from "next";
import { Fragment } from "react";
import { PageMasthead } from "@/components/page-masthead";
import ProjectsList from "@/components/projects-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Rule } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
	title: "Projects — Pasindu Nadun Induwara",
	description:
		"Full-stack applications, platform tooling and experiments built by Pasindu Nadun Induwara.",
};

export default function ProjectsPage() {
	return (
		<div className="min-h-screen bg-background">
			<SiteHeader showAvatar={false} activePage="projects" />

			<main>
				<PageMasthead
					eyebrow="Index"
					note="Selected work"
					lines={[
						<Fragment key="things">Things I have</Fragment>,
						<Fragment key="built">
							built and <span className="ed-accent">shipped.</span>
						</Fragment>,
					]}
					lede="Full-stack applications, platform tooling and experiments — each one a link to a full write-up covering the problem, the approach and what I would do differently."
				/>

				<div className="ed-shell mt-14">
					<Rule />
				</div>

				<section className="ed-shell py-14 md:py-20">
					<ProjectsList isHomePage={false} />
				</section>
			</main>

			<SiteFooter activePage="projects" />
		</div>
	);
}
