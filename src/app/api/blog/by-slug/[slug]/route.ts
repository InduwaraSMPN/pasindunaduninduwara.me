import { NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { COLLECTIONS, createServerClient, DATABASE_ID } from "@/lib/appwrite";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	try {
		const { databases } = createServerClient();
		const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BLOG_POSTS, [
			Query.equal("slug", slug),
			Query.equal("published", true),
			Query.limit(1),
		]);
		if (response.documents.length === 0) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 });
		}
		return NextResponse.json(response.documents[0]);
	} catch (error: unknown) {
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
