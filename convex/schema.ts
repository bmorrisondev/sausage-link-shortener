import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  links: defineTable({
    destination: v.string(),
    description: v.optional(v.string()),
    slug: v.string(),
    user_id: v.string(),
    search_key: v.optional(v.string())
  })
  .searchIndex("search_key", {
    searchField: "search_key",
    filterFields: ["user_id"],
  }),
  link_hits: defineTable({
    link_id: v.id("links"),
  })
});