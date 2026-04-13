import { NextResponse } from "next/server";
import { COLLECTIONS, createServerClient, DATABASE_ID } from "@/lib/appwrite";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	try {
		const { databases } = createServerClient();
		const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.PROJECTS, id);
		return NextResponse.json(doc);
	} catch {
		return NextResponse.json({ error: "Project not found" }, { status: 404 });
	}
}
