import type { Metadata } from "next";
import { Fragment } from "react";
import BlogPosts from "@/components/blog-posts";
import { PageMasthead } from "@/components/page-masthead";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
	title: "Writing — Pasindu Nadun Induwara",
	description:
		"Notes on software engineering, platform tooling and building for the web — by Pasindu Nadun Induwara.",
};

export default function BlogPage() {
	return (
		<div className="min-h-screen bg-background">
			<SiteHeader showAvatar={false} activePage="blog" />

			<main>
				<PageMasthead
					eyebrow="Writing"
					note="Notes & ideas"
					lines={[
						<Fragment key="thinking">Thinking out loud</Fragment>,
						<Fragment key="about">
							about <span className="ed-accent">building.</span>
						</Fragment>,
					]}
					lede="Notes on software engineering, platform tooling and the craft of building for the web. Written to be useful to the next person who hits the same problem."
				/>

				<section className="ed-shell pt-16 pb-20 md:pt-20 md:pb-28">
					<BlogPosts />
				</section>
			</main>

			<SiteFooter activePage="blog" />
		</div>
	);
}
