import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Save a completed clinical rehabilitation session and kinematic evaluation.
 */
export const saveSession = mutation({
  args: {
    sessionId: v.optional(v.string()),
    patientName: v.string(),
    age: v.number(),
    affectedArea: v.string(),
    painLevel: v.number(),
    prescribedDiagnosis: v.string(),
    overallCompliancePercent: v.number(),
    exercisesPerformed: v.array(
      v.object({
        protocol_id: v.number(),
        protocol_name: v.string(),
        prescribed_reps: v.number(),
        completed_reps: v.number(),
        target_rom_degrees: v.number(),
        achieved_peak_rom_degrees: v.number(),
        mean_symmetry_percent: v.number(),
        compensation_frames_detected: v.number(),
        primary_compensation_issue: v.string(),
        duration_seconds: v.number(),
      })
    ),
    evaluation: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.tokenIdentifier ?? "anonymous";

    const id = await ctx.db.insert("sessions", {
      userId,
      sessionId: args.sessionId ?? `sess_${Date.now()}`,
      patientName: args.patientName,
      age: args.age,
      affectedArea: args.affectedArea,
      painLevel: args.painLevel,
      prescribedDiagnosis: args.prescribedDiagnosis,
      overallCompliancePercent: args.overallCompliancePercent,
      exercisesPerformed: args.exercisesPerformed,
      evaluation: args.evaluation,
      createdAt: Date.now(),
    });

    return id;
  },
});

/**
 * List recent sessions for current user or all sessions if clinician.
 */
export const listSessions = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const limit = args.limit ?? 20;

    if (identity) {
      const userSessions = await ctx.db
        .query("sessions")
        .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
        .order("desc")
        .take(limit);

      if (userSessions.length > 0) {
        return userSessions;
      }
    }

    // Fallback: return most recent sessions by timestamp
    return await ctx.db
      .query("sessions")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);
  },
});

/**
 * Get a single session by Convex ID.
 */
export const getSession = query({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Aggregate summary metrics across all user sessions.
 */
export const getClinicalSummaryStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    let sessionsQuery;

    if (identity) {
      sessionsQuery = ctx.db
        .query("sessions")
        .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier));
    } else {
      sessionsQuery = ctx.db.query("sessions");
    }

    const sessions = await sessionsQuery.order("desc").take(50);

    const totalSessions = sessions.length;
    if (totalSessions === 0) {
      return {
        totalSessions: 0,
        averageCompliance: 0,
        totalReps: 0,
        recentSessions: [],
      };
    }

    const totalCompliance = sessions.reduce((acc, s) => acc + s.overallCompliancePercent, 0);
    const totalReps = sessions.reduce((acc, s) => {
      const sessionReps = s.exercisesPerformed.reduce((eAcc, e) => eAcc + e.completed_reps, 0);
      return acc + sessionReps;
    }, 0);

    return {
      totalSessions,
      averageCompliance: Math.round(totalCompliance / totalSessions),
      totalReps,
      recentSessions: sessions.slice(0, 5),
    };
  },
});
