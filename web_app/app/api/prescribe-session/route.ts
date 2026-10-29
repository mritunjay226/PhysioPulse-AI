import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { getPrescriptionPath } from '@/lib/paths';
import {
  deterministicPrescriptionEngine,
  PatientIntakeInput,
  PrescriptionOutput
} from '@/lib/clinical-engine';
import { callLLM } from '@/lib/llm-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input: PatientIntakeInput = {
      name: body.name || 'Anonymous Patient',
      age: Number(body.age) || 35,
      affectedArea: body.affectedArea || 'Shoulder & Neck',
      painLevel: Number(body.painLevel) || 5,
      symptoms: body.symptoms || 'General stiffness and movement restriction.',
      selectedProtocols: Array.isArray(body.selectedProtocols) ? body.selectedProtocols : undefined,
      circuitMode: body.circuitMode || 'standard'
    };

    let prescription: PrescriptionOutput | null = null;
    let source = 'deterministic_engine';

    // Target count based on circuit mode
    const minExercises = input.circuitMode === 'targeted' ? 3 : input.circuitMode === 'comprehensive' ? 4 : 3;
    const maxExercises = input.circuitMode === 'targeted' ? 4 : input.circuitMode === 'comprehensive' ? 5 : 5;

    // System prompt for LLM Agent
    const systemPrompt = `You are an elite Clinical Physical Therapy & Biomechanics AI Specialist.
Given the patient's intake data, formulate a comprehensive, multi-joint kinetic chain rehabilitation circuit (strictly selecting between ${minExercises} and ${maxExercises} sequential exercises) from the following 8 available protocols in the PhysioPulse suite:
Protocol 1: Frozen Shoulder Abduction (Glenohumeral Joint)
Protocol 2: Post-ACL Knee Extension & Squat (Tibiofemoral Joint)
Protocol 3: Cervical & Ergonomic Posture Guard (Cervical Spine)
Protocol 4: Post-Fracture Elbow Flexion Rehab (Humeroulnar Joint)
Protocol 5: Bilateral Overhead Wall-Slide Sync (Bilateral Shoulder)
Protocol 6: Total Hip Replacement Side Abduction (Coxofemoral Joint)
Protocol 7: Lumbar Spine Flexion / Slip-Disc Rehab (Lumbar Spine)
Protocol 8: Carpal Tunnel Wrist & Forearm Extension (Radiocarpal Joint)

CRITICAL CLINICAL DIRECTIVE: In modern orthopedic rehabilitation, isolated joint training triggers compensatory movement pathology. You MUST formulate a cohesive kinetic chain circuit containing:
1. Primary Agonist Joint (directly resolving the patient's primary complaint)
2. Functional Synergist / Core Stabilizer (e.g., Hip Abduction Gluteus Medius for Knee ACL stabilization; Bilateral Wall-Slide for Scapulohumeral rhythm; Elbow for Carpal Tunnel)
3. Axial Postural Anchor (Cervical Posture Guard Protocol 3 or Lumbar Spine Protocol 7)
Ensure the output contains ${minExercises} to ${maxExercises} sequential exercises!

You MUST respond ONLY with a valid JSON object matching this exact schema:
{
  "patient_name": "String",
  "clinical_diagnosis_summary": "String explaining the orthopedic kinetic chain rationale",
  "precautions": "Specific clinical precautions regarding movement velocity, compensation avoidance, or pain threshold",
  "exercises": [
    {
      "protocol_id": 1,
      "protocol_name": "P1: Frozen Shoulder Abduction",
      "target_reps": 5,
      "target_rom_degrees": 90,
      "clinical_rationale": "Restores lateral glenohumeral abduction without scapular elevation."
    }
  ]
}`;

    const userPrompt = `Patient Intake Information:
Name: ${input.name}
Age: ${input.age}
Affected Body Area: ${input.affectedArea}
Pain Level (1-10): ${input.painLevel}
Circuit Depth Target: ${input.circuitMode || 'standard'} (${minExercises}-${maxExercises} exercises)
${input.selectedProtocols && input.selectedProtocols.length > 0 ? `Patient Selected Body Joints: Protocols ${input.selectedProtocols.join(', ')}` : ''}
Patient Natural Language Description: "${input.symptoms}"

Map the symptoms and kinetic chain synergists to ${minExercises}-${maxExercises} protocols from the 8 available and output the complete JSON prescription.`;

    // Attempt LLM generation
    const llmResult = await callLLM(systemPrompt, userPrompt, 10000);
    if (llmResult) {
      try {
        const parsed = JSON.parse(llmResult);
        if (parsed.exercises && Array.isArray(parsed.exercises) && parsed.exercises.length > 0) {
          prescription = {
            patient_name: parsed.patient_name || input.name,
            clinical_diagnosis_summary: parsed.clinical_diagnosis_summary || 'Targeted Physical Therapy Prescription',
            precautions: parsed.precautions || 'Maintain neutral spine and adhere to target velocity.',
            exercises: parsed.exercises.map((ex: any) => ({
              protocol_id: Number(ex.protocol_id) || 1,
              protocol_name: ex.protocol_name || `Protocol ${ex.protocol_id}`,
              target_reps: Number(ex.target_reps) || 5,
              target_rom_degrees: Number(ex.target_rom_degrees) || 90,
              clinical_rationale: ex.clinical_rationale || 'Functional mobility improvement.'
            }))
          };
          source = 'llm_agent';
        }
      } catch (parseErr) {
        console.warn('Failed to parse LLM JSON, falling back:', parseErr);
      }
    }

    // Deterministic fallback if LLM was unavailable or invalid
    if (!prescription) {
      prescription = deterministicPrescriptionEngine(input);
      source = 'deterministic_engine';
    }

    // Persist to prescribed_session.json in root directory
    const filePath = getPrescriptionPath();
    fs.writeFileSync(filePath, JSON.stringify(prescription, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      prescription,
      source,
      filePath
    });
  } catch (error: any) {
    console.error('Error generating prescription:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
