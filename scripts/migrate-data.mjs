import { Client, Databases, ID } from 'node-appwrite';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const client = new Client()
  .setEndpoint('https://sgp.cloud.appwrite.io/v1')
  .setProject('pasindunaduninduwara-me')
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DB = 'portfolio_db';

// Extract raw SQL from gzip backup
const rawSql = execSync(
  'gzip -dc "db_cluster-11-08-2025@16-43-04.backup.gz"',
  { maxBuffer: 50 * 1024 * 1024 }
).toString('utf8');

// Parse a COPY block for a given table
function parseCopyBlock(sql, tableName, columns) {
  const pattern = new RegExp(
    `COPY public\\.${tableName} \\([^)]+\\) FROM stdin;\\n([\\s\\S]*?)\\n\\\\\\.`,
    'm'
  );
  const match = sql.match(pattern);
  if (!match) {
    console.log(`No data found for ${tableName}`);
    return [];
  }

  const rawData = match[1];
  // Split by lines that start with a digit or UUID (actual rows)
  const rows = [];
  let currentRow = '';

  for (const line of rawData.split('\n')) {
    if (line === '' || line === '\\.') continue;
    // New row starts with a number or UUID
    if (/^\d+\t|^[0-9a-f]{8}-/.test(line)) {
      if (currentRow) rows.push(currentRow);
      currentRow = line;
    } else {
      // Continuation of multiline field
      currentRow += '\n' + line;
    }
  }
  if (currentRow) rows.push(currentRow);

  return rows.map(row => {
    const values = row.split('\t');
    const obj = {};
    columns.forEach((col, i) => {
      let val = values[i];
      if (val === undefined || val === '\\N') {
        obj[col] = null;
      } else {
        obj[col] = val;
      }
    });
    return obj;
  });
}

// Convert postgres array {a,b,c} to JS array
function pgArrayToArray(str) {
  if (!str || str === '\\N' || str === '{}') return [];
  return str.replace(/^\{/, '').replace(/\}$/, '').split(',').map(s => s.replace(/"/g, '').trim());
}

// Convert postgres bool to JS bool
function pgBool(val) {
  return val === 't' || val === 'true';
}

// Convert postgres timestamp to ISO
function pgTimestamp(val) {
  if (!val || val === '\\N') return null;
  return new Date(val).toISOString();
}

async function migrateProjects() {
  const rows = parseCopyBlock(rawSql, 'projects', [
    'id', 'title', 'description', 'full_description', 'image', 'tags', 'created_at', 'updated_at'
  ]);
  console.log(`Found ${rows.length} projects`);

  for (const row of rows) {
    try {
      await databases.createDocument(DB, 'projects', ID.unique(), {
        title: row.title,
        description: row.description,
        full_description: row.full_description,
        image: row.image || '',
        tags: pgArrayToArray(row.tags),
        created_at: pgTimestamp(row.created_at),
        updated_at: pgTimestamp(row.updated_at),
      });
      console.log(`  ✓ Project: ${row.title}`);
    } catch (e) {
      console.error(`  ✗ Project "${row.title}": ${e.message}`);
    }
  }
}

async function migrateBlogPosts() {
  const rows = parseCopyBlock(rawSql, 'blog_posts', [
    'id', 'title', 'slug', 'content', 'excerpt', 'thumbnail', 'categories',
    'published', 'published_at', 'created_at', 'updated_at'
  ]);
  console.log(`Found ${rows.length} blog posts`);

  for (const row of rows) {
    // Unescape postgres \r\n to actual newlines
    const content = (row.content || '').replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '');

    try {
      await databases.createDocument(DB, 'blog_posts', ID.unique(), {
        title: row.title,
        slug: row.slug,
        content: content,
        excerpt: row.excerpt,
        thumbnail: row.thumbnail,
        categories: pgArrayToArray(row.categories),
        published: pgBool(row.published),
        published_at: pgTimestamp(row.published_at),
        created_at: pgTimestamp(row.created_at),
        updated_at: pgTimestamp(row.updated_at),
      });
      console.log(`  ✓ Blog: ${row.title}`);
    } catch (e) {
      console.error(`  ✗ Blog "${row.title}": ${e.message}`);
    }
  }
}

async function migrateComments() {
  const rows = parseCopyBlock(rawSql, 'comments', [
    'id', 'post_id', 'name', 'email', 'content', 'approved', 'created_at'
  ]);
  console.log(`Found ${rows.length} comments`);

  for (const row of rows) {
    try {
      await databases.createDocument(DB, 'comments', ID.unique(), {
        post_id: String(row.post_id),
        name: row.name,
        email: row.email,
        content: row.content,
        approved: pgBool(row.approved),
        created_at: pgTimestamp(row.created_at),
      });
      console.log(`  ✓ Comment by: ${row.name}`);
    } catch (e) {
      console.error(`  ✗ Comment: ${e.message}`);
    }
  }
}

async function migrateMessages() {
  const rows = parseCopyBlock(rawSql, 'messages', [
    'id', 'name', 'email', 'subject', 'message', 'read', 'created_at'
  ]);
  console.log(`Found ${rows.length} messages`);

  for (const row of rows) {
    try {
      await databases.createDocument(DB, 'messages', ID.unique(), {
        name: row.name,
        email: row.email,
        subject: row.subject,
        message: row.message,
        read: pgBool(row.read),
        created_at: pgTimestamp(row.created_at),
      });
      console.log(`  ✓ Message from: ${row.name}`);
    } catch (e) {
      console.error(`  ✗ Message: ${e.message}`);
    }
  }
}

async function main() {
  console.log('Starting Supabase → Appwrite data migration...\n');

  await migrateProjects();
  console.log('');
  await migrateBlogPosts();
  console.log('');
  await migrateComments();
  console.log('');
  await migrateMessages();

  console.log('\nMigration complete!');
}

main().catch(console.error);
