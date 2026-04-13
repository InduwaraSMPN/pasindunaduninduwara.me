"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import ImageUpload from "@/components/admin/image-upload";
// Note: databases import kept for client-side reads (getDocument); writes go through API routes
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
				console.error("Error fetching project:", err);
				setError(
					err instanceof Error ? err.message : "An error occurred while fetching the project",
				);
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
			// Process tags into an array
			const tagsArray = formData.tags
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0);

			// Update the project via API route
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
			if (!res.ok) throw new Error(data.error);

			// Redirect to the projects page
			router.push("/admin/projects");
			router.refresh();
		} catch (err) {
			console.error("Error updating project:", err);
			setError(err instanceof Error ? err.message : "An error occurred while updating the project");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center mb-8">
				<Link
					href="/admin/projects"
					className="text-primary hover:underline flex items-center gap-2 mr-4"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="lucide lucide-arrow-left"
					>
						<path d="m12 19-7-7 7-7" />
						<path d="M19 12H5" />
					</svg>
					Back
				</Link>
				<h1 className="text-3xl font-bold">Edit Project</h1>
			</div>

			{error && (
				<div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">{error}</div>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Project Details</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Short Description</Label>
							<Textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								required
								rows={3}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="full_description">Full Description</Label>
							<Textarea
								id="full_description"
								name="full_description"
								value={formData.full_description}
								onChange={handleChange}
								rows={8}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="tags">Tags (comma separated)</Label>
							<Input
								id="tags"
								name="tags"
								value={formData.tags}
								onChange={handleChange}
								placeholder="react, typescript, web development"
							/>
						</div>

						<div className="space-y-2">
							<Label>Project Image</Label>
							<ImageUpload onUploadComplete={handleImageUpload} defaultImageUrl={imageUrl} />
						</div>

						<div className="flex gap-4 pt-4">
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Saving..." : "Save Changes"}
							</Button>
							<Button type="button" variant="outline" asChild>
								<Link href="/admin/projects">Cancel</Link>
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
