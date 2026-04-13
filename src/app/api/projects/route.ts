import { NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { COLLECTIONS, createServerClient, DATABASE_ID } from "@/lib/appwrite";

export async function GET() {
	try {
		const { databases } = createServerClient();
		const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PROJECTS, [
			Query.orderDesc("created_at"),
			Query.limit(100),
		]);
		return NextResponse.json(response.documents);
	} catch (error: unknown) {
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
