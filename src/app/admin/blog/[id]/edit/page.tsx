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
} from "@/components/admin/admin-shell";
import ImageUpload from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [imageUrl, setImageUrl] = useState("");
	const [originalPublishedAt, setOriginalPublishedAt] = useState<string | null>(null);
	const [wasPublished, setWasPublished] = useState(false);

	const [formData, setFormData] = useState({
		title: "",
		slug: "",
		excerpt: "",
		content: "",
		categories: "",
		thumbnail: "",
		published: false,
	});

	useEffect(() => {
		const fetchBlogPost = async () => {
			try {
				const res = await fetch(`/api/blog/${id}`, { credentials: "include" });
				if (!res.ok) {
					const data = await res.json().catch(() => ({}));
					throw new Error(data.error || `Request failed (${res.status})`);
				}
				const post = await res.json();

				if (post) {
					setFormData({
						title: post.title || "",
						slug: post.slug || "",
						excerpt: post.excerpt || "",
						content: post.content || "",
						categories: post.categories ? post.categories.join(", ") : "",
						thumbnail: post.thumbnail || "",
						published: post.published || false,
					});
					setImageUrl(post.thumbnail || "");
					setOriginalPublishedAt(post.published_at || null);
					setWasPublished(post.published || false);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Could not load the post");
			} finally {
				setIsLoading(false);
			}
		};

		fetchBlogPost();
	}, [id]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const generateSlug = () => {
		if (!formData.title) return;
		const slug = formData.title
			.toLowerCase()
			.replace(/[^\w\s]/gi, "")
			.replace(/\s+/g, "-");
		setFormData((prev) => ({ ...prev, slug }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const categoriesArray = formData.categories
				.split(",")
				.map((category) => category.trim())
				.filter(Boolean);

			const res = await fetch(`/api/blog/${id}/update`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: formData.title,
					slug: formData.slug,
					excerpt: formData.excerpt,
					content: formData.content,
					categories: categoriesArray,
					thumbnail: formData.thumbnail,
					published: formData.published,
					// Preserve the original publish date when it was already live.
					published_at: formData.published
						? wasPublished
							? originalPublishedAt
							: new Date().toISOString()
						: null,
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Could not save the post");

			router.push("/admin/blog");
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save the post");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div>
				<AdminBack href="/admin/blog">Back to blog</AdminBack>
				<AdminLoading label="Loading post" />
			</div>
		);
	}

	return (
		<div>
			<AdminBack href="/admin/blog">Back to blog</AdminBack>

			<AdminPageHead
				eyebrow="Admin — Edit record"
				title="Edit post"
				note={`ID ${id}`}
				action={
					formData.published ? (
						<Button variant="outline" asChild>
							<Link href={`/blog/${formData.slug}`} target="_blank">
								View live
							</Link>
						</Button>
					) : null
				}
			/>

			{error ? <AdminNote>{error}</AdminNote> : null}

			<form
				onSubmit={handleSubmit}
				className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start"
			>
				<AdminPanel title="Content">
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
							label="Slug"
							htmlFor="slug"
							hint="Forms the public URL: /blog/your-slug"
							action={
								<button
									type="button"
									onClick={generateSlug}
									className="ed-label transition-colors duration-200 hover:text-[var(--signal)]"
								>
									Generate from title
								</button>
							}
						>
							<Input
								id="slug"
								name="slug"
								value={formData.slug}
								onChange={handleChange}
								required
								placeholder="my-blog-post"
							/>
						</AdminField>

						<AdminField
							label="Excerpt"
							htmlFor="excerpt"
							hint="Shown in the blog index and social previews."
						>
							<Textarea
								id="excerpt"
								name="excerpt"
								value={formData.excerpt}
								onChange={handleChange}
								rows={2}
								placeholder="A brief summary of your post"
							/>
						</AdminField>

						<AdminField
							label="Content"
							htmlFor="content"
							hint="Markdown is rendered on the published page."
						>
							<Textarea
								id="content"
								name="content"
								value={formData.content}
								onChange={handleChange}
								required
								rows={18}
								className="font-mono text-[0.8125rem] leading-relaxed"
							/>
						</AdminField>

						<AdminField
							label="Categories"
							htmlFor="categories"
							hint="Comma separated. Shown as chips on the index."
						>
							<Input
								id="categories"
								name="categories"
								value={formData.categories}
								onChange={handleChange}
								placeholder="web development, design, technology"
							/>
						</AdminField>
					</div>
				</AdminPanel>

				<div className="flex flex-col gap-10 lg:sticky lg:top-12">
					<AdminPanel title="Publish">
						<div className="flex flex-col gap-6">
							<div className="flex items-center justify-between gap-4">
								<label htmlFor="published" className="ed-label cursor-pointer">
									Published
								</label>
								<Switch
									id="published"
									checked={formData.published}
									onCheckedChange={(checked) =>
										setFormData((prev) => ({ ...prev, published: checked }))
									}
								/>
							</div>

							<div className="flex flex-col gap-2.5 border-t border-[var(--rule)] pt-6">
								<Button type="submit" disabled={isSubmitting} className="w-full">
									{isSubmitting ? "Saving…" : "Save changes"}
								</Button>
								<Button type="button" variant="outline" asChild className="w-full">
									<Link href="/admin/blog">Cancel</Link>
								</Button>
							</div>
						</div>
					</AdminPanel>

					<AdminPanel title="Featured image" note="Optional">
						<ImageUpload
							onUploadComplete={(url) => {
								setImageUrl(url);
								setFormData((prev) => ({ ...prev, thumbnail: url }));
							}}
							defaultImageUrl={imageUrl}
						/>
					</AdminPanel>
				</div>
			</form>
		</div>
	);
}
