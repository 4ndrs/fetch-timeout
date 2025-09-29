import index from "./index.html";

import { setTimeout } from "timers/promises";

console.log("serving connections on port 3000");

Bun.serve({
  idleTimeout: 0,
  routes: {
    "/": index,
    "/wait": async (request) => {
      const url = new URL(request.url);

      const ms = Number(url.searchParams.get("ms") || 0);

      await setTimeout(ms);

      return new Response("OK");
    },
  },
});
