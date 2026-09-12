import Link from "next/link";
import { Query } from "node-appwrite";

import { AdminEmpty, AdminPageHead, AdminThumb } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { COLLECTIONS, createServerClient, DATABASE_ID } from "@/lib/appwrite";
import { formatDate } from "@/lib/utils";

export default async function ProjectsPage() {
	const { databases } = createServerClient();

	const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PROJECTS, [
		Query.orderDesc("$createdAt"),
		Query.limit(100),
	]);
	const projects = result.documents;

	return (
		<div>
			<AdminPageHead
				eyebrow="Admin — Content"
				title="Projects"
				note={`${projects.length} total`}
				action={
					<Button asChild>
						<Link href="/admin/projects/new">Add project</Link>
					</Button>
				}
			/>

			{projects.length === 0 ? (
				<AdminEmpty
					title="No projects yet"
					body="Projects appear on the home page and the public index. Add the first one to get started."
					action={
						<Button asChild>
							<Link href="/admin/projects/new">Add project</Link>
						</Button>
					}
				/>
			) : (
				<ol className="border-t border-[var(--rule-strong)]">
					{projects.map((project, i) => (
						<li key={project.$id} className="border-b border-[var(--rule)] py-6">
							<div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-[8.5rem_minmax(0,1fr)]">
								<AdminThumb src={project.image} alt={project.title} />

								<div className="flex min-w-0 flex-col gap-3">
									<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
										<h2 className="font-heading text-lg font-semibold tracking-[-0.024em]">
											<span className="ed-sec-num mr-3 align-middle">
												{String(i + 1).padStart(2, "0")}
											</span>
											{project.title}
										</h2>
										<span className="ed-meta whitespace-nowrap">
											{formatDate(project.$createdAt)}
										</span>
									</div>

									<p className="line-clamp-2 max-w-[72ch] text-sm leading-relaxed text-muted-foreground">
										{project.description}
									</p>

									{project.tags?.length ? (
										<ul className="flex flex-wrap gap-1.5">
											{project.tags.map((tag: string) => (
												<li
													key={tag}
													className="ed-label border border-[var(--rule-strong)] px-2 py-1"
												>
													{tag}
												</li>
											))}
										</ul>
									) : null}

									<div className="flex flex-wrap items-center gap-2.5 pt-1">
										<Button asChild variant="outline" size="sm">
											<Link href={`/admin/projects/${project.$id}/edit`}>Edit</Link>
										</Button>
										<Button asChild variant="ghost" size="sm">
											<Link href={`/projects/${project.$id}`} target="_blank">
												View
											</Link>
										</Button>
										<form action={`/api/projects/${project.$id}/delete`} method="post">
											<Button type="submit" variant="destructive" size="sm">
												Delete
											</Button>
										</form>
									</div>

									<p className="ed-meta">Last updated {formatDate(project.$updatedAt)}</p>
								</div>
							</div>
						</li>
					))}
				</ol>
			)}
		</div>
	);
}
