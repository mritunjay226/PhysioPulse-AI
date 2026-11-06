import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Save formulated physical therapy prescription.
 */
export const savePrescription = mutation({
  args: {
    patientName: v.string(),
    age: v.number(),
    affectedArea: v.string(),
    painLevel: v.number(),
    symptoms: v.string(),
    circuitMode: v.string(),
    clinicalDiagnosisSummary: v.string(),
    precautions: v.string(),
    exercises: v.array(
      v.object({
        protocol_id: v.number(),
        protocol_name: v.string(),
        target_reps: v.number(),
        target_rom_degrees: v.number(),
        clinical_rationale: v.string(),
      })
    ),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.tokenIdentifier ?? "anonymous";

    return await ctx.db.insert("prescriptions", {
      userId,
      patientName: args.patientName,
      age: args.age,
      affectedArea: args.affectedArea,
      painLevel: args.painLevel,
      symptoms: args.symptoms,
      circuitMode: args.circuitMode,
      clinicalDiagnosisSummary: args.clinicalDiagnosisSummary,
      precautions: args.precautions,
      exercises: args.exercises,
      source: args.source,
      createdAt: Date.now(),
    });
  },
});

/**
 * Query recent prescriptions.
 */
export const listPrescriptions = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const identity = await ctx.auth.getUserIdentity();

    if (identity) {
      const userPrescriptions = await ctx.db
        .query("prescriptions")
        .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
        .order("desc")
        .take(limit);

      if (userPrescriptions.length > 0) return userPrescriptions;
    }

    return await ctx.db
      .query("prescriptions")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);
  },
});
