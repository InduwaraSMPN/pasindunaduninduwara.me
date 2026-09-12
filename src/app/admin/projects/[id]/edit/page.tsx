"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import {
	AdminBack,
	AdminField,
	AdminLoading,
	AdminNote,
	AdminPageHead,
	AdminPanel,
	StatusMark,
} from "@/components/admin/admin-shell";
import ImageUpload from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Note: databases import kept for client-side reads (getDocument); writes go through API routes
import { COLLECTIONS, DATABASE_ID, databases } from "@/lib/appwrite";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [imageUrl, setImageUrl] = useState("");

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		full_description: "",
		tags: "",
		image: "",
	});

	useEffect(() => {
		const fetchProject = async () => {
			try {
				const project = await databases.getDocument(DATABASE_ID, COLLECTIONS.PROJECTS, id);

				if (project) {
					setFormData({
						title: project.title || "",
						description: project.description || "",
						full_description: project.full_description || "",
						tags: project.tags ? project.tags.join(", ") : "",
						image: project.image || "",
					});
					setImageUrl(project.image || "");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Could not load the project");
			} finally {
				setIsLoading(false);
			}
		};

		fetchProject();
	}, [id]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageUpload = (url: string) => {
		setImageUrl(url);
		setFormData((prev) => ({ ...prev, image: url }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const tagsArray = formData.tags
				.split(",")
				.map((tag) => tag.trim())
				.filter(Boolean);

			const res = await fetch(`/api/projects/${id}/update`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: formData.title,
					description: formData.description,
					full_description: formData.full_description,
					image: formData.image,
					tags: tagsArray,
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Could not save the project");

			router.push("/admin/projects");
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save the project");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div>
				<AdminBack href="/admin/projects">Back to projects</AdminBack>
				<AdminLoading label="Loading project" />
			</div>
		);
	}

	return (
		<div>
			<AdminBack href="/admin/projects">Back to projects</AdminBack>

			<AdminPageHead
				eyebrow="Admin — Edit record"
				title="Edit project"
				note={`ID ${id}`}
				action={
					<>
						<Button variant="outline" asChild>
							<Link href={`/projects/${id}`} target="_blank">
								View live
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/admin/projects">Cancel</Link>
						</Button>
					</>
				}
			/>

			{error ? <AdminNote>{error}</AdminNote> : null}

			<form onSubmit={handleSubmit} className="max-w-3xl">
				<AdminPanel title="Project details" note="Changes go live on save">
					<div className="flex flex-col gap-7">
						<AdminField label="Title" htmlFor="title">
							<Input
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								required
							/>
						</AdminField>

						<AdminField
							label="Short description"
							htmlFor="description"
							hint="One or two sentences. Used on the index row."
						>
							<Textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								required
								rows={3}
							/>
						</AdminField>

						<AdminField
							label="Full description"
							htmlFor="full_description"
							hint="Markdown is rendered on the project page."
						>
							<Textarea
								id="full_description"
								name="full_description"
								value={formData.full_description}
								onChange={handleChange}
								rows={8}
							/>
						</AdminField>

						<AdminField
							label="Tags"
							htmlFor="tags"
							hint="Comma separated. Shown as chips on the index."
						>
							<Input
								id="tags"
								name="tags"
								value={formData.tags}
								onChange={handleChange}
								placeholder="react, typescript, web development"
							/>
						</AdminField>

						<AdminField
							label="Cover image"
							action={
								formData.image ? (
									<StatusMark tone="ink">Attached</StatusMark>
								) : (
									<StatusMark>None</StatusMark>
								)
							}
						>
							<ImageUpload onUploadComplete={handleImageUpload} defaultImageUrl={imageUrl} />
						</AdminField>
					</div>
				</AdminPanel>

				<div className="mt-8 flex flex-wrap gap-2.5">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Saving…" : "Save changes"}
					</Button>
					<Button type="button" variant="outline" asChild>
						<Link href="/admin/projects">Cancel</Link>
					</Button>
				</div>
			</form>
		</div>
	);
}
