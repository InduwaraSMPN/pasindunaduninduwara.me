// This is a simple script to demonstrate Bun's watch mode
// Run it with: bun --watch scripts/watch-example.ts

// Global counter to demonstrate state persistence with --hot mode
declare global {
  var counter: number;
}

// Make this file a module
export {};

// Initialize the counter if it doesn't exist
globalThis.counter ??= 0;
globalThis.counter++;

console.log(`Script executed at: ${new Date().toISOString()}`);
console.log(`Counter value: ${globalThis.counter}`);
console.log(`Try changing this message and saving the file to see the changes!`);

// Keep the script running to demonstrate watch mode
// This is only needed for demonstration purposes
// In a real script, you might not need this
const interval = setInterval(() => {
  console.log(`Still watching... (${new Date().toLocaleTimeString()})`);
}, 5000);

// Handle process termination
process.on('SIGINT', () => {
  clearInterval(interval);
  console.log('Watch script terminated');
  process.exit(0);
});
