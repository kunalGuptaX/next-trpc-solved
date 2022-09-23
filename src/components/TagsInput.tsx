import {
  Box,
  Flex,
  Input,
  InputAddon,
  InputGroup,
  Stack,
  Tag as CTag,
  TagCloseButton,
  TagLabel
} from '@chakra-ui/react'
import { Tag } from '@prisma/client'
import React, { useEffect, useMemo, useState } from 'react'
import { trpc } from '~/utils/trpc'

type Props = {
  value?: Tag[]
  onChange?: (tags: Tag[]) => void
}

const TagsInput = ({ value, onChange }: Props) => {
  const [tagsInput, setTagsInput] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<Tag[]>(value || [])

  useEffect(() => {
    setTagsInput('')
    onChange?.(selectedTags)
  }, [selectedTags, onChange])

  const tags = trpc.tag.list.useQuery(
    { name: tagsInput },
    {
      enabled: tagsInput?.length > 2
    }
  )

  const createTag = trpc.tag.add.useMutation({
    async onSuccess(data) {
      setSelectedTags((prev) => [...prev, data])
    }
  })

  const dropdownOptions = useMemo(() => {
    if (tags.data?.length) {
      return tags.data.filter(
        (tag: Tag) => !selectedTags.some((t) => t.id === tag.id)
      )
    }
    return []
  }, [tags, selectedTags])

  return (
    <>
      <InputGroup>
        {selectedTags?.length > 0 && (
          <InputAddon>
            {selectedTags.map((tag) => (
              <CTag
                size="md"
                key={tag.id}
                borderRadius="full"
                variant="solid"
                colorScheme="green"
              >
                <TagLabel>{tag.name}</TagLabel>
                <TagCloseButton
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.filter((t) => t.id !== tag.id)
                    )
                  }}
                />
              </CTag>
            ))}
          </InputAddon>
        )}
        <Input
          name="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </InputGroup>
      <Stack>
        {dropdownOptions.map((option: Tag) => (
          <Box
            padding={3}
            _hover={{ backgroundColor: '#3182ce', color: 'white' }}
            cursor="pointer"
            key={option.name}
            id={option.name}
            onClick={() => {
              setSelectedTags((prev) => [...prev, option])
            }}
          >
            {option.name}
          </Box>
        ))}
        {tagsInput?.length > 2 &&
        !dropdownOptions.find((tag: Tag) => tag.name === tagsInput) &&
        !selectedTags.find((tag) => tag.name === tagsInput) ? (
          <Flex
            padding={3}
            _hover={{ backgroundColor: '#3182ce', color: 'white' }}
            cursor="pointer"
            key={tagsInput}
            id={tagsInput}
            onClick={() => {
              createTag.mutate({ name: tagsInput })
            }}
            alignItems="center"
          >
            {tagsInput}{' '}
            <CTag
              marginLeft="8px"
              size="sm"
              borderRadius="full"
              variant="solid"
            >
              Add Tag
            </CTag>
          </Flex>
        ) : null}
      </Stack>
    </>
  )
}

export default TagsInput
