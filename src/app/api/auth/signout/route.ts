import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite";

export async function POST(request: Request) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get("appwrite-session")?.value;

		if (session) {
			try {
				const { account } = createSessionClient(session);
				await account.deleteSession("current");
			} catch {
				// Session may already be invalid
			}
		}

		const response = NextResponse.redirect(new URL("/", request.url), {
			status: 302,
		});
		response.cookies.set("appwrite-session", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 0,
		});

		return response;
	} catch {
		return NextResponse.redirect(new URL("/", request.url), { status: 302 });
	}
}
