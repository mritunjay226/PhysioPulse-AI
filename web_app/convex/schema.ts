import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users synchronized from Clerk or created upon authenticated session
  users: defineTable({
    tokenIdentifier: v.string(),
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.optional(v.union(v.literal("patient"), v.literal("therapist"), v.literal("admin"))),
    createdAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_clerk_id", ["clerkId"]),

  // Clinical rehabilitation telemetry and session results
  sessions: defineTable({
    userId: v.optional(v.string()),
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
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),

  // Prescribed therapy regimens formulated from Intake or OCR
  prescriptions: defineTable({
    userId: v.optional(v.string()),
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
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),

  // Scanned Doctor Notes & Clinical Prescriptions
  doctorReports: defineTable({
    userId: v.optional(v.string()),
    patientName: v.string(),
    doctorName: v.optional(v.string()),
    clinic: v.optional(v.string()),
    rawText: v.string(),
    diagnosis: v.optional(v.string()),
    confidenceScore: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),
});
