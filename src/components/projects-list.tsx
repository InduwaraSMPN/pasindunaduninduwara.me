"use client";

import { ArrowUpRight, FolderOpen } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { TritoneImage } from "@/components/tritone-image";
import { useProjects } from "@/lib/project-service";
import { cn } from "@/lib/utils";

/**
 * Titles are stored as "name - what it is". The name is set large; the rest
 * becomes the standfirst line under it.
 */
function splitTitle(title: string) {
	const [name, ...rest] = title.split(" - ");
	return { name: name.trim(), kind: rest.join(" - ").trim() };
}

/**
 * Projects are printed as plates: the cover image screened in two colours
 * beside the write-up, alternating sides down the page like a feature spread.
 * Hovering a plate shows the cover in full colour — the proof under the print.
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
	const skeletonCount = limit ?? 3;
	/** Four tags say enough; the full list lives on the project page. */
	const maxTags = isHomePage ? 4 : 5;

	if (isLoading) {
		return (
			<div className="border-t border-[var(--rule-strong)]" aria-busy="true" aria-live="polite">
				{Array.from({ length: skeletonCount }).map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
						key={i}
						className="grid grid-cols-1 gap-8 border-b border-[var(--rule)] py-10 lg:grid-cols-12 lg:gap-12"
					>
						<span className="aspect-[16/10] animate-pulse bg-muted lg:col-span-7" />
						<span className="flex flex-col gap-4 lg:col-span-5">
							<span className="h-3 w-12 animate-pulse bg-muted" />
							<span className="h-9 w-2/3 animate-pulse bg-muted" />
							<span className="h-3 w-full animate-pulse bg-muted" />
							<span className="h-3 w-4/5 animate-pulse bg-muted" />
						</span>
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

	const list = typeof limit === "number" ? projects.slice(0, limit) : projects;

	return (
		<ol className="border-t border-[var(--rule-strong)]">
			{list.map((project, index) => {
				const { name, kind } = splitTitle(project.title);
				const flip = index % 2 === 1;
				const year = new Date(project.created_at).getFullYear();
				const extra = project.tags.length - maxTags;

				return (
					<li key={project.$id} className="border-b border-[var(--rule)]">
						<Link
							href={`/projects/${project.$id}`}
							className="group grid grid-cols-1 gap-8 py-10 outline-offset-4 md:py-14 lg:grid-cols-12 lg:items-center lg:gap-14"
						>
							<div className={cn("lg:col-span-7", flip && "lg:order-2")}>
								{project.image ? (
									<div className="ed-figure">
										<TritoneImage
											src={project.image}
											alt=""
											sizes="(max-width: 1024px) 100vw, 680px"
											className="aspect-[16/10]"
										/>
									</div>
								) : (
									<div className="ed-hatch aspect-[16/10] border border-[var(--rule-strong)]" />
								)}
							</div>

							<div className="flex flex-col lg:col-span-5">
								<div className="flex items-baseline justify-between gap-4">
									<span className="ed-sec-num">{String(index + 1).padStart(2, "0")}</span>
									<span className="ed-meta">{year}</span>
								</div>

								<h3 className="mt-6 font-heading text-[clamp(1.9rem,3.4vw,3rem)] font-[620] leading-[1] tracking-[-0.045em] transition-colors duration-300 group-hover:text-[var(--signal)]">
									{/* A domain name is one long word; let it break at its dots. */}
									{name.split(".").map((part, i) => (
										<Fragment key={part}>
											{i > 0 ? (
												<>
													<wbr />.
												</>
											) : null}
											{part}
										</Fragment>
									))}
								</h3>
								{kind ? (
									<p className="mt-3 text-base font-medium tracking-[-0.01em] text-foreground/80">
										{kind}
									</p>
								) : null}

								<p className="mt-5 line-clamp-4 max-w-[48ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
									{project.description}
								</p>

								{project.tags.length > 0 ? (
									<p className="mt-6 font-mono text-[0.6875rem] leading-relaxed tracking-[0.06em] text-muted-foreground">
										{project.tags.slice(0, maxTags).join("  /  ")}
										{extra > 0 ? `  +${extra}` : ""}
									</p>
								) : null}

								<span className="mt-8 inline-flex items-center gap-2 self-start border-b-2 border-foreground pb-1 text-sm font-semibold transition-colors duration-300 group-hover:border-[var(--signal)] group-hover:text-[var(--signal)]">
									View project
									<ArrowUpRight className="size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
								</span>
							</div>
						</Link>
					</li>
				);
			})}
		</ol>
	);
}
