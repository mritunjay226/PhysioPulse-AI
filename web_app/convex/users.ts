import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Returns the currently authenticated user record from Convex database,
 * or null if unauthenticated or not yet stored.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    return user;
  },
});

/**
 * Sync or register a user upon authentication.
 */
export const storeUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.optional(v.union(v.literal("patient"), v.literal("therapist"), v.literal("admin"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const tokenIdentifier = identity ? identity.tokenIdentifier : args.clerkId;

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .first();

    if (existingUser) {
      // Update any changed fields
      await ctx.db.patch(existingUser._id, {
        name: args.name ?? existingUser.name,
        email: args.email ?? existingUser.email,
        imageUrl: args.imageUrl ?? existingUser.imageUrl,
        role: args.role ?? existingUser.role,
      });
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      tokenIdentifier,
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
      role: args.role ?? "patient",
      createdAt: Date.now(),
    });
  },
});

export const updateRole = mutation({
  args: {
    role: v.union(v.literal("patient"), v.literal("therapist"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User record not found");
    }

    await ctx.db.patch(user._id, { role: args.role });
    return user._id;
  },
});
