import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import { Client, Databases, ID, Query, Storage } from "node-appwrite";

const client = new Client()
	.setEndpoint("https://sgp.cloud.appwrite.io/v1")
	.setProject("pasindunaduninduwara-me")
	.setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);
const DB = "portfolio_db";
const BUCKET = "images";
const ENDPOINT = "https://sgp.cloud.appwrite.io/v1";
const PROJECT = "pasindunaduninduwara-me";

const STORAGE_DIR = "ufnvbcgenocuydzzoxja.storage/ufnvbcgenocuydzzoxja/images/public";
const OLD_BASE_URL =
	"https://ufnvbcgenocuydzzoxja.supabase.co/storage/v1/object/public/images/public/";

function getFileUrl(fileId) {
	return `${ENDPOINT}/storage/buckets/${BUCKET}/files/${fileId}/view?project=${PROJECT}`;
}

async function uploadFiles() {
	const urlMap = {}; // old filename -> new appwrite URL

	const files = readdirSync(STORAGE_DIR);
	for (const filename of files) {
		const filepath = join(STORAGE_DIR, filename);
		const stat = statSync(filepath);
		if (!stat.isFile() || filename === ".folder") continue;

		try {
			const fileBuffer = readFileSync(filepath);
			const blob = new Blob([fileBuffer]);
			const file = new File([blob], filename);

			const result = await storage.createFile(BUCKET, ID.unique(), file);
			const newUrl = getFileUrl(result.$id);
			const oldUrl = OLD_BASE_URL + filename;
			urlMap[oldUrl] = newUrl;
			console.log(`  ✓ ${filename} → ${result.$id}`);
		} catch (e) {
			console.error(`  ✗ ${filename}: ${e.message}`);
		}
	}

	return urlMap;
}

async function updateDocuments(urlMap) {
	// Update projects
	const projects = await databases.listDocuments(DB, "projects", [Query.limit(100)]);
	for (const doc of projects.documents) {
		if (doc.image && urlMap[doc.image]) {
			await databases.updateDocument(DB, "projects", doc.$id, {
				image: urlMap[doc.image],
			});
			console.log(`  ✓ Project "${doc.title}" image updated`);
		}
	}

	// Update blog posts
	const posts = await databases.listDocuments(DB, "blog_posts", [Query.limit(100)]);
	for (const doc of posts.documents) {
		if (doc.thumbnail && urlMap[doc.thumbnail]) {
			await databases.updateDocument(DB, "blog_posts", doc.$id, {
				thumbnail: urlMap[doc.thumbnail],
			});
			console.log(`  ✓ Blog "${doc.title}" thumbnail updated`);
		}
	}
}

async function main() {
	console.log("Uploading files to Appwrite storage...\n");
	const urlMap = await uploadFiles();
	console.log(`\nUploaded ${Object.keys(urlMap).length} files.\n`);

	console.log("Updating document URLs...\n");
	await updateDocuments(urlMap);

	console.log("\nURL mapping:");
	for (const [old, newUrl] of Object.entries(urlMap)) {
		console.log(`  ${basename(old)} → ${newUrl}`);
	}

	console.log("\nStorage migration complete!");
}

main().catch(console.error);
