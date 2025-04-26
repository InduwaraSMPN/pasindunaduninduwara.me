// This is a custom server file that can be run with bun --watch or bun --hot
// It demonstrates how to create a simple HTTP server with Bun

// Global counter to demonstrate state persistence with --hot mode
declare global {
  var requestCount: number;
}

// Initialize the counter if it doesn't exist
globalThis.requestCount ??= 0;

// Create a simple HTTP server
const server = Bun.serve({
  port: 3002,
  fetch(req) {
    // Increment the request counter
    globalThis.requestCount++;
    
    // Get the current timestamp
    const timestamp = new Date().toISOString();
    
    // Log the request to the console
    console.log(`[${timestamp}] Request received: ${req.url} (Total: ${globalThis.requestCount})`);
    
    // Return a JSON response
    return new Response(
      JSON.stringify({
        message: "Hello from Bun server!",
        timestamp,
        requestCount: globalThis.requestCount,
        note: "Try changing this message and saving the file to see hot reloading in action!"
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  },
});

console.log(`Server running at http://localhost:${server.port}`);
console.log(`Try making changes to this file and see them reflected immediately!`);
console.log(`With --hot mode, the request counter will persist between reloads.`);
