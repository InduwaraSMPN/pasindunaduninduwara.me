"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminField, AdminPageHead, AdminPanel } from "@/components/admin/admin-shell";
import CopyUrlButton from "@/components/admin/copy-url-button";
import ImageUpload from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
	const [uploadedUrl, setUploadedUrl] = useState<string>("");
	const router = useRouter();

	return (
		<div>
			<AdminPageHead
				eyebrow="Admin — Assets"
				title="Upload"
				note="Writes to the live bucket"
				action={
					<Button variant="outline" asChild>
						<Link href="/admin/storage">Cancel</Link>
					</Button>
				}
			/>

			<div className="max-w-2xl">
				<AdminPanel title="New image" note="JPEG · PNG · GIF · WebP">
					<ImageUpload onUploadComplete={setUploadedUrl} />

					{uploadedUrl ? (
						<div className="mt-8 border-t border-[var(--rule)] pt-6">
							<AdminField label="Public URL" hint="Paste this into a project or post image field.">
								<div className="flex items-center gap-3">
									<input
										type="text"
										value={uploadedUrl}
										readOnly
										onFocus={(e) => e.currentTarget.select()}
										className="ed-field ed-meta flex-1"
									/>
									<CopyUrlButton url={uploadedUrl} />
								</div>
							</AdminField>
						</div>
					) : null}

					<div className="mt-8 flex justify-end border-t border-[var(--rule)] pt-6">
						<Button onClick={() => router.push("/admin/storage")} disabled={!uploadedUrl}>
							Done
						</Button>
					</div>
				</AdminPanel>
			</div>
		</div>
	);
}
