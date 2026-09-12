import Image from "next/image";
import Link from "next/link";
import { AdminEmpty, AdminPageHead } from "@/components/admin/admin-shell";
import CopyUrlButton from "@/components/admin/copy-url-button";
import { Button } from "@/components/ui/button";
import { BUCKET_ID, createServerClient, getFileUrl } from "@/lib/appwrite";

function formatSize(bytes: number) {
	return bytes < 1024 ? `${bytes} B` : `${Math.round(bytes / 1024)} KB`;
}

export default async function StoragePage() {
	const { storage } = createServerClient();

	const files = await storage.listFiles(BUCKET_ID);

	return (
		<div>
			<AdminPageHead
				eyebrow="Admin — Assets"
				title="Storage"
				note={`${files.total} file${files.total === 1 ? "" : "s"}`}
				action={
					<Button asChild>
						<Link href="/admin/storage/upload">Upload image</Link>
					</Button>
				}
			/>

			{files.files && files.files.length > 0 ? (
				<ul className="grid grid-cols-1 gap-px border border-[var(--rule-strong)] bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{files.files.map((file) => {
						const publicUrl = getFileUrl(file.$id);
						const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);

						return (
							<li key={file.$id} className="flex flex-col bg-background">
								<div className="relative aspect-4/3 w-full overflow-hidden border-b border-[var(--rule)] bg-card">
									{isImage ? (
										<Image
											src={publicUrl}
											alt={file.name}
											fill
											sizes="(max-width: 640px) 100vw, 280px"
											className="object-cover"
										/>
									) : (
										<div className="grid h-full place-items-center">
											<span className="ed-label">{file.name.split(".").pop()}</span>
										</div>
									)}
								</div>

								<div className="flex flex-1 flex-col justify-between gap-3 p-4">
									<p className="truncate text-sm font-medium" title={file.name}>
										{file.name}
									</p>
									<div className="flex items-center justify-between gap-3">
										<span className="ed-meta" data-numeric>
											{formatSize(file.sizeOriginal)}
										</span>
										<CopyUrlButton url={publicUrl} />
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			) : (
				<AdminEmpty
					title="No files in the bucket"
					body="Uploads here are served directly to the public site — project covers, post thumbnails and portraits."
					action={
						<Button asChild>
							<Link href="/admin/storage/upload">Upload image</Link>
						</Button>
					}
				/>
			)}
		</div>
	);
}
