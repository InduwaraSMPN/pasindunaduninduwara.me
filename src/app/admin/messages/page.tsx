import { Query } from "node-appwrite";
import { COLLECTIONS, createServerClient, DATABASE_ID } from "@/lib/appwrite";
import { formatDate } from "@/lib/utils";

export default async function MessagesPage() {
	const { databases } = createServerClient();

	const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MESSAGES, [
		Query.orderDesc("$createdAt"),
		Query.limit(100),
	]);
	const messages = result.documents;

	// Group messages by read status
	const unreadMessages = messages.filter((message) => !message.read);
	const readMessages = messages.filter((message) => message.read);

	return (
		<div>
			<h1 className="text-3xl font-bold mb-8">Messages</h1>

			<div className="space-y-8">
				<div>
					<h2 className="text-xl font-semibold mb-4">Unread Messages ({unreadMessages.length})</h2>

					{unreadMessages.length === 0 ? (
						<p className="text-muted-foreground">No unread messages.</p>
					) : (
						<div className="border rounded-md divide-y">
							{unreadMessages.map((message) => (
								<div key={message.$id} className="p-4">
									<div className="flex justify-between items-start mb-2">
										<div>
											<span className="font-medium">{message.name}</span>
											<span className="text-muted-foreground ml-2">{message.email}</span>
										</div>
										<time className="text-sm text-muted-foreground">
											{formatDate(message.$createdAt)}
										</time>
									</div>

									<h3 className="text-lg font-medium mb-2">{message.subject}</h3>
									<p className="mb-4 whitespace-pre-line">{message.message}</p>

									<div className="flex justify-end gap-2">
										<form action={`/api/messages/${message.$id}/mark-read`} method="post">
											<button
												type="submit"
												className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90"
											>
												Mark as Read
											</button>
										</form>

										<form action={`/api/messages/${message.$id}/delete`} method="post">
											<button
												type="submit"
												className="px-3 py-1 bg-destructive text-destructive-foreground text-sm rounded-md hover:bg-destructive/90"
											>
												Delete
											</button>
										</form>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<div>
					<h2 className="text-xl font-semibold mb-4">Read Messages ({readMessages.length})</h2>

					{readMessages.length === 0 ? (
						<p className="text-muted-foreground">No read messages.</p>
					) : (
						<div className="border rounded-md divide-y">
							{readMessages.map((message) => (
								<div key={message.$id} className="p-4">
									<div className="flex justify-between items-start mb-2">
										<div>
											<span className="font-medium">{message.name}</span>
											<span className="text-muted-foreground ml-2">{message.email}</span>
										</div>
										<time className="text-sm text-muted-foreground">
											{formatDate(message.$createdAt)}
										</time>
									</div>

									<h3 className="text-lg font-medium mb-2">{message.subject}</h3>
									<p className="mb-4 whitespace-pre-line">{message.message}</p>

									<div className="flex justify-end">
										<form action={`/api/messages/${message.$id}/delete`} method="post">
											<button
												type="submit"
												className="px-3 py-1 bg-destructive text-destructive-foreground text-sm rounded-md hover:bg-destructive/90"
											>
												Delete
											</button>
										</form>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
