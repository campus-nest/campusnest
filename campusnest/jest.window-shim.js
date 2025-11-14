// Prevent RN/jest from redefining window when running under jsdom
if (typeof window !== "undefined") {
  Object.defineProperty(global, "window", {
    value: window,
    writable: true,
    configurable: true,
  });
}
