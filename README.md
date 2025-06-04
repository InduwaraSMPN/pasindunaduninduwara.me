This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Using Bun's Watch and Hot Reload

This project includes scripts for using Bun's watch and hot reload features, which provide nodemon-like functionality:

### Next.js Development Server with Watch Mode

```bash
# Run Next.js dev server with Bun's watch mode (hard restarts)
bun run dev:watch
```

### Next.js Development Server with Hot Reload

```bash
# Run Next.js dev server with Bun's hot reload (soft reloads)
bun run dev:hot
```

### Custom Bun Server with Watch Mode

```bash
# Run the custom Bun server with watch mode
bun --watch server.ts
```

### Custom Bun Server with Hot Reload

```bash
# Run the custom Bun server with hot reload
bun --hot server.ts
```

The difference between `--watch` and `--hot`:

- `--watch` mode: Hard restarts the entire process when files change
- `--hot` mode: Soft reloads the code without restarting the process, preserving state

Try making changes to `server.ts` or `src/app/api/hello/route.ts` to see the different reload behaviors in action.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
