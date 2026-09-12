import type { Metadata } from "next";
import BlogPosts from "@/components/blog-posts";
import { PageMasthead } from "@/components/page-masthead";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Rule } from "@/components/ui/scroll-reveal";

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
						<>Thinking out loud</>,
						<>
							about <span className="ed-accent">building.</span>
						</>,
					]}
					lede="Notes on software engineering, platform tooling and the craft of building for the web. Written to be useful to the next person who hits the same problem."
				/>

				<div className="ed-shell mt-14">
					<Rule />
				</div>

				<section className="ed-shell py-14 md:py-20">
					<BlogPosts />
				</section>
			</main>

			<SiteFooter activePage="blog" />
		</div>
	);
}
