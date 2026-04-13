import { NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { COLLECTIONS, createServerClient, DATABASE_ID } from "@/lib/appwrite";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const postId = searchParams.get("postId");
	if (!postId) {
		return NextResponse.json({ error: "postId required" }, { status: 400 });
	}

	try {
		const { databases } = createServerClient();
		const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COMMENTS, [
			Query.equal("post_id", postId),
			Query.equal("approved", true),
			Query.orderDesc("$createdAt"),
			Query.limit(100),
		]);
		return NextResponse.json(response.documents);
	} catch (error: unknown) {
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
