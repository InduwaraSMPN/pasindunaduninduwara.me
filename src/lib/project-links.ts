import type { Project } from "@/types/appwrite";

/**
 * Titles are stored as "name - what it is". The name is set large; the rest
 * becomes the standfirst line under it. Older titles have no separator, so
 * the whole title is the name.
 */
export function splitTitle(title: string) {
	const [name, ...rest] = title.split(" - ");
	return { name: name.trim(), kind: rest.join(" - ").trim() };
}

/**
 * The project's source repository: the first GitHub repository link in its
 * write-up. Projects have no field for it, and every write-up links its
 * source in a "Links" section, so the write-up is the record.
 */
export function sourceUrl(project: Pick<Project, "full_description">): string | null {
	const match = project.full_description?.match(/https:\/\/github\.com\/[\w.-]+\/[\w.-]+/);
	return match ? match[0] : null;
}

/** "github.com/owner/repo" → "owner/repo", for display. */
export function repoPath(url: string): string {
	return url.replace(/^https:\/\/github\.com\//, "");
}
