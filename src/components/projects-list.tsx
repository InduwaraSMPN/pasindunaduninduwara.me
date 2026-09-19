"use client";

import { ArrowUpRight, FolderOpen } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { HalftoneImage } from "@/components/halftone-image";
import { repoPath, sourceUrl, splitTitle } from "@/lib/project-links";
import { useProjects } from "@/lib/project-service";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/appwrite";

/**
 * The projects that lead, in this order: the three on the CV, then the
 * newest large build. Matched as a prefix of the lower-cased title, so
 * "Guidia Web Application" and "Guidia - …" both count.
 * On the home page the first three appear; on the index they get full plates.
 */
const FEATURED = ["guidia", "browtrix", "quota.app", "axiōma"];

const featuredRank = (project: Project) => {
	const title = project.title.toLowerCase();
	const rank = FEATURED.findIndex((key) => title.startsWith(key));
	return rank === -1 ? Number.POSITIVE_INFINITY : rank;
};

const yearOf = (project: Project) =>
	new Date(project.created_at ?? project.$createdAt).getFullYear();

/** A domain name is one long word; let it break at its dots. */
function BreakableName({ name }: { name: string }) {
	// Parts are keyed by their offset in the name, which is stable and unique.
	let offset = 0;
	return name.split(".").map((part, i) => {
		const key = offset;
		offset += part.length + 1;
		return (
			<Fragment key={key}>
				{i > 0 ? (
					<>
						<wbr />.
					</>
				) : null}
				{part}
			</Fragment>
		);
	});
}

/**
 * The cover for a project with no screenshot: a title plate, set like the
 * cover of a monograph — the name in the serif, the stack in mono, and a
 * halftone field in the signal colour.
 */
function TitleCover({ project, name }: { project: Project; name: string }) {
	const source = sourceUrl(project);
	const tags = project.tags;
	return (
		<div className="relative aspect-[16/10] overflow-hidden bg-[var(--card)]">
			<div aria-hidden="true" className="ed-cover-screen absolute inset-0" />
			<div className="relative flex h-full flex-col justify-between p-6 md:p-8">
				<span className="ed-label">{source ? repoPath(source) : "Plate"}</span>
				<span className="ed-accent text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[0.92]">
					<BreakableName name={name} />
				</span>
				<span className="font-mono text-[0.6875rem] tracking-[0.06em] text-muted-foreground">
					{tags.slice(0, 3).join("  /  ")}
				</span>
			</div>
		</div>
	);
}

/** One project as a full plate: its cover beside the write-up. */
function Plate({ project, index, maxTags }: { project: Project; index: number; maxTags: number }) {
	const { name, kind } = splitTitle(project.title);
	const flip = index % 2 === 1;
	const extra = project.tags.length - maxTags;

	return (
		<li className="border-b border-[var(--rule)]">
			<Link
				href={`/projects/${project.$id}`}
				className="group grid grid-cols-1 gap-8 py-10 outline-offset-4 md:py-14 lg:grid-cols-12 lg:items-center lg:gap-14"
			>
				<div className={cn("lg:col-span-7", flip && "lg:order-2")}>
					<div className="ed-figure">
						{project.image ? (
							<HalftoneImage
								src={project.image}
								alt=""
								sizes="(max-width: 1024px) 100vw, 680px"
								screen="fine"
								className="aspect-[16/10]"
							/>
						) : (
							<TitleCover project={project} name={name} />
						)}
					</div>
				</div>

				<div className="flex flex-col lg:col-span-5">
					<div className="flex items-baseline justify-between gap-4">
						<span className="ed-sec-num">{String(index + 1).padStart(2, "0")}</span>
						<span className="ed-meta">{yearOf(project)}</span>
					</div>

					<h3
						className={cn(
							"mt-6 font-heading font-[620] leading-[1] tracking-[-0.045em] transition-colors duration-300 group-hover:text-[var(--signal)]",
							// A long single-word name (a domain) would outrun the column.
							name.length > 16
								? "text-[clamp(1.6rem,2.6vw,2.25rem)]"
								: "text-[clamp(1.9rem,3.4vw,3rem)]",
						)}
					>
						<BreakableName name={name} />
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
}

/** One project as an index row — the signature hover-invert row. */
function IndexRow({ project }: { project: Project }) {
	const { name, kind } = splitTitle(project.title);
	return (
		<li>
			<Link
				href={`/projects/${project.$id}`}
				className="ed-index-row grid grid-cols-[3.25rem_minmax(0,1fr)] items-baseline gap-x-5 gap-y-2 py-5 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1.35fr)_1rem] md:gap-x-8"
			>
				<span className="ed-index-mark font-mono text-xs tracking-[0.1em]">{yearOf(project)}</span>
				<span className="min-w-0">
					<span className="block font-heading text-lg font-semibold leading-snug tracking-[-0.028em]">
						<BreakableName name={name} />
					</span>
					{kind ? <span className="ed-index-dim mt-0.5 block text-sm">{kind}</span> : null}
				</span>
				<span className="col-start-2 min-w-0 md:col-start-auto">
					<span className="ed-index-dim line-clamp-2 block text-sm leading-relaxed">
						{project.description}
					</span>
					{project.tags.length > 0 ? (
						<span className="ed-index-dim mt-2 block font-mono text-[0.6875rem] tracking-[0.05em]">
							{project.tags.slice(0, 4).join("  /  ")}
						</span>
					) : null}
				</span>
				<ArrowUpRight
					aria-hidden="true"
					className="ed-index-dim hidden size-4 self-center md:block"
				/>
			</Link>
		</li>
	);
}

/**
 * Projects are printed as plates — the cover screened beside the write-up,
 * alternating sides like a feature spread — for the ones that lead. On the
 * full index, everything else follows as a compact list, newest first.
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

	// The API returns newest first; featured projects move ahead in their own
	// order, and the sort is stable, so everything else keeps its date order.
	const ordered = [...projects].sort((a, b) => featuredRank(a) - featuredRank(b));

	if (typeof limit === "number") {
		return (
			<ol className="border-t border-[var(--rule-strong)]">
				{ordered.slice(0, limit).map((project, index) => (
					<Plate key={project.$id} project={project} index={index} maxTags={maxTags} />
				))}
			</ol>
		);
	}

	const plates = ordered.filter((p) => featuredRank(p) !== Number.POSITIVE_INFINITY || p.image);
	const rest = ordered.filter((p) => !plates.includes(p));

	return (
		<>
			<ol className="border-t border-[var(--rule-strong)]">
				{plates.map((project, index) => (
					<Plate key={project.$id} project={project} index={index} maxTags={maxTags} />
				))}
			</ol>

			{rest.length > 0 ? (
				<section aria-labelledby="also-built" className="mt-20 md:mt-28">
					<div className="mb-5 flex items-baseline justify-between gap-4">
						<h2 id="also-built" className="ed-display-md">
							Also <span className="ed-accent">built</span>
						</h2>
						<span className="ed-label">{rest.length} more, newest first</span>
					</div>
					<ol className="ed-index">
						{rest.map((project) => (
							<IndexRow key={project.$id} project={project} />
						))}
					</ol>
				</section>
			) : null}
		</>
	);
}
