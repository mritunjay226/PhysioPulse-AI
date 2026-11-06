import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Save deciphered doctor prescription OCR record.
 */
export const saveDoctorReport = mutation({
  args: {
    patientName: v.string(),
    doctorName: v.optional(v.string()),
    clinic: v.optional(v.string()),
    rawText: v.string(),
    diagnosis: v.optional(v.string()),
    confidenceScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.tokenIdentifier ?? "anonymous";

    return await ctx.db.insert("doctorReports", {
      userId,
      patientName: args.patientName,
      doctorName: args.doctorName,
      clinic: args.clinic,
      rawText: args.rawText,
      diagnosis: args.diagnosis,
      confidenceScore: args.confidenceScore,
      createdAt: Date.now(),
    });
  },
});

/**
 * List scanned doctor reports.
 */
export const listDoctorReports = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const identity = await ctx.auth.getUserIdentity();

    if (identity) {
      const userReports = await ctx.db
        .query("doctorReports")
        .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
        .order("desc")
        .take(limit);

      if (userReports.length > 0) return userReports;
    }

    return await ctx.db
      .query("doctorReports")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);
  },
});
