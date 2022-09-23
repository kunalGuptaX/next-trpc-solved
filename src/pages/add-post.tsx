import { trpc } from '../utils/trpc'

import { inferProcedureInput } from '@trpc/server'
import { Heading, Input, Textarea } from '@chakra-ui/react'
import { AppRouter } from '~/server/routers/_app'
import { useRouter } from 'next/router'
import TagsInput from '~/components/TagsInput'
import { useState } from 'react'
import { Tag } from '@prisma/client'

const AddPost = () => {
  const utils = trpc.useContext()
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  const addPost = trpc.post.add.useMutation({
    async onSuccess() {
      await utils.post.list.invalidate()
    }
  })

  console.log(selectedTags)

  const router = useRouter()
  return (
    <>
      <Heading size="lg">Add a Post</Heading>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const $form = e.currentTarget
          const values = Object.fromEntries(new FormData($form))
          type Input = inferProcedureInput<AppRouter['post']['add']>
          //    ^?
          const input: Input = {
            title: values.title as string,
            text: values.text as string,
            tags: selectedTags
          }
          try {
            await addPost.mutateAsync(input)

            $form.reset()
            router.push('/')
          } catch (cause) {
            console.error({ cause }, 'Failed to add post')
          }
        }}
      >
        <label htmlFor="title">Title:</label>
        <br />
        <Input
          id="title"
          name="title"
          type="text"
          disabled={addPost.isLoading}
        />

        <br />
        <label htmlFor="text">Text:</label>
        <br />
        <Textarea id="text" name="text" disabled={addPost.isLoading} />
        <br />
        <label htmlFor="tags">Tags:</label>
        <br />
        <TagsInput
          value={selectedTags}
          onChange={(tags) => {
            setSelectedTags(tags)
          }}
        />
        <br />
        <Input type="submit" disabled={addPost.isLoading} />
        {addPost.error && (
          <p style={{ color: 'red' }}>{addPost.error.message}</p>
        )}
      </form>
    </>
  )
}

export default AddPost
