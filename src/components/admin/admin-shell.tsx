import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Admin vocabulary — the same Editorial Brutalism language as the public site,
 * with the expressive register dialled down.
 *
 * The rules for this surface:
 *   - Identical tokens and type scale, so the console still feels like the site.
 *   - No hover-invert rows, no tickers, no masked reveals. Data has to be
 *     scannable and calm; decoration would compete with the numbers.
 *   - Structure comes from hairline rules and mono metadata, never from cards.
 */

/* ---------------------------------------------------------------------------
   Page head — eyebrow row, title, optional action. Every admin page opens here.
   -------------------------------------------------------------------------- */

interface AdminPageHeadProps {
	/** Mono category line, e.g. "Admin — Content". */
	eyebrow: string;
	title: string;
	/** Optional right-aligned mono note (counts, timestamps). */
	note?: ReactNode;
	/** Primary action, usually a button. */
	action?: ReactNode;
}

export function AdminPageHead({ eyebrow, title, note, action }: AdminPageHeadProps) {
	return (
		<header className="mb-10">
			<div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
				<span className="ed-eyebrow">{eyebrow}</span>
				<span aria-hidden="true" className="h-px min-w-8 flex-1 bg-[var(--rule-strong)]" />
				{note ? <span className="ed-eyebrow whitespace-nowrap max-sm:w-full">{note}</span> : null}
			</div>

			<div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
				<h1 className="ed-display-md">{title}</h1>
				{action ? <div className="flex flex-wrap items-center gap-2.5">{action}</div> : null}
			</div>
		</header>
	);
}

/* ---------------------------------------------------------------------------
   Back — the return path, stated once at the top of a detail page.
   -------------------------------------------------------------------------- */

export function AdminBack({ href, children }: { href: string; children: ReactNode }) {
	return (
		<Link
			href={href}
			className="ed-label mb-5 inline-flex w-fit items-center gap-2 transition-colors duration-200 hover:text-[var(--signal)]"
		>
			<span aria-hidden="true">←</span>
			{children}
		</Link>
	);
}

/* ---------------------------------------------------------------------------
   Panel — a bordered block for forms and grouped content.
   -------------------------------------------------------------------------- */

interface AdminPanelProps {
	title?: string;
	note?: ReactNode;
	children: ReactNode;
	className?: string;
}

export function AdminPanel({ title, note, children, className }: AdminPanelProps) {
	return (
		<section className={cn("border border-[var(--rule-strong)] bg-card", className)}>
			{title ? (
				<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-[var(--rule)] px-5 py-3.5 md:px-7">
					<h2 className="font-heading text-sm font-bold tracking-[-0.02em]">{title}</h2>
					{note ? <span className="ed-label">{note}</span> : null}
				</div>
			) : null}
			<div className="p-5 md:p-7">{children}</div>
		</section>
	);
}

/* ---------------------------------------------------------------------------
   Field — mono label, optional hint and inline action, then the control.
   -------------------------------------------------------------------------- */

interface AdminFieldProps {
	label: string;
	htmlFor?: string;
	hint?: ReactNode;
	/** Inline control on the label row, e.g. "Generate from title". */
	action?: ReactNode;
	children: ReactNode;
	className?: string;
}

export function AdminField({ label, htmlFor, hint, action, children, className }: AdminFieldProps) {
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<div className="flex items-baseline justify-between gap-4">
				<label htmlFor={htmlFor} className="ed-label">
					{label}
				</label>
				{action}
			</div>
			{children}
			{hint ? <p className="ed-meta">{hint}</p> : null}
		</div>
	);
}

/* ---------------------------------------------------------------------------
   Stat — one number with a label. Used on the dashboard.
   -------------------------------------------------------------------------- */

interface AdminStatProps {
	num: string;
	label: string;
	value: number | string;
	note?: ReactNode;
	href: string;
	/** Marks the figure in the signal colour when it needs attention. */
	alert?: boolean;
}

export function AdminStat({ num, label, value, note, href, alert = false }: AdminStatProps) {
	return (
		<Link
			href={href}
			className="group flex flex-col gap-7 bg-background p-6 transition-colors duration-300 hover:bg-card"
		>
			<div className="flex items-baseline justify-between gap-4">
				<span className="ed-sec-num">{num}</span>
				<span className="ed-label">{label}</span>
			</div>

			<div>
				<p
					data-numeric
					className={cn(
						"font-heading text-[clamp(2.25rem,5vw,3.25rem)] font-extrabold leading-none tracking-[-0.045em]",
						alert && "text-[var(--signal)]",
					)}
				>
					{value}
				</p>
				{note ? <p className="ed-meta mt-3">{note}</p> : null}
			</div>

			<span className="ed-label flex items-center gap-1.5 transition-colors duration-200 group-hover:text-foreground">
				Manage
				<span
					aria-hidden="true"
					className="inline-block transition-transform duration-300 group-hover:translate-x-1"
				>
					→
				</span>
			</span>
		</Link>
	);
}

/* ---------------------------------------------------------------------------
   StatusMark — square status chip. `tone` picks the colour, never the shape.
   -------------------------------------------------------------------------- */

interface StatusMarkProps {
	tone?: "signal" | "ink" | "muted";
	children: ReactNode;
}

export function StatusMark({ tone = "muted", children }: StatusMarkProps) {
	return (
		<span
			className={cn(
				"ed-label inline-flex items-center gap-1.5 border px-2 py-1 whitespace-nowrap",
				tone === "signal" && "border-[var(--signal)] text-[var(--signal)]",
				tone === "ink" && "border-foreground text-foreground",
				tone === "muted" && "border-[var(--rule-strong)]",
			)}
		>
			<span
				aria-hidden="true"
				className={cn("size-1.5 shrink-0", tone === "signal" ? "bg-[var(--signal)]" : "bg-current")}
			/>
			{children}
		</span>
	);
}

/* ---------------------------------------------------------------------------
   Empty — no records yet. Always offers the next step.
   -------------------------------------------------------------------------- */

interface AdminEmptyProps {
	title: string;
	body: string;
	action?: ReactNode;
}

export function AdminEmpty({ title, body, action }: AdminEmptyProps) {
	return (
		<div className="border border-dashed border-[var(--rule-strong)] px-6 py-16 text-center">
			<p className="ed-eyebrow">Nothing here yet</p>
			<p className="mt-4 font-heading text-xl font-bold tracking-[-0.028em]">{title}</p>
			<p className="mx-auto mt-2.5 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
				{body}
			</p>
			{action ? <div className="mt-7 flex justify-center">{action}</div> : null}
		</div>
	);
}

/* ---------------------------------------------------------------------------
   Loading — a ruled placeholder, no spinners.
   -------------------------------------------------------------------------- */

export function AdminLoading({ label = "Loading" }: { label?: string }) {
	return (
		<div className="flex items-center gap-3 border-y border-[var(--rule)] py-6">
			<span aria-hidden="true" className="size-2 animate-ed-pulse bg-[var(--signal)]" />
			<span className="ed-label">{label}…</span>
		</div>
	);
}

/* ---------------------------------------------------------------------------
   Note — an inline error or info strip. Destructive uses the signal colour,
   because in this palette red already means "pay attention".
   -------------------------------------------------------------------------- */

export function AdminNote({
	children,
	tone = "error",
}: {
	children: ReactNode;
	tone?: "error" | "info";
}) {
	return (
		<div
			role={tone === "error" ? "alert" : "status"}
			className={cn(
				"mb-6 flex items-start gap-3 border-l-2 px-4 py-3 text-sm",
				tone === "error"
					? "border-[var(--signal)] bg-[color-mix(in_oklab,var(--signal)_8%,transparent)]"
					: "border-[var(--rule-strong)] bg-card",
			)}
		>
			<span
				aria-hidden="true"
				className={cn(
					"mt-[0.45em] size-1.5 shrink-0",
					tone === "error" ? "bg-[var(--signal)]" : "bg-foreground",
				)}
			/>
			<span>{children}</span>
		</div>
	);
}

/* ---------------------------------------------------------------------------
   Thumb — the list-row image frame. When a record has no image the frame keeps
   its hairline and shows a mono label instead of an <img>.

   This used to fall back to /placeholder-image.jpg, a file that was never in
   public/ — so every project or post saved without an image rendered a broken
   thumbnail. An explicit empty state is also more honest than a stock photo:
   the console is telling you there is nothing there.
   -------------------------------------------------------------------------- */

export function AdminThumb({ src, alt }: { src?: string | null; alt: string }) {
	return (
		<div className="relative aspect-16/10 w-full overflow-hidden border border-[var(--rule-strong)] bg-card md:aspect-4/3">
			{src ? (
				<Image src={src} alt={alt} fill sizes="136px" className="object-cover" />
			) : (
				<span className="ed-label absolute inset-0 grid place-items-center">No image</span>
			)}
		</div>
	);
}
