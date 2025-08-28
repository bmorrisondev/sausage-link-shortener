import { AnyDataModel, GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

async function getUserId(ctx: GenericQueryCtx<AnyDataModel>) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new Error("Not authenticated");
  }
  return identity.subject
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx)
    return await ctx.db
      .query("links")
      .filter((q) => q.eq(q.field("user_id"), userId))
      .collect();
  },
});

// Breakfast-themed emojis
const breakfastEmojis = [
  "🍳", "🥚", "🥞", "🧇", "🥯", "🍞", "🥖", "🥐", "🥓", "🥩",
  "🧈", "🧂", "🧀", "🍎", "🍌", "🍇", "🍓", "🍉", "🍊", "🥭",
  "🍍", "☕", "🥛", "🍵", "🧃", "🥙", "🌯", "🥟", "🍯"
];

function getRandomBreakfastEmojis(length: number): string {
  const result = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * breakfastEmojis.length);
    result.push(breakfastEmojis[randomIndex]);
  }
  return result.join("")
}

export const insert = mutation({
  args: {
    destination: v.string()
  },
  handler: async (ctx, { destination }) => {
    try {
      new URL(destination);
    } catch {
      throw new Error("Invalid URL");
    }

    const userId = await getUserId(ctx)
    let slug = getRandomBreakfastEmojis(12)
    let exists = await checkDoesSlugExist(ctx, slug)

    if(exists) {
      for(let i = 0; i < 3; i++) {
        if(exists) break
        slug = getRandomBreakfastEmojis(12)
        exists = await checkDoesSlugExist(ctx, slug)
      }
    }

    return await ctx.db.insert("links", {
      user_id: userId,
      destination,
      slug
    })
  },
})

async function checkDoesSlugExist(ctx: GenericMutationCtx<AnyDataModel>, slug: string): Promise<boolean> {
  return await ctx.db.query("links")
    .filter((q) => q.eq(q.field("slug"), slug))
    .first() ? true : false
}