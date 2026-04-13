import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
	COLLECTIONS,
	createServerClient,
	createSessionClient,
	DATABASE_ID,
	isAdmin,
} from "@/lib/appwrite";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const cookieStore = await cookies();
	const session = cookieStore.get("appwrite-session")?.value;

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { account } = createSessionClient(session);
	const user = await account.get();
	const admin = await isAdmin(user.$id);

	if (!admin) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const { databases } = createServerClient();

	try {
		await databases.deleteDocument(DATABASE_ID, COLLECTIONS.MESSAGES, id);
	} catch (error: unknown) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}

	// Redirect back to the messages page
	return NextResponse.redirect(new URL("/admin/messages", request.url), {
		status: 303,
	});
}
