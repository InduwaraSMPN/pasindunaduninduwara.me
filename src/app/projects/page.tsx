import type { Metadata } from "next";
import { Fragment } from "react";
import { PageMasthead } from "@/components/page-masthead";
import ProjectsList from "@/components/projects-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

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
					lede="Products, platform tooling, coursework and experiments — the lead work first, then everything else newest first. Each one links to a write-up and its source."
				/>

				<section className="ed-shell pt-16 pb-20 md:pt-20 md:pb-28">
					<ProjectsList isHomePage={false} />
				</section>
			</main>

			<SiteFooter activePage="projects" />
		</div>
	);
}
