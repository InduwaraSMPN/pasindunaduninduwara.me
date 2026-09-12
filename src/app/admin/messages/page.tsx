import { Query } from "node-appwrite";

import { AdminPageHead } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { COLLECTIONS, createServerClient, DATABASE_ID } from "@/lib/appwrite";
import { formatDate } from "@/lib/utils";

function EmptyRow({ children }: { children: React.ReactNode }) {
	return <p className="ed-meta border-b border-[var(--rule)] py-6">{children}</p>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
	return <h2 className="ed-label mb-1 border-b border-[var(--rule-strong)] pb-3">{children}</h2>;
}

export default async function MessagesPage() {
	const { databases } = createServerClient();

	const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MESSAGES, [
		Query.orderDesc("$createdAt"),
		Query.limit(100),
	]);
	const messages = result.documents;

	const unreadMessages = messages.filter((message) => !message.read);
	const readMessages = messages.filter((message) => message.read);

	return (
		<div>
			<AdminPageHead
				eyebrow="Admin — Inbox"
				title="Messages"
				note={`${unreadMessages.length} unread · ${readMessages.length} read`}
			/>

			<section>
				<SectionLabel>Unread ({unreadMessages.length})</SectionLabel>

				{unreadMessages.length === 0 ? (
					<EmptyRow>Inbox clear — nothing unread.</EmptyRow>
				) : (
					<ul>
						{unreadMessages.map((message) => (
							<li key={message.$id} className="border-b border-[var(--rule)] py-6">
								<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
									<p className="flex items-baseline gap-3 font-heading text-base font-semibold tracking-[-0.022em]">
										<span
											aria-hidden="true"
											className="size-2 shrink-0 translate-y-[-0.15em] bg-[var(--signal)]"
										/>
										{message.name}
										<span className="ed-meta font-normal">{message.email}</span>
									</p>
									<time className="ed-meta">{formatDate(message.$createdAt)}</time>
								</div>

								<h3 className="mt-3 font-heading text-lg font-semibold tracking-[-0.024em]">
									{message.subject}
								</h3>
								<p className="mt-2.5 max-w-[70ch] whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
									{message.message}
								</p>

								<div className="mt-4 flex flex-wrap justify-end gap-2.5">
									<form action={`/api/messages/${message.$id}/mark-read`} method="post">
										<Button type="submit" variant="outline" size="sm">
											Mark as read
										</Button>
									</form>
									<form action={`/api/messages/${message.$id}/delete`} method="post">
										<Button type="submit" variant="destructive" size="sm">
											Delete
										</Button>
									</form>
								</div>
							</li>
						))}
					</ul>
				)}
			</section>

			<section className="mt-14">
				<SectionLabel>Read ({readMessages.length})</SectionLabel>

				{readMessages.length === 0 ? (
					<EmptyRow>No read messages.</EmptyRow>
				) : (
					<ul>
						{readMessages.map((message) => (
							<li key={message.$id} className="border-b border-[var(--rule)] py-6">
								<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
									<p className="flex flex-wrap items-baseline gap-3 font-heading text-base font-semibold tracking-[-0.022em]">
										{message.name}
										<span className="ed-meta font-normal">{message.email}</span>
									</p>
									<time className="ed-meta">{formatDate(message.$createdAt)}</time>
								</div>

								<h3 className="mt-3 font-heading text-lg font-semibold tracking-[-0.024em]">
									{message.subject}
								</h3>
								<p className="mt-2.5 max-w-[70ch] whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
									{message.message}
								</p>

								<div className="mt-4 flex justify-end">
									<form action={`/api/messages/${message.$id}/delete`} method="post">
										<Button type="submit" variant="destructive" size="sm">
											Delete
										</Button>
									</form>
								</div>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
