/**
 * This file contains the root router of your tRPC-backend
 */
import { t } from '../trpc'
import { healthRouter } from './health'
import { postRouter } from './post'
import { tagRouter } from './tag'

export const appRouter = t.router({
  post: postRouter,
  health: healthRouter,
  tag: tagRouter
})

export type AppRouter = typeof appRouter
