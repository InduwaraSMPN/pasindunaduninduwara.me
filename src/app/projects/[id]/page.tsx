import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarkdownPreviewComponent from "@/components/blog/markdown-preview";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { MaskedLines, Rule } from "@/components/ui/scroll-reveal";
import { COLLECTIONS, createServerClient, DATABASE_ID } from "@/lib/appwrite";
import type { Project } from "@/types/appwrite";

function formatDate(value: string): string {
	return new Date(value).toLocaleDateString("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

async function getProject(id: string): Promise<Project | undefined> {
	try {
		const { databases } = createServerClient();
		return (await databases.getDocument(
			DATABASE_ID,
			COLLECTIONS.PROJECTS,
			id,
		)) as unknown as Project;
	} catch (error) {
		console.error("Error fetching project:", error);
		return undefined;
	}
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const project = await getProject(id);

	if (!project) return { title: "Project not found" };

	return {
		title: `${project.title} — Pasindu Nadun Induwara`,
		description: project.description,
	};
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const project = await getProject(id);

	if (!project) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-background">
			<SiteHeader showAvatar={false} activePage="projects" />

			<main>
				<header className="ed-shell pt-8 md:pt-12">
					<Link
						href="/projects"
						className="ed-meta ed-link inline-flex items-center gap-2 transition-colors duration-200 hover:text-foreground"
					>
						<ArrowLeft className="size-3.5" />
						Back to projects
					</Link>

					<div className="mt-8 mb-6 flex items-center gap-4">
						<span className="ed-eyebrow">Project</span>
						<span aria-hidden="true" className="h-px flex-1 bg-[var(--rule-strong)]" />
						<span className="ed-eyebrow">{formatDate(project.$createdAt)}</span>
					</div>

					<h1 className="ed-display">
						<MaskedLines lines={[project.title]} />
					</h1>

					{project.tags.length > 0 ? (
						<div className="mt-8 flex flex-wrap gap-1.5">
							{project.tags.map((tag) => (
								<Badge key={tag} variant="secondary">
									{tag}
								</Badge>
							))}
						</div>
					) : null}

					<div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-[var(--rule-strong)] pt-5">
						<span className="ed-meta">Created {formatDate(project.$createdAt)}</span>
						<span className="ed-meta">Updated {formatDate(project.$updatedAt)}</span>
					</div>
				</header>

				{project.image ? (
					<div className="ed-shell mt-12">
						<figure className="ed-figure group">
							<div className="relative aspect-[16/9] overflow-hidden border border-[var(--rule)]">
								<Image
									src={project.image}
									alt={project.title}
									fill
									sizes="(max-width: 1240px) 100vw, 1240px"
									className="object-cover grayscale transition-[filter] duration-700 ease-out-expo group-hover:grayscale-0"
									priority
								/>
							</div>
							<figcaption className="mt-3.5 flex items-baseline justify-between gap-3">
								<span className="ed-label">Fig. 01 — {project.title}</span>
								<span className="ed-label">Cover</span>
							</figcaption>
						</figure>
					</div>
				) : null}

				<div className="ed-shell mt-12">
					<Rule />
				</div>

				<section className="ed-shell py-12 md:py-16">
					<div className="max-w-[68ch]">
						<MarkdownPreviewComponent content={project.full_description || project.description} />
					</div>
				</section>

				<div className="ed-shell pb-16">
					<div className="border-t border-[var(--rule-strong)] pt-8">
						<Link
							href="/projects"
							className="ed-meta ed-link inline-flex items-center gap-2 transition-colors duration-200 hover:text-foreground"
						>
							<ArrowLeft className="size-3.5" />
							Back to all projects
						</Link>
					</div>
				</div>
			</main>

			<SiteFooter activePage="projects" />
		</div>
	);
}
