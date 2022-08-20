// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { editVideoRouter, videoRouter } from "./video";
import { voteRouter } from "./vote";
import { authRouter } from "./auth";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("video.", videoRouter)
  .merge("editVideo.", editVideoRouter)
  .merge("voting.", voteRouter)
  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
