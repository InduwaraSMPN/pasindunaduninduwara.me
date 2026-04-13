"use client";

import { ArrowUpRight, FolderOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { useProjects } from "@/lib/project-service";

export default function ProjectsList({
	limit = 3,
	isHomePage = false,
}: {
	limit?: number;
	isHomePage?: boolean;
}) {
	const { data: projects, isLoading, isError } = useProjects();

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{Array.from({ length: limit }).map((_, i) => (
					<Card key={i} className="animate-pulse">
						<div className="h-48 bg-muted/60 rounded-t-xl"></div>
						<CardHeader>
							<div className="h-5 bg-muted/60 rounded-lg w-3/4 mb-2"></div>
							<div className="h-4 bg-muted/40 rounded-lg w-1/2"></div>
						</CardHeader>
						<CardContent>
							<div className="h-3.5 bg-muted/40 rounded-lg w-full mb-2.5"></div>
							<div className="h-3.5 bg-muted/30 rounded-lg w-3/4"></div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (isError) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Error Loading Projects</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Unable to load projects. Please try again later.</p>
				</CardContent>
			</Card>
		);
	}

	if (!projects || projects.length === 0) {
		return (
			<div className="py-20 text-center">
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/60 mb-5">
					<FolderOpen className="h-7 w-7 text-muted-foreground/60" />
				</div>
				<p className="text-muted-foreground text-sm">No projects to show yet. Check back soon!</p>
			</div>
		);
	}

	return (
		<StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.1}>
			{projects?.slice(0, limit).map((project) => (
				<StaggerItem key={project.$id} className="h-full">
					<Link href={`/projects/${project.$id}`} className="block h-full">
						<Card className="overflow-hidden flex flex-col group h-full cursor-pointer">
							{project.image && (
								<div className="relative h-48 w-full overflow-hidden">
									<Image
										src={project.image}
										alt={project.title}
										fill
										sizes="(max-width: 768px) 100vw, 33vw"
										className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.04]"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
								</div>
							)}
							<CardHeader>
								<CardTitle className="font-heading text-lg group-hover:text-accent-warm transition-colors duration-300">
									{project.title}
								</CardTitle>
								<div className="flex flex-wrap gap-1.5 mt-2">
									{isHomePage && project.tags.length > 5 ? (
										<>
											{project.tags.slice(0, 5).map((tag, index) => (
												<Badge key={index} variant="secondary" className="text-[10px] px-2 py-0">
													{tag}
												</Badge>
											))}
											<Badge
												variant="outline"
												className="text-[10px] px-2 py-0 text-muted-foreground/60"
											>
												+{project.tags.length - 5}
											</Badge>
										</>
									) : (
										project.tags.map((tag, index) => (
											<Badge key={index} variant="secondary" className="text-[10px] px-2 py-0">
												{tag}
											</Badge>
										))
									)}
								</div>
							</CardHeader>
							<CardContent className="flex-grow">
								<p className="text-sm text-muted-foreground/80 line-clamp-3 leading-relaxed">
									{project.description}
								</p>
							</CardContent>
							<CardFooter>
								<span className="text-accent-warm text-sm font-heading font-medium inline-flex items-center gap-1">
									View Project
									<ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
								</span>
							</CardFooter>
						</Card>
					</Link>
				</StaggerItem>
			))}
		</StaggerContainer>
	);
}
