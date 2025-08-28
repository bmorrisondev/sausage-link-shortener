import { AnyDataModel, GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const getLinkById = query ({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx)
    const link = await ctx.db.query("links").filter((q) => q.and(q.eq(q.field("_id"), id), q.eq(q.field("user_id"), userId))).first()
    if(!link) {
      throw new Error("Link not found")
    }
    return link
  }
})

export const getLink = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db.query("links").filter((q) => q.eq(q.field("slug"), slug)).first()
  }
})

export const getLinkAndHit = mutation({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {

    const link = await ctx.db.query("links").filter((q) => q.eq(q.field("slug"), slug)).first()
    if (!link) {
      throw new Error("Link not found");
    }
    await ctx.runMutation(internal.links.hitLinkInternal, { linkId: link._id })
    return link
  }
})

export const hitLinkInternal = internalMutation({
  args: { linkId: v.id("links") },
  handler: async (ctx, args) => {
    await ctx.db.insert("link_hits", {
      link_id: args.linkId,
    });
  },
});

// TODO: type this
async function getUserId(ctx: GenericQueryCtx<any>) {
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
    destination: v.string(),
    description: v.optional(v.string()),
    qr_code: v.optional(v.string())
  },
  handler: async (ctx, { destination, description, qr_code }) => {
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
        if(!exists) break
        slug = getRandomBreakfastEmojis(12)
        exists = await checkDoesSlugExist(ctx, slug)
      }
    }

    if(exists) {
      throw new Error("Slug already exists")
    }

    const id = await ctx.db.insert("links", {
      user_id: userId,
      destination,
      description,
      slug,
      qr_code,
      search_key: `${slug} ${destination} ${description}`
    })

    return {
      id,
      slug,
      destination,
      description,
      qr_code,
      search_key: `${slug} ${destination} ${description}`
    }
  },
})

async function checkDoesSlugExist(ctx: GenericMutationCtx<AnyDataModel>, slug: string): Promise<boolean> {
  return await ctx.db.query("links")
    .filter((q) => q.eq(q.field("slug"), slug))
    .first() ? true : false
}

export const deleteLink = mutation({
  args: {
    linkId: v.id("links")
  },
  handler: async (ctx, { linkId }) => {
    await ctx.db.delete(linkId)
  }
})

export const updateLink = mutation({
  args: {
    linkId: v.id("links"),
    destination: v.optional(v.string()),
    description: v.optional(v.string()),
    qr_code: v.optional(v.string())
  },
  handler: async (ctx, { linkId, destination, description, qr_code }) => {
    const userId = await getUserId(ctx)
    const link = await ctx.db
      .query("links")
      .filter((q) => q.and(q.eq(q.field("_id"), linkId), q.eq(q.field("user_id"), userId))).first()
    if(!link) {
      throw new Error("Link not found")
    }
    await ctx.db.patch(linkId, {
      destination: destination || link.destination,
      description: description || link.description,
      qr_code: qr_code || link.qr_code,
      search_key: `${link.slug} ${destination || link.destination} ${description || link.description}`
    })
  }
})

export const getLinkStats = query({
  args: {
    linkId: v.id("links"),
    start: v.optional(v.number()),
    end: v.optional(v.number()),
    aggregateBy: v.union(
      v.literal("hour"), 
      v.literal("day"), 
      v.literal("week"), 
      v.literal("month"), 
      v.literal("year")
    ),
    // limit: v.optional(v.number()),
    // offset: v.optional(v.number()),
    // sort: v.optional(v.string()),
    // sortDirection: v.optional(v.string()),
  },
  handler: async (ctx, { linkId, start, end, aggregateBy }) => {
    const userId = await getUserId(ctx)

    const link = await ctx.db.query('links').filter(q => q.and(q.eq(q.field("_id"), linkId), q.eq(q.field("user_id"), userId))).first()
    if(!link) {
      throw new Error("Link not found")
    }

    // TODO: I think I need to set query again but not 100% sure
    const query = ctx.db.query("link_hits").filter((q) => q.eq(q.field("link_id"), linkId))
    if(start) {
      query.filter((q) => q.gte(q.field("_creationTime"), start))
    }
    if(end) {
      query.filter((q) => q.lte(q.field("_creationTime"), end))
    }
    // TODO: Maybe add limit and offset
    // if(limit) {
    //   query.limit(limit)
    // }
    // if(offset) {
    //   query.offset(offset)
    // }
    // if(sort) {
    //   query.sort((q) => q.field(sort), sortDirection === "desc" ? "desc" : "asc")
    // }
    const records = await query.collect()
    
    // Group and sum by the specified aggregate
    const aggregated: Record<string, number> = {}
    
    records.forEach(record => {
      const date = new Date(record._creationTime)
      let key: string
      
      switch (aggregateBy) {
        case "hour":
          key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}`
          break
        case "day":
          key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          break
        case "week":
          // Get the first day of the week (Sunday)
          const firstDay = new Date(date)
          const day = date.getDay()
          firstDay.setDate(date.getDate() - day)
          key = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
          break
        case "month":
          key = `${date.getFullYear()}-${date.getMonth() + 1}`
          break
        case "year":
          key = `${date.getFullYear()}`
          break
        default:
          key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      }
      
      if (!aggregated[key]) {
        aggregated[key] = 0
      }
      aggregated[key] += 1
    })
    
    // Convert to array format for easier consumption by the client
    const result = Object.entries(aggregated).map(([key, count]) => ({
      key,
      count
    }))
    
    return {
      total: records.length,
      aggregated: result
    }
  }
})

export const searchLinks = query({
  args: {
    query: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { query, limit }) => {
    if(!limit) limit = 10 
    const userId = await getUserId(ctx)
    if(query) { 
      return await ctx.db
        .query("links")
        .withSearchIndex("search_key", (q) => 
          q.search("search_key", query).eq("user_id", userId))
        .take(limit);
    }
    return await ctx.db
      .query("links")
      .filter((q) => q.eq(q.field("user_id"), userId))
      .take(limit);
  },
})
