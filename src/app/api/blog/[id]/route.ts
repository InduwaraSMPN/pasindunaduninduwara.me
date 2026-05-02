import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
	COLLECTIONS,
	createServerClient,
	createSessionClient,
	DATABASE_ID,
	isAdmin,
} from "@/lib/appwrite";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const cookieStore = await cookies();
		const session = cookieStore.get("appwrite-session")?.value;
		if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const { account } = createSessionClient(session);
		const user = await account.get();
		const admin = await isAdmin(user.$id);
		if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

		const { databases } = createServerClient();
		const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.BLOG_POSTS, id);
		return NextResponse.json(doc);
	} catch (error: unknown) {
		const message = (error as Error).message || "Failed to fetch blog post";
		const status = message.toLowerCase().includes("not found") ? 404 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
