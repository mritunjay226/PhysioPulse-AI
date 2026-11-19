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

/**
 * Update the clinical health profile for the authenticated user.
 */
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    age: v.optional(v.number()),
    phone: v.optional(v.string()),
    gender: v.optional(v.string()),
    affectedArea: v.optional(v.string()),
    painLevel: v.optional(v.number()),
    medicalHistory: v.optional(v.string()),
    emergencyContact: v.optional(v.string()),
    role: v.optional(v.union(v.literal("patient"), v.literal("therapist"), v.literal("admin"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required: Please sign in to update your profile");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      // Auto-create user if record hasn't synced yet
      const newId = await ctx.db.insert("users", {
        tokenIdentifier: identity.tokenIdentifier,
        clerkId: identity.subject,
        name: args.name || identity.name || "PhysioPulse Patient",
        email: identity.email,
        imageUrl: identity.pictureUrl,
        age: args.age,
        phone: args.phone,
        gender: args.gender,
        affectedArea: args.affectedArea,
        painLevel: args.painLevel,
        medicalHistory: args.medicalHistory,
        emergencyContact: args.emergencyContact,
        role: args.role ?? "patient",
        profileCompleted: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return newId;
    }

    const updates: Record<string, any> = {
      profileCompleted: true,
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.age !== undefined) updates.age = args.age;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.gender !== undefined) updates.gender = args.gender;
    if (args.affectedArea !== undefined) updates.affectedArea = args.affectedArea;
    if (args.painLevel !== undefined) updates.painLevel = args.painLevel;
    if (args.medicalHistory !== undefined) updates.medicalHistory = args.medicalHistory;
    if (args.emergencyContact !== undefined) updates.emergencyContact = args.emergencyContact;
    if (args.role !== undefined) updates.role = args.role;

    await ctx.db.patch(user._id, updates);
    return user._id;
  },
});
