"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	AdminBack,
	AdminField,
	AdminNote,
	AdminPageHead,
	AdminPanel,
	StatusMark,
} from "@/components/admin/admin-shell";
import ImageUpload from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewProjectPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		full_description: "",
		tags: "",
		image: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
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

			const res = await fetch("/api/projects/create", {
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
			if (!res.ok) throw new Error(data.error || "Could not create the project");

			router.push("/admin/projects");
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not create the project");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<AdminBack href="/admin/projects">Back to projects</AdminBack>

			<AdminPageHead
				eyebrow="Admin — New record"
				title="Add project"
				note="Not yet published"
				action={
					<Button variant="outline" asChild>
						<Link href="/admin/projects">Cancel</Link>
					</Button>
				}
			/>

			{error ? <AdminNote>{error}</AdminNote> : null}

			<form onSubmit={handleSubmit} className="max-w-3xl">
				<AdminPanel title="Project details" note="Saved immediately on submit">
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
							hint="Square-ish images crop best on the index."
							action={
								formData.image ? (
									<StatusMark tone="ink">Attached</StatusMark>
								) : (
									<StatusMark>None</StatusMark>
								)
							}
						>
							<ImageUpload
								onUploadComplete={(url) => setFormData((prev) => ({ ...prev, image: url }))}
							/>
						</AdminField>
					</div>
				</AdminPanel>

				<div className="mt-8 flex flex-wrap gap-2.5">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Creating…" : "Create project"}
					</Button>
					<Button type="button" variant="outline" asChild>
						<Link href="/admin/projects">Cancel</Link>
					</Button>
				</div>
			</form>
		</div>
	);
}
