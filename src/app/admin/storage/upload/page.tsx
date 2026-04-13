"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageUpload from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadPage() {
	const [uploadedUrl, setUploadedUrl] = useState<string>("");
	const router = useRouter();

	const handleUploadComplete = (url: string) => {
		setUploadedUrl(url);
	};

	const handleDone = () => {
		router.push("/admin/storage");
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Upload Image</h1>
				<Button variant="outline" asChild>
					<Link href="/admin/storage">Cancel</Link>
				</Button>
			</div>

			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>Upload to Storage</CardTitle>
				</CardHeader>
				<CardContent>
					<ImageUpload onUploadComplete={handleUploadComplete} />

					{uploadedUrl && (
						<div className="mt-6">
							<p className="text-sm font-medium mb-2">Image URL:</p>
							<div className="flex items-center gap-2">
								<input
									type="text"
									value={uploadedUrl}
									readOnly
									className="flex-1 p-2 text-sm bg-muted rounded-md"
								/>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										navigator.clipboard.writeText(uploadedUrl);
									}}
								>
									Copy
								</Button>
							</div>
						</div>
					)}

					<div className="mt-8 flex justify-end">
						<Button onClick={handleDone} disabled={!uploadedUrl}>
							Done
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
