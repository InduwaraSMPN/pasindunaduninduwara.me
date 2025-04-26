# Bun Watch and Hot Reload Guide

This guide explains how to use Bun's watch and hot reload features as a replacement for nodemon in your Next.js project.

## Overview

Bun provides two types of automatic reloading:

1. **Watch Mode (`--watch`)**: Hard restarts the entire process when files change
2. **Hot Reload Mode (`--hot`)**: Soft reloads the code without restarting the process, preserving state

Both modes are more efficient than traditional file watchers like nodemon because they use native OS filesystem watchers.

## Available Scripts

This project includes several scripts that demonstrate Bun's watch and hot reload capabilities:

### Next.js Development Server

```bash
# Standard Next.js development server
bun run dev

# Next.js with watch mode (hard restarts)
bun run dev:watch

# Next.js with hot reload (soft reloads)
bun run dev:hot
```

### Custom Bun Server

```bash
# Run the custom server
bun run server

# Run the custom server with watch mode
bun run server:watch

# Run the custom server with hot reload
bun run server:hot
```

### Simple Script Example

```bash
# Run the example script with watch mode
bun run watch:example

# Run the example script with hot reload
bun run hot:example
```

## Key Differences Between Watch and Hot Reload

### Watch Mode (`--watch`)

- Completely restarts the process when files change
- Clears the terminal screen (unless `--no-clear-screen` is used)
- All state is lost between restarts
- Similar to nodemon's behavior
- Best for situations where you want a clean restart

### Hot Reload Mode (`--hot`)

- Reloads the code without restarting the process
- Preserves global state (variables in `globalThis`)
- HTTP servers remain running during reloads
- Faster than watch mode for development
- Best for maintaining state during development

## Testing the Difference

1. Run the custom server with watch mode:
   ```bash
   bun run server:watch
   ```

2. Make a request to http://localhost:3002 and note the request count
3. Edit the server.ts file and save it
4. Make another request - notice the count resets to 1 (process restarted)

5. Now run the server with hot reload:
   ```bash
   bun run server:hot
   ```

6. Make a request to http://localhost:3002 and note the request count
7. Edit the server.ts file and save it
8. Make another request - notice the count increments (state preserved)

## Best Practices

- Use `--watch` when you need clean restarts and don't care about preserving state
- Use `--hot` when you want to preserve state during development
- For production builds, use standard `bun run build` and `bun run start`
- Add `--no-clear-screen` when running multiple watch processes simultaneously

## Limitations

- Hot reload doesn't support browser-side hot module replacement (HMR)
- Some state might not be properly preserved in complex applications
- External connections (like database connections) might need to be manually managed

## Further Reading

- [Bun Documentation on Watch Mode](https://bun.sh/docs/cli/run#--watch)
- [Bun Documentation on Hot Reload](https://bun.sh/docs/cli/run#--hot)
