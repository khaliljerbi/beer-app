// setupTests.ts
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./src/mocks/node";

process.env.VITE_PUBLIC_API = "https://punkapi.online/v3";

server.events.on("request:start", ({ request }) => {
  console.log("[MSW] Request intercepted:", request.method, request.url);
});

beforeAll(() => {
  server.listen({ onUnhandledRequest: "warn" });
  console.log("server listening....");
});
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
