'use server'

import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"

export async function hasKeySet() {
  const { userId } = await auth()
  const user = await (await clerkClient()).users.getUser(userId)
  return user.privateMetadata?.openai_api_key !== undefined
}

export async function setKey(key: string) {
  const { userId } = await auth()
  await (await clerkClient()).users.updateUserMetadata(userId, {
    privateMetadata: {
      openai_api_key: key,
    },
  })
}