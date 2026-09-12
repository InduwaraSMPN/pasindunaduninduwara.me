"use client";

import { ArrowUpRight, FolderOpen } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { useProjects } from "@/lib/project-service";

/**
 * Projects are presented as a numbered index, the way a magazine lists its
 * contents. Each row inverts to solid ink on hover — the signature interaction
 * of the whole site.
 */
export default function ProjectsList({
	limit,
	isHomePage = false,
}: {
	/** Omit to render every project — used by the full index page. */
	limit?: number;
	isHomePage?: boolean;
}) {
	const { data: projects, isLoading, isError } = useProjects();
	const skeletonCount = limit ?? 4;
	/**
	 * Tags are capped on every listing. Without this a project with fifteen tags
	 * wraps into a wall of chips that stretches its row far taller than its
	 * neighbours and unbalances the whole index. The remainder becomes `+N`.
	 */
	const maxTags = isHomePage ? 4 : 6;

	if (isLoading) {
		return (
			<div className="ed-index" aria-busy="true" aria-live="polite">
				{Array.from({ length: skeletonCount }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
					<div key={i} className="border-b border-[var(--rule)] py-6">
						<div className="flex items-center gap-7">
							<span className="h-3 w-6 shrink-0 animate-pulse bg-muted" />
							<span className="h-4 w-1/3 animate-pulse bg-muted" />
							<span className="ml-auto h-3 w-24 animate-pulse bg-muted" />
						</div>
					</div>
				))}
				<span className="sr-only">Loading projects</span>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="border border-destructive/60 bg-destructive/[0.06] p-6">
				<p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.18em] text-destructive">
					Error loading projects
				</p>
				<p className="mt-2 text-sm text-muted-foreground">
					Unable to load projects right now. Please try again later.
				</p>
			</div>
		);
	}

	if (!projects || projects.length === 0) {
		return (
			<div className="border-y border-[var(--rule-strong)] py-16 text-center">
				<FolderOpen className="mx-auto mb-4 size-6 text-muted-foreground" />
				<p className="ed-meta">No projects published yet. Check back soon.</p>
			</div>
		);
	}

	return (
		<StaggerContainer className="ed-index" staggerDelay={0.09}>
			{(typeof limit === "number" ? projects.slice(0, limit) : projects).map((project, index) => (
				<StaggerItem key={project.$id}>
					<Link
						href={`/projects/${project.$id}`}
						className="ed-index-row grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-5 gap-y-3 py-6 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.05fr)_7.5rem] md:items-center md:gap-x-7"
					>
						<span className="ed-index-mark pt-0.5 font-mono text-xs font-semibold tracking-[0.14em]">
							{String(index + 1).padStart(2, "0")}
						</span>

						<span className="min-w-0">
							<span className="block font-heading text-lg font-bold leading-tight tracking-[-0.028em] md:text-xl">
								{project.title}
							</span>
							{project.tags.length > 0 ? (
								<span className="mt-2.5 flex flex-wrap gap-1.5">
									{project.tags.slice(0, maxTags).map((tag) => (
										<Badge key={tag} variant="secondary">
											{tag}
										</Badge>
									))}
									{project.tags.length > maxTags ? (
										<Badge variant="outline">+{project.tags.length - maxTags}</Badge>
									) : null}
								</span>
							) : null}
						</span>

						<span className="ed-index-dim col-start-2 line-clamp-3 text-sm leading-relaxed md:col-start-3 md:line-clamp-2">
							{project.description}
						</span>

						<span className="ed-index-dim col-start-2 inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] md:col-start-4 md:justify-end">
							View
							<ArrowUpRight className="size-3.5" />
						</span>
					</Link>
				</StaggerItem>
			))}
		</StaggerContainer>
	);
}
