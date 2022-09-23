/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { t } from '../trpc'
import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { prisma } from '../prisma'

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
// const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
//   id: true,
//   title: true,
//   text: true,
//   createdAt: true,
//   updatedAt: true
// })

export const tagRouter = t.router({
  list: t.procedure
    .input(
      z.object({
        name: z.string().min(2)
      })
    )
    .query(async ({ input }) => {
      const { name } = input
      const tags = await prisma.tag.findMany({
        where: {
          name: {
            contains: name
          }
        }
      })
      return tags
    }),
  add: t.procedure
    .input(
      z.object({
        name: z.string().min(2)
      })
    )
    .mutation(async ({ input }) => {
      const post = await prisma.tag.create({
        data: input
      })
      return post
    })
})
