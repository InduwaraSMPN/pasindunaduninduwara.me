"use client";

import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { AdminField, AdminNote } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
	onUploadComplete: (url: string) => void;
	defaultImageUrl?: string;
}

export default function ImageUpload({ onUploadComplete, defaultImageUrl }: ImageUploadProps) {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [preview, setPreview] = useState<string | null>(defaultImageUrl || null);
	const [dragActive, setDragActive] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const processFile = useCallback(
		async (file: File) => {
			if (!file.type.startsWith("image/")) {
				setError("That file is not an image. Use JPEG, PNG, GIF or WebP.");
				return;
			}

			setError(null);
			setUploading(true);

			try {
				setPreview(URL.createObjectURL(file));

				const formData = new FormData();
				formData.append("file", file);

				const response = await fetch("/api/upload", { method: "POST", body: formData });
				const result = await response.json();

				if (!response.ok) throw new Error(result.error || "Upload failed");
				if (!result.publicUrl) throw new Error("The upload returned no public URL");

				onUploadComplete(result.publicUrl);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Upload failed");
				setPreview(defaultImageUrl || null);
			} finally {
				setUploading(false);
			}
		},
		[onUploadComplete, defaultImageUrl],
	);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		await processFile(files[0]);
	};

	const handleDrop = useCallback(
		async (e: React.DragEvent<HTMLElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setDragActive(false);
			if (e.dataTransfer.files?.length) await processFile(e.dataTransfer.files[0]);
		},
		[processFile],
	);

	const stop = (e: React.DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const clearImage = () => {
		setPreview(null);
		setError(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
		onUploadComplete("");
	};

	return (
		<div className="flex flex-col gap-5">
			{error ? <AdminNote>{error}</AdminNote> : null}

			{preview ? (
				<div className="relative aspect-16/9 w-full overflow-hidden border border-[var(--rule-strong)] bg-card">
					<Image
						src={preview}
						alt="Selected image preview"
						fill
						sizes="640px"
						className="object-cover"
					/>
					<Button
						type="button"
						variant="destructive"
						size="icon"
						onClick={clearImage}
						className="absolute top-3 right-3 size-8"
					>
						<X className="size-3.5" aria-hidden="true" />
						<span className="sr-only">Remove image</span>
					</Button>
				</div>
			) : (
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					onDrop={handleDrop}
					onDragOver={stop}
					onDragEnter={(e) => {
						stop(e);
						setDragActive(true);
					}}
					onDragLeave={(e) => {
						stop(e);
						setDragActive(false);
					}}
					className={`w-full cursor-pointer border border-dashed px-6 py-12 text-center transition-colors duration-300 ${
						dragActive
							? "border-[var(--signal)] bg-[color-mix(in_oklab,var(--signal)_7%,transparent)]"
							: "border-[var(--rule-strong)] hover:border-foreground hover:bg-card"
					}`}
				>
					<Upload className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
					<span className="ed-label mt-4 block">Drop an image, or click to browse</span>
					<span className="ed-meta mt-2 block">JPEG · PNG · GIF · WebP</span>
				</button>
			)}

			<AdminField
				label={preview ? "Replace image" : "Choose image"}
				htmlFor="image-upload"
				hint="Uploads straight to the storage bucket and returns a public URL."
			>
				<input
					id="image-upload"
					type="file"
					accept="image/*"
					ref={fileInputRef}
					onChange={handleFileChange}
					disabled={uploading}
					className="ed-field cursor-pointer file:mr-3 file:cursor-pointer file:border-0 file:bg-transparent file:font-mono file:text-[0.6875rem] file:uppercase file:tracking-[0.14em] file:text-[var(--signal)]"
				/>
			</AdminField>

			{uploading ? (
				<div className="flex items-center gap-3 border-y border-[var(--rule)] py-3">
					<Loader2 className="size-3.5 animate-spin text-[var(--signal)]" aria-hidden="true" />
					<span className="ed-label">Uploading…</span>
				</div>
			) : null}
		</div>
	);
}
