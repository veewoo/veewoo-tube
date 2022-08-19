// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { videoRouter } from "./video";
import { protectedExampleRouter } from "./protected-example-router";
import { authRouter } from "./auth";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("video.", videoRouter)
  .merge("question.", protectedExampleRouter)
  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
