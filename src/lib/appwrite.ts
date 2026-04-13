import { Account, Client, Databases, Storage } from "appwrite";
import {
	Account as ServerAccount,
	Client as ServerClient,
	Databases as ServerDatabases,
	Storage as ServerStorage,
	Users,
} from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

export const COLLECTIONS = {
	PROFILES: "profiles",
	PROJECTS: "projects",
	BLOG_POSTS: "blog_posts",
	COMMENTS: "comments",
	MESSAGES: "messages",
} as const;

// Client-side Appwrite client
const client = new Client().setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { client };

// Server-side client using API key (for admin operations in API routes)
export function createServerClient() {
	const serverClient = new ServerClient()
		.setEndpoint(endpoint)
		.setProject(projectId)
		.setKey(process.env.APPWRITE_API_KEY!);

	return {
		databases: new ServerDatabases(serverClient),
		storage: new ServerStorage(serverClient),
		users: new Users(serverClient),
	};
}

// Session client for authenticated user context (middleware/API routes)
export function createSessionClient(session: string) {
	const sessionClient = new ServerClient()
		.setEndpoint(endpoint)
		.setProject(projectId)
		.setSession(session);

	const sessionAccount = new ServerAccount(sessionClient);

	return {
		account: sessionAccount,
		databases: new ServerDatabases(sessionClient),
		storage: new ServerStorage(sessionClient),
	};
}

// Check if a user has admin label
export async function isAdmin(userId: string): Promise<boolean> {
	try {
		const { users } = createServerClient();
		const user = await users.get(userId);
		return user.labels?.includes("admin") ?? false;
	} catch {
		return false;
	}
}

// Get file view URL
export function getFileUrl(fileId: string): string {
	return `${endpoint}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${projectId}`;
}

// Get file preview URL (for images)
export function getFilePreviewUrl(fileId: string, width?: number, height?: number): string {
	let url = `${endpoint}/storage/buckets/${BUCKET_ID}/files/${fileId}/preview?project=${projectId}`;
	if (width) url += `&width=${width}`;
	if (height) url += `&height=${height}`;
	return url;
}
