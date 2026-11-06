import { PrescriptionOutput } from '@/lib/clinical-engine';

export interface DoctorDetails {
  doctor_name: string;
  qualifications: string;
  hospital_or_clinic: string;
  department: string;
  registration_number: string;
  contact?: string;
  consultation_date: string;
  room?: string;
}

export interface PatientDetails {
  name: string;
  age: number;
  gender: string;
  uhid?: string;
  weight?: string;
  blood_pressure?: string;
  pulse?: string;
}

export interface DecodedShorthandTerm {
  raw_term: string;
  decoded_meaning: string;
  clinical_context: string;
}

export interface HandwritingAudit {
  legibility_score_percent: number;
  decipher_confidence_percent: number;
  handwriting_style: string;
  shorthand_terms_decoded: DecodedShorthandTerm[];
}

export interface ClinicalFindings {
  chief_complaints: string[];
  on_examination_signs: string[];
  radiology_findings: string[];
  diagnosis: string;
  icd10_code: string;
  severity_assessment: 'Mild' | 'Moderate' | 'Severe / Guarded';
}

export interface SessionExercise {
  protocol_id: number;
  protocol_name: string;
  target_reps: number;
  target_rom_degrees: number;
  clinical_rationale: string;
  sensor_focus: string;
  compensation_watch: string;
}

export interface SessionPlan {
  patient_name: string;
  affected_area: string;
  vas_pain_level: number;
  clinical_diagnosis_summary: string;
  precautions: string;
  circuit_mode: 'targeted' | 'standard' | 'comprehensive';
  exercises: SessionExercise[];
}

export interface MedicationItem {
  name: string;
  generic_composition: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  purpose: string;
  special_instructions: string;
}

export interface LifestyleAdaptation {
  category: 'Toilet & Hygiene' | 'Sitting & Posture' | 'Commute & Travel' | 'Sleep Ergonomics' | 'Physical Habits';
  directive: string;
  rationale: string;
  indian_context_note: string;
}

export interface TreatmentPlan {
  clinical_overview: string;
  medications: MedicationItem[];
  lifestyle_adaptations: LifestyleAdaptation[];
  red_flag_warnings: string[];
  dietary_and_hydration_notes: string[];
}

export interface DailyScheduleSlot {
  time_slot: string;
  period: 'Morning' | 'Midday' | 'Evening' | 'Night';
  title: string;
  action_items: string[];
  medications_due: string[];
  therapy_focus: string;
  is_physiopulse_session?: boolean;
}

export interface MilestonePhase {
  phase: string;
  title: string;
  goals: string[];
  target_rom_gain: string;
  frequency: string;
}

export interface RadiologyScanDetails {
  modality: 'xray' | 'mri' | 'ct' | 'prescription_only';
  modality_label: string; // e.g. "Musculoskeletal Digital Radiograph (Plain Film X-Ray)" or "High-Field 3.0T MRI Scan"
  body_region: string; // e.g. "Right Knee Compartment (AP/Lateral)" or "Right Shoulder (Coronal T2)"
  structural_findings: string[]; // e.g. ["Medial tibiofemoral joint space narrowing", "Subchondral sclerosis"]
  pathology_grade: string; // e.g. "Kellgren-Lawrence Grade 2 OA" or "High-Grade Partial Supraspinatus Tear"
  biomechanical_restrictions: {
    recommended_rom_cap_degrees?: number; // e.g. 70 or 85
    restricted_movements: string[]; // e.g. ["Avoid deep knee flexion > 90°"]
    contraindications: string[]; // e.g. ["No ballistic overhead loading in acute inflammatory phase"]
  };
}

export interface SchedulePlan {
  daily_schedule: DailyScheduleSlot[];
  milestones: MilestonePhase[];
  follow_up: {
    review_after_days: number;
    tentative_date: string;
    investigations_to_bring: string[];
    doctor_name: string;
  };
}

export interface DecipheredDoctorReport {
  id: string;
  source: 'llm_vision' | 'calibrated_sample';
  image_url?: string;
  raw_transcription: string;
  doctor_details: DoctorDetails;
  patient_details: PatientDetails;
  handwriting_audit: HandwritingAudit;
  clinical_findings: ClinicalFindings;
  radiology_scan?: RadiologyScanDetails;
  session_plan: SessionPlan;
  treatment_plan: TreatmentPlan;
  schedule: SchedulePlan;
}

/**
 * System prompt specifically designed to decode messy Indian handwritten prescriptions,
 * OPD consultation slips, Latin/Indian clinical shorthand, and Indian pharmaceutical brands.
 */
export const INDIAN_DOCTOR_OCR_SYSTEM_PROMPT = `You are the Chief Clinical Pharmacist and Medical Deciphering Specialist with 25+ years of experience interpreting handwritten Indian medical prescriptions, OPD consultation slips, and hospital discharge notes across premier institutions (AIIMS, Apollo, Fortis, Max, Manipal).

Doctors in India are renowned for writing in extreme hurried cursive loops, with specialized Latin, English, and regional medical shorthand. You possess complete domain mastery in reading and translating these into structured clinical data.

INDIAN MEDICAL SHORTHAND & SCRIPT CONVENTIONS TO DECIPHER:
1. CLINICAL HEADINGS:
   - "c/o" = Complaining of (chief complaints)
   - "k/c/o" = Known case of (pre-existing conditions like HTN, T2DM)
   - "h/o" = History of
   - "O/E" = On Examination (physical signs, palpation, tender points)
   - "Inv" = Investigations (MRI, X-Ray, Blood work)
   - "Dx" / "Imp" = Diagnosis / Clinical Impression
   - "Rx" = Prescriptions (Medications)
   - "Adv" = Advise (Physiotherapy, Ergonomics, Lifestyle constraints)
   - "F/U" or "R/A" = Follow-up or Review After (e.g., R/A 10 days)

2. DOSAGE & TIMING NOTATIONS IN INDIA:
   - "1-0-0" or "OD" = Once daily (morning)
   - "0-1-0" = Once daily (afternoon)
   - "0-0-1" or "HS" = Once daily at bedtime
   - "1-0-1" or "BD" / "BID" = Twice daily (morning & night)
   - "1-1-1" or "TDS" / "TID" = Three times daily (morning, afternoon, night)
   - "1-1-1-1" or "QID" = Four times daily
   - "SOS" = Si opus sit (only when needed for severe breakthrough pain)
   - "STAT" = Immediately (single emergency dose)
   - "BBF" = Before Breakfast (empty stomach)
   - "ac" = Ante cibum (before meals)
   - "pc" = Post cibum (after meals)

3. COMMON INDIAN PHARMA BRANDS & GENERICS (ORTHOPEDICS / PHYSIO):
   - Zerodol-SP / Zerodol-P (Aceclofenac + Paracetamol +/- Serratiopeptidase)
   - Pan-D / Pantocid-DSR / Razo-D (Pantoprazole/Rabeprazole + Domperidone)
   - Myoril 4mg / Muscoril / Thiocolchicoside (Muscle relaxant)
   - Shelcal 500 / Shelcal-HD (Calcium Carbonate + Vitamin D3)
   - Neurobion Forte / Rejunuron (Methylcobalamin / Vitamin B12)
   - Chymoral Forte (Trypsin-Chymotrypsin - anti-edema/swelling)
   - Dolo 650 / Calpol / Combiflam (Paracetamol / Ibuprofen)
   - Jointace DN (Glucosamine + Diacerein)
   - Maxmala 75 / Pregabalin + Methylcobalamin (Neuropathic radicular pain)
   - Tolperitas 150 / Tolperisone (Spinal muscle relaxant)
   - Defcort 6 / Deflazacort (Corticosteroid taper)
   - Volini gel / Omnigel / Dynapar QPS spray (Topical analgesics)

4. COMMON INDIAN ORTHOPEDIC CONDITIONS:
   - PIVD = Prolapsed Intervertebral Disc (Slip disc, sciatica)
   - LBA / LBP = Low Back Ache / Pain
   - CTS = Carpal Tunnel Syndrome
   - OA Knee B/L = Bilateral Osteoarthritis of the Knee
   - Cervical Spondylosis / CS with Trapezius spasm
   - Adhesive Capsulitis / Frozen Shoulder / Rotator cuff impingement
   - ACL laxity / meniscus tear

5. COMMON INDIAN LIFESTYLE & ERGONOMIC DIRECTIVES:
   - "Avoid Indian toilet / use Western commode only" (prevents acute knee & lumbar flexion stress)
   - "Avoid sitting on floor / cross-legged sitting (alti-palthi na maarein)"
   - "Avoid forward bending (jhukna mana hai) & heavy weight lifting"
   - "Wear Lumbo-sacral (LS) belt during travel / auto-rickshaw / two-wheeler commute"
   - "Hot water fomentation (garam paani ki sikaai) 15-20 min BD"
   - "SWD / IFT / TENS to affected joint"

6. MAPPING TO PHYSIOPULSE AI PROTOCOLS:
   Map the clinical findings to 3-5 sequential protocols from the 8 available in PhysioPulse:
   - Protocol 1: Frozen Shoulder Abduction (Glenohumeral Joint)
   - Protocol 2: Post-ACL Knee Extension & Squat (Tibiofemoral Joint)
   - Protocol 3: Cervical & Ergonomic Posture Guard (Cervical Spine)
   - Protocol 4: Post-Fracture Elbow Flexion Rehab (Humeroulnar Joint)
   - Protocol 5: Bilateral Overhead Wall-Slide Sync (Bilateral Shoulder / Scapulohumeral)
   - Protocol 6: Total Hip Replacement Side Abduction (Coxofemoral Joint)
   - Protocol 7: Lumbar Spine Flexion / Slip-Disc Rehab (Lumbar Spine)
   - Protocol 8: Carpal Tunnel Wrist & Forearm Extension (Radiocarpal Joint)

7. MUSCULOSKELETAL RADIOLOGY & IMAGING (X-RAY & MRI) ANALYSIS:
   If the provided image is a Plain Film Digital Radiograph (X-Ray), MRI Scan (T1, T2, PD Fat-Suppressed), or CT slice:
   - Detect imaging modality and anatomical projection (e.g. "Knee Bilateral Weight-Bearing AP Radiograph", "Shoulder Coronal Oblique T2 Fast Spin Echo").
   - Audit structural articular morphology: joint space narrowing, subchondral sclerosis, osteophytes, cortical disruption, tendon discontinuity (e.g., supraspinatus tear, subscapularis tendinopathy), ligamentous laxity (ACL/PCL/meniscal tear), or intervertebral disc herniation.
   - Establish pathological severity grade (e.g., Kellgren-Lawrence Grade 1-4, Patellofemoral Grade 2, Full-thickness vs Partial-thickness tear).
   - Formulate concrete biomechanical kinematic safety constraints:
     * Capped Target ROM (e.g., cap shoulder abduction at 65°-70° if high-grade rotator cuff tear or subacromial bone spur to prevent impingement; cap knee flexion at 80°-85° for Grade 2/3 osteoarthritis).
     * Movement contraindications (e.g., "Strictly avoid deep squats > 90°", "Forbid ballistic overhead movement", "Contraindicated lumbar forward flexion under load").

You MUST respond strictly with a valid JSON object matching this exact schema:
{
  "doctor_details": {
    "doctor_name": "String",
    "qualifications": "String",
    "hospital_or_clinic": "String",
    "department": "String",
    "registration_number": "String",
    "contact": "String",
    "consultation_date": "DD/MM/YYYY",
    "room": "String"
  },
  "patient_details": {
    "name": "String",
    "age": 35,
    "gender": "String",
    "uhid": "String",
    "weight": "String",
    "blood_pressure": "String",
    "pulse": "String"
  },
  "handwriting_audit": {
    "legibility_score_percent": 28,
    "decipher_confidence_percent": 96,
    "handwriting_style": "String describing cursive speed and pen loops, or 'Digital Radiograph / MRI Imaging Study'",
    "shorthand_terms_decoded": [
      {
        "raw_term": "String (e.g. 1-0-1 pc or T2 Hyperintensity)",
        "decoded_meaning": "String (e.g. 1 tablet twice daily after meals or Articular fluid edema)",
        "clinical_context": "String"
      }
    ]
  },
  "raw_transcription": "Verbatim line-by-line reading of the prescription or radiological diagnostic observation notes",
  "clinical_findings": {
    "chief_complaints": ["String"],
    "on_examination_signs": ["String"],
    "radiology_findings": ["String"],
    "diagnosis": "String",
    "icd10_code": "String",
    "severity_assessment": "Mild" | "Moderate" | "Severe / Guarded"
  },
  "radiology_scan": {
    "modality": "xray" | "mri" | "ct" | "prescription_only",
    "modality_label": "String (e.g. Weight-Bearing Digital AP Radiograph)",
    "body_region": "String (e.g. Bilateral Knee Compartment)",
    "structural_findings": ["String (e.g. Medial joint space loss, marginal osteophytes)"],
    "pathology_grade": "String (e.g. Kellgren-Lawrence Grade 2)",
    "biomechanical_restrictions": {
      "recommended_rom_cap_degrees": 85,
      "restricted_movements": ["String"],
      "contraindications": ["String"]
    }
  },
  "session_plan": {
    "patient_name": "String",
    "affected_area": "String",
    "vas_pain_level": 6,
    "clinical_diagnosis_summary": "String explaining kinetic chain formulation",
    "precautions": "String",
    "circuit_mode": "standard",
    "exercises": [
      {
        "protocol_id": 1,
        "protocol_name": "String",
        "target_reps": 8,
        "target_rom_degrees": 90,
        "clinical_rationale": "String",
        "sensor_focus": "String",
        "compensation_watch": "String"
      }
    ]
  },
  "treatment_plan": {
    "clinical_overview": "String",
    "medications": [
      {
        "name": "String",
        "generic_composition": "String",
        "dosage": "String",
        "frequency": "String",
        "timing": "String",
        "duration": "String",
        "purpose": "String",
        "special_instructions": "String"
      }
    ],
    "lifestyle_adaptations": [
      {
        "category": "Toilet & Hygiene" | "Sitting & Posture" | "Commute & Travel" | "Sleep Ergonomics" | "Physical Habits",
        "directive": "String",
        "rationale": "String",
        "indian_context_note": "String"
      }
    ],
    "red_flag_warnings": ["String"],
    "dietary_and_hydration_notes": ["String"]
  },
  "schedule": {
    "daily_schedule": [
      {
        "time_slot": "07:30 AM - 08:30 AM",
        "period": "Morning" | "Midday" | "Evening" | "Night",
        "title": "String",
        "action_items": ["String"],
        "medications_due": ["String"],
        "therapy_focus": "String",
        "is_physiopulse_session": false
      }
    ],
    "milestones": [
      {
        "phase": "Phase 1 (Days 1 - 4)",
        "title": "String",
        "goals": ["String"],
        "target_rom_gain": "String",
        "frequency": "String"
      }
    ],
    "follow_up": {
      "review_after_days": 10,
      "tentative_date": "String",
      "investigations_to_bring": ["String"],
      "doctor_name": "String"
    }
  }
}`;

/**
 * Calibrated realistic Indian doctor prescriptions for instant preview and offline fallback.
 */
export const CALIBRATED_INDIAN_PRESCRIPTIONS: Record<string, DecipheredDoctorReport> = {
  rotator_cuff: {
    id: 'report_rotator_sharma_01',
    source: 'calibrated_sample',
    image_url: '/prescriptions/dr_sharma_rotator_cuff.png',
    raw_transcription: `APOLLO HOSPITALS · NEW DELHI | Dept of Orthopaedics & Sports Medicine
Dr. R. K. Sharma, MS (Ortho - AIIMS), MCh Ortho (Dundee) | Reg: DMC/R/14298
Pt: Sarah Jenkins (Mrs.) | 38/F | Date: 27/10/2026 | BP: 122/80 | Wt: 62kg
c/o Severe Rt shoulder pain & guarded abduction x 6 wks.
    Difficulty lifting arm >80°, combing hair, reaching behind back.
    Chronic neck stiffness (desk worker, 9 hrs daily laptop).
O/E Supraspinatus tendon insertion point tenderness (+).
    Hawkins-Kennedy & Neer's impingement test: strongly +ve.
    Painful Arc between 60° - 110°. Trapezius spasm (+).
Inv MRI Rt Shoulder: Partial bursal tear supraspinatus + subacromial bursitis.
Dx  Subacromial Impingement / Frozen Shoulder (Phase II) + Cervical Spondylosis.
Rx  1. Tab Zerodol-SP (Aceclofenac+PCM+Serratiopeptidase) 1 tab BD pc x 5d
    2. Cap Pan-D 1 cap OD BBF x 5d
    3. Tab Myoril 4mg (Thiocolchicoside) 1 tab HS x 5d
    4. Tab Shelcal 500 1 tab OD pc x 30d
    5. Omnigel / Volini local application TDS (no hard massage).
Adv Active Kinetic Circuit: Protocol 1 (Shoulder) + Protocol 3 (Cervical) + Protocol 5 (Wall-Slide).
    Target ROM: 90° initially. Garam paani sikaai (hot fomentation) 15-20 min BD.
    Strictly avoid sudden overhead jerks or lifting heavy bags.
    R/A 10 days with PhysioPulse AI Compliance Report.`,
    doctor_details: {
      doctor_name: 'Dr. R. K. Sharma',
      qualifications: 'MBBS, MS (Ortho - AIIMS), MCh Ortho (Dundee)',
      hospital_or_clinic: 'Apollo Hospitals · New Delhi',
      department: 'Orthopaedics, Arthroscopy & Sports Medicine',
      registration_number: 'DMC/R/14298',
      contact: '+91 98101 23456',
      consultation_date: '27/10/2026',
      room: 'OPD-204 (Tower B)'
    },
    patient_details: {
      name: 'Sarah Jenkins',
      age: 38,
      gender: 'Female',
      uhid: 'APO-2026-98124',
      weight: '62 Kg',
      blood_pressure: '122/80 mmHg',
      pulse: '74 bpm'
    },
    handwriting_audit: {
      legibility_score_percent: 28,
      decipher_confidence_percent: 98,
      handwriting_style: 'Rapid Indian OPD cursive loop script with Latin pharmaceutical dosage shorthand',
      shorthand_terms_decoded: [
        {
          raw_term: '1 tab BD pc',
          decoded_meaning: '1 tablet twice daily after meals (Bis in die, post cibum)',
          clinical_context: 'Tab Zerodol-SP anti-inflammatory dosing to avoid gastric distress'
        },
        {
          raw_term: '1 cap OD BBF',
          decoded_meaning: '1 capsule once daily before breakfast / empty stomach (Omni die, Before Breakfast)',
          clinical_context: 'Cap Pan-D proton pump inhibitor protection'
        },
        {
          raw_term: '1 tab HS',
          decoded_meaning: '1 tablet at bedtime (Hora somni)',
          clinical_context: 'Tab Myoril 4mg muscle relaxant for nighttime muscular spasm'
        },
        {
          raw_term: 'c/o LBA / Shoulder',
          decoded_meaning: 'Complaining of (Chief medical complaint)',
          clinical_context: 'Chronic right shoulder abduction limitation x 6 weeks'
        },
        {
          raw_term: 'Garam paani sikaai',
          decoded_meaning: 'Moist hot water fomentation for 15-20 minutes',
          clinical_context: 'Increases local synovial elasticity prior to kinematic movement'
        },
        {
          raw_term: 'R/A 10 days',
          decoded_meaning: 'Review After 10 days (Follow-up appointment)',
          clinical_context: 'Assess pain reduction and progression to active abduction beyond 90°'
        }
      ]
    },
    clinical_findings: {
      chief_complaints: [
        'Severe right shoulder pain on active elevation (>80°)',
        'Inability to comb hair or hook bra / reach behind lumbar back',
        'Persistent cervical spine stiffness radiating to trapezius after desk work'
      ],
      on_examination_signs: [
        'Point tenderness over Supraspinatus tendon insertion at greater tuberosity',
        'Positive Hawkins-Kennedy and Neer subacromial impingement tests',
        'Painful Arc sign positive between 60° and 110° abduction',
        'Upper trapezius and levator scapulae myofascial spasm'
      ],
      radiology_findings: [
        'MRI Right Shoulder: Partial-thickness articular-sided bursal supraspinatus tear',
        'Subacromial-subdeltoid bursal effusion without full tendon retraction'
      ],
      diagnosis: 'Right Shoulder Subacromial Impingement & Adhesive Capsulitis (Phase II) with Cervical Trapezius Spasm',
      icd10_code: 'M75.10',
      severity_assessment: 'Moderate'
    },
    session_plan: {
      patient_name: 'Sarah Jenkins',
      affected_area: 'Shoulder & Cervical Spine',
      vas_pain_level: 6,
      clinical_diagnosis_summary: 'Targeted shoulder-cervical kinetic chain circuit designed to break adhesive capsulitis restrictions, restore glenohumeral abduction without compensatory trapezius shrugging, and release postural neck strain.',
      precautions: 'Do NOT force abduction past 90° if sharp anterior impingement pain occurs. Keep scapula retracted and avoid shoulder hiking.',
      circuit_mode: 'standard',
      exercises: [
        {
          protocol_id: 1,
          protocol_name: 'P1: Frozen Shoulder Abduction',
          target_reps: 8,
          target_rom_degrees: 90,
          clinical_rationale: 'Isolates pure glenohumeral coronal plane abduction, stretching the inferior capsular fold without scapular elevation.',
          sensor_focus: 'Glenohumeral joint angle (Right shoulder vs elbow vector)',
          compensation_watch: 'Watch for upper trapezius shrugging / trunk side-bend'
        },
        {
          protocol_id: 3,
          protocol_name: 'P3: Cervical & Ergonomic Posture Guard',
          target_reps: 10,
          target_rom_degrees: 85,
          clinical_rationale: 'Acts as the axial postural anchor, releasing hypertonic levator scapulae and stabilizing the cervical spine.',
          sensor_focus: 'Cervical angle and tragus-to-acromion plumb line',
          compensation_watch: 'Avoid forward head poking and cervical hyperextension'
        },
        {
          protocol_id: 5,
          protocol_name: 'P5: Bilateral Overhead Wall-Slide Sync',
          target_reps: 8,
          target_rom_degrees: 105,
          clinical_rationale: 'Promotes synchronous serratus anterior upward rotation and balanced scapulohumeral rhythm on both sides.',
          sensor_focus: 'Bilateral elbow-shoulder parallelism and forearm wall contact',
          compensation_watch: 'Detects bilateral asymmetry (>15% deviation triggers audio alert)'
        }
      ]
    },
    treatment_plan: {
      clinical_overview: 'Comprehensive non-surgical management combining anti-inflammatory relief, muscle relaxation, targeted computer vision kinetic therapy, and workstation ergonomic modifications.',
      medications: [
        {
          name: 'Tab Zerodol-SP',
          generic_composition: 'Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg',
          dosage: '1 tablet',
          frequency: '1-0-1 (Twice daily)',
          timing: 'After meals (pc)',
          duration: '5 days',
          purpose: 'Triple-action anti-inflammatory, analgesic, and enzymatic anti-edema agent',
          special_instructions: 'Take strictly after food to prevent gastric irritation. Avoid taking extra paracetamol.'
        },
        {
          name: 'Cap Pan-D',
          generic_composition: 'Pantoprazole 40mg + Domperidone 30mg SR',
          dosage: '1 capsule',
          frequency: '1-0-0 (Once daily)',
          timing: 'Empty stomach, 30 min before breakfast (BBF)',
          duration: '5 days',
          purpose: 'Proton pump inhibitor to protect stomach lining against NSAID gastritis',
          special_instructions: 'Swallow whole with a glass of water.'
        },
        {
          name: 'Tab Myoril 4mg',
          generic_composition: 'Thiocolchicoside 4mg',
          dosage: '1 tablet',
          frequency: '0-0-1 (Once daily at bedtime)',
          timing: 'Night before sleep (HS)',
          duration: '5 days',
          purpose: 'Centrally-acting muscle relaxant for nighttime trapezius & rotator cuff spasm',
          special_instructions: 'May cause mild drowsiness; avoid driving at night.'
        },
        {
          name: 'Tab Shelcal 500',
          generic_composition: 'Calcium Carbonate 1250mg (eq to Elemental Calcium 500mg) + Vitamin D3 250 IU',
          dosage: '1 tablet',
          frequency: '1-0-0 (Once daily)',
          timing: 'After lunch or breakfast (pc)',
          duration: '30 days',
          purpose: 'Bone mineral density support and tendon-bone junction recovery',
          special_instructions: 'Continue for full 1-month course.'
        },
        {
          name: 'Omnigel / Volini Ointment',
          generic_composition: 'Diclofenac Diethylamine + Methyl Salicylate + Menthol + Linseed Oil',
          dosage: 'Pea-sized amount',
          frequency: 'TDS (Three times daily)',
          timing: 'Morning, Afternoon, Night',
          duration: '10 days',
          purpose: 'Topical targeted anti-inflammatory without systemic load',
          special_instructions: 'Apply gently over shoulder and lateral neck. STRICTLY NO deep or vigorous massage!'
        }
      ],
      lifestyle_adaptations: [
        {
          category: 'Sitting & Posture',
          directive: 'Ergonomic screen elevation & elbow support at workstation',
          rationale: 'Prevents sustained trapezius shrugging and forward head posture while typing.',
          indian_context_note: 'Ensure laptop is placed on a riser or laptop stand with external keyboard; do not work sitting on bed or sofa.'
        },
        {
          category: 'Commute & Travel',
          directive: 'Avoid carrying heavy shoulder bags or one-sided purse (>2 kg)',
          rationale: 'Asymmetric loading overloads the inflamed supraspinatus tendon and triggers acute spasm.',
          indian_context_note: 'Switch to a balanced backpack with two padded straps or rolling trolley during office commute.'
        },
        {
          category: 'Sleep Ergonomics',
          directive: 'Sleep on non-affected left side or supine with pillow under right arm',
          rationale: 'Direct compression of the right shoulder at night causes subacromial ischemia and excruciating night pain.',
          indian_context_note: 'Avoid using two thick pillows under head; use a contoured orthopedic neck pillow.'
        },
        {
          category: 'Physical Habits',
          directive: 'Daily hot water fomentation (garam paani sikaai) 15-20 minutes before PhysioPulse exercises',
          rationale: 'Heat expands microvascular circulation and relaxes stiff collagenous capsule.',
          indian_context_note: 'Use a hot water rubber bag or moist towel; avoid direct boiling water burns.'
        }
      ],
      red_flag_warnings: [
        'Sudden complete inability to actively lift arm even 10° (indicates complete tendon rupture)',
        'Radiating numbness or shooting electric sensation down into fingertips',
        'Severe intractable night pain unresponsive to prescribed medication',
        'Unexplained fever or localized swelling with redness over shoulder'
      ],
      dietary_and_hydration_notes: [
        'Maintain 2.5 - 3 liters daily water intake to support cartilage hydration.',
        'Include anti-inflammatory Indian spices (turmeric haldi-milk, ginger tea) and adequate dietary protein (dal, paneer, eggs).'
      ]
    },
    schedule: {
      daily_schedule: [
        {
          time_slot: '07:30 AM - 08:30 AM',
          period: 'Morning',
          title: 'Morning Awakening, Gastric Protection & Joint Warm-up',
          action_items: [
            'Take Cap Pan-D 30 mins before breakfast on empty stomach with warm water',
            'Nutritious breakfast followed by Tab Zerodol-SP and Tab Shelcal 500',
            '10 minutes of gentle pendulum arm swings and light neck rotations'
          ],
          medications_due: ['Cap Pan-D (empty stomach)', 'Tab Zerodol-SP (after breakfast)', 'Tab Shelcal 500 (after breakfast)'],
          therapy_focus: 'Relieve morning stiffness & joint warm-up'
        },
        {
          time_slot: '01:00 PM - 02:00 PM',
          period: 'Midday',
          title: 'Midday Ergonomic Break & Posture Realignment',
          action_items: [
            '2-minute seated desk posture check: Scapular retractions and chin tucks',
            'Gentle application of Omnigel / Volini over lateral neck and shoulder',
            'Short 5-minute walk to release spinal compression'
          ],
          medications_due: ['Omnigel / Volini (topical)'],
          therapy_focus: 'Postural reset and ergonomic de-stressing'
        },
        {
          time_slot: '06:30 PM - 07:30 PM',
          period: 'Evening',
          title: 'PhysioPulse AI Markerless Rehabilitation Session',
          action_items: [
            '15 minutes of hot water fomentation (garam paani sikaai) over right shoulder',
            'Launch PhysioPulse AI Computer Vision Studio (Stage 2): P1 (Shoulder Abduction) + P3 (Cervical Guard) + P5 (Wall-Slide)',
            'Real-time audio goniometric feedback tracking (target 90° ROM, 0 compensation)'
          ],
          medications_due: ['No oral medication at this time'],
          therapy_focus: 'Active kinetic chain rehabilitation with real-time CV biofeedback',
          is_physiopulse_session: true
        },
        {
          time_slot: '09:30 PM - 10:30 PM',
          period: 'Night',
          title: 'Bedtime Dinner, Muscle Relaxation & Sleep Ergonomics',
          action_items: [
            'Dinner followed by evening dose of Tab Zerodol-SP',
            'Take Tab Myoril 4mg with water 20 minutes before bedtime',
            'Position orthopedic contour pillow and support right arm on a small side cushion'
          ],
          medications_due: ['Tab Zerodol-SP (after dinner)', 'Tab Myoril 4mg (at bedtime)', 'Omnigel / Volini (topical before sleep)'],
          therapy_focus: 'Nocturnal tissue healing & spasm prevention'
        }
      ],
      milestones: [
        {
          phase: 'Phase 1 (Days 1 - 4)',
          title: 'Acute Pain Modulation & Passive Range Induction',
          goals: [
            'Reduce resting VAS pain score from 6/10 to ≤3/10',
            'Eliminate nocturnal sleeping pain with correct side arm cushioning',
            'Achieve 85° clean glenohumeral abduction without trapezius shrugging'
          ],
          target_rom_gain: '85° - 90° Abduction',
          frequency: 'Daily evening PhysioPulse session + morning warm-up'
        },
        {
          phase: 'Phase 2 (Days 5 - 8)',
          title: 'Scapulohumeral Rhythm & Synergist Core Sync',
          goals: [
            'Integrate bilateral wall-slide sync (Protocol 5) with symmetry >85%',
            'Complete full 10-rep sets of cervical posture guard (Protocol 3)',
            'Transition off acute NSAIDs (Zerodol-SP) onto maintenance exercise'
          ],
          target_rom_gain: '100° - 110° Abduction',
          frequency: 'Daily evening session'
        },
        {
          phase: 'Phase 3 (Days 9 - 14)',
          title: 'Dynamic Functional Overhead Independence',
          goals: [
            'Comfortably reach overhead and comb hair without guarded movement',
            'Maintain zero trapezius compensation across full 3-exercise circuit',
            'Export completed PhysioPulse Kinematic Compliance Ledger for doctor review'
          ],
          target_rom_gain: '120°+ Full Functional Range',
          frequency: '5 days / week maintenance'
        }
      ],
      follow_up: {
        review_after_days: 10,
        tentative_date: '06/11/2026',
        investigations_to_bring: [
          'PhysioPulse AI Telemetry & Kinematic Compliance Report (PDF export)',
          'Previous Right Shoulder MRI films & consultation chit'
        ],
        doctor_name: 'Dr. R. K. Sharma (Apollo Hospitals)'
      }
    }
  },

  acl_knee: {
    id: 'report_acl_sengupta_02',
    source: 'calibrated_sample',
    image_url: '/prescriptions/dr_sengupta_acl_knee.png',
    raw_transcription: `ALL INDIA INSTITUTE OF MEDICAL SCIENCES (AIIMS) | JPNA Trauma Centre & Ortho
Dr. Anita Sengupta, MS (Ortho - AIIMS), DNB | Reg: MCI-18492-DEL
Pt: Marcus Vance / Rajesh V. | 29/M | Date: 27/10/2026 | BP: 128/84 | Wt: 74kg
c/o Left knee giving way sensation, instability when stepping down stairs.
    Post twisting injury playing football 8 wks back. Swelling (+).
O/E Lachman test +ve (Grade II laxity with soft endpoint).
    Anterior Drawer +ve. Joint effusion mild-moderate.
    VMO (Vastus Medialis) atrophy ~1.5 cm vs right thigh.
Inv MRI Left Knee: High grade partial ACL tear + medial meniscus tear (posterior horn).
Dx  Left Knee ACL Insufficiency + Patellofemoral Instability (Grade 2).
Rx  1. Tab Chymoral Forte 1 tab TDS ac (30 min before food) x 6d
    2. Tab Dolo 650 1 tab SOS (only if acute pain, max BD)
    3. Tab Jointace DN 1 tab OD pc x 30d
    4. Cap Pantocid 40 1 tab OD BBF x 6d
Adv PhysioPulse AI: Protocol 2 (Post-ACL Knee Extension & Squat) + Protocol 6 (Hip Abduction)
    + Protocol 7 (Lumbar Core Anchor) to recruit kinetic chain gluteus medius.
    STRICTLY AVOID Indian toilet / deep squatting. Use Western commode only.
    NO sitting on floor or cross-legged (alti-palthi na maarein).
    Hinged knee brace while commuting. Ice packs 15 mins post-exercise.
    R/A 14 days in Knee Clinic with PhysioPulse symmetry stats.`,
    doctor_details: {
      doctor_name: 'Dr. Anita Sengupta',
      qualifications: 'MBBS, MS (Ortho - AIIMS), DNB, Fellowship Sports Knee (Innsbruck)',
      hospital_or_clinic: 'All India Institute of Medical Sciences (AIIMS) · New Delhi',
      department: 'JPNA Apex Trauma Centre & Department of Orthopaedics',
      registration_number: 'MCI-18492-DEL',
      contact: '+91 98112 34567',
      consultation_date: '27/10/2026',
      room: 'Knee & Ligament Clinic (Counter #12)'
    },
    patient_details: {
      name: 'Marcus Vance',
      age: 29,
      gender: 'Male',
      uhid: 'AIIMS-ORTHO-44910',
      weight: '74 Kg',
      blood_pressure: '128/84 mmHg',
      pulse: '78 bpm'
    },
    handwriting_audit: {
      legibility_score_percent: 32,
      decipher_confidence_percent: 97,
      handwriting_style: 'Fast running clinical cursive with distinct Indian orthopedic shorthand notations',
      shorthand_terms_decoded: [
        {
          raw_term: '1 tab TDS ac',
          decoded_meaning: '1 tablet three times daily before food (Ter die sumendus, ante cibum)',
          clinical_context: 'Chymoral Forte enzymatic anti-edema taken 30 min before food'
        },
        {
          raw_term: 'Tab Dolo 650 SOS',
          decoded_meaning: '1 tablet only when required for acute pain (Si opus sit)',
          clinical_context: 'Paracetamol analgesic on demand'
        },
        {
          raw_term: 'Alti-palthi na maarein',
          decoded_meaning: 'Strictly avoid cross-legged sitting on floor (Sukhasana / Padmasana)',
          clinical_context: 'Prevents excessive torsional stress on recovering ACL and torn medial meniscus'
        },
        {
          raw_term: 'Western commode only',
          decoded_meaning: 'Avoid deep squatting in Indian squat toilets',
          clinical_context: 'Indian squatting creates extreme patellofemoral compressive force >7x body weight'
        }
      ]
    },
    clinical_findings: {
      chief_complaints: [
        'Left knee "giving way" / buckling when stepping down stairs',
        'Persistent sense of joint instability after pivoting injury 8 weeks ago',
        'Mild knee swelling after walking more than 500 meters'
      ],
      on_examination_signs: [
        'Positive Lachman test with Grade II laxity and indistinct endpoint',
        'Positive Anterior Drawer test indicating ACL fiber compromise',
        'Vastus Medialis Oblique (VMO) circumference deficit of 1.5 cm',
        'Medial joint line tenderness with positive McMurray sign'
      ],
      radiology_findings: [
        'MRI Left Knee: High-grade partial ACL tear with posterior horn medial meniscus signal',
        'Mild suprapatellar joint effusion without intra-articular loose bodies'
      ],
      diagnosis: 'Left Knee ACL Partial Insufficiency with Medial Meniscal Strain & Patellofemoral Deficit',
      icd10_code: 'S83.512A',
      severity_assessment: 'Moderate'
    },
    session_plan: {
      patient_name: 'Marcus Vance',
      affected_area: 'Left Knee & Kinetic Chain Hip',
      vas_pain_level: 5,
      clinical_diagnosis_summary: 'Multi-joint kinetic chain rehabilitation stabilizing the knee by firing the gluteus medius and VMO, eliminating knee valgus collapse without shearing the recovering anterior cruciate ligament.',
      precautions: 'Strictly avoid terminal open-chain hyperextension (0° - 15°). Focus on closed-chain knee squats to 60° max.',
      circuit_mode: 'standard',
      exercises: [
        {
          protocol_id: 2,
          protocol_name: 'P2: Post-ACL Knee Extension & Squat',
          target_reps: 10,
          target_rom_degrees: 60,
          clinical_rationale: 'Closed kinetic chain knee extension activating the quadriceps mechanism safely within protected ROM boundaries.',
          sensor_focus: 'Tibiofemoral goniometric angle & patellar tracking vector',
          compensation_watch: 'Detects knee valgus wobble (inward collapse) & trunk forward tilt'
        },
        {
          protocol_id: 6,
          protocol_name: 'P6: Total Hip Replacement / Hip Abduction',
          target_reps: 10,
          target_rom_degrees: 35,
          clinical_rationale: 'Strengthens gluteus medius to stabilize pelvic tilt and dynamically prevent knee medial collapse during gait.',
          sensor_focus: 'Coxofemoral abduction angle (Pelvis to lateral femur)',
          compensation_watch: 'Guard against compensatory trunk side-leaning'
        },
        {
          protocol_id: 7,
          protocol_name: 'P7: Lumbar Spine & Core Anchor',
          target_reps: 8,
          target_rom_degrees: 70,
          clinical_rationale: 'Acts as proximal kinetic chain core anchor, ensuring lumbar-pelvic stability under single-leg loading.',
          sensor_focus: 'Lumbopelvic neutral posture line',
          compensation_watch: 'Avoid pelvic rotation and lumbar hyperextension'
        }
      ]
    },
    treatment_plan: {
      clinical_overview: 'Conservative non-operative physical therapy regimen for high-grade partial ACL laxity and VMO muscle re-education, avoiding deep flexion shearing forces.',
      medications: [
        {
          name: 'Tab Chymoral Forte',
          generic_composition: 'Trypsin-Chymotrypsin 100,000 Armour Units',
          dosage: '1 tablet',
          frequency: '1-1-1 (Three times daily)',
          timing: 'Empty stomach, 30 min before food (ac)',
          duration: '6 days',
          purpose: 'Enzymatic debridement of inflammatory exudate and reduction of joint swelling',
          special_instructions: 'Take with full glass of water 30 minutes before breakfast, lunch, and dinner.'
        },
        {
          name: 'Tab Jointace DN',
          generic_composition: 'Glucosamine Sulfate 750mg + Diacerein 50mg',
          dosage: '1 tablet',
          frequency: '1-0-0 (Once daily)',
          timing: 'After lunch (pc)',
          duration: '30 days',
          purpose: 'Chondroprotective nourishment for articular cartilage and synovial lubrication',
          special_instructions: 'May turn urine yellowish; this is completely harmless.'
        },
        {
          name: 'Tab Dolo 650',
          generic_composition: 'Paracetamol 650mg',
          dosage: '1 tablet',
          frequency: 'SOS (As needed)',
          timing: 'After food',
          duration: 'As needed (max 2 tabs/day)',
          purpose: 'Analgesic for breakthrough joint pain following exercise or walking',
          special_instructions: 'Do not exceed 3 tablets in 24 hours.'
        },
        {
          name: 'Cap Pantocid 40',
          generic_composition: 'Pantoprazole 40mg',
          dosage: '1 capsule',
          frequency: '1-0-0 (Once daily)',
          timing: 'Empty stomach (BBF)',
          duration: '6 days',
          purpose: 'Gastric acid suppression and mucosal protection',
          special_instructions: 'Take first thing in the morning.'
        }
      ],
      lifestyle_adaptations: [
        {
          category: 'Toilet & Hygiene',
          directive: 'Strictly avoid Indian squat toilets; use Western raised commode',
          rationale: 'Squatting past 90° imparts >700% body weight shear on the ACL and meniscus.',
          indian_context_note: 'If travelling or at home where only Indian toilet exists, use a portable toilet chair or commode stool.'
        },
        {
          category: 'Physical Habits',
          directive: 'Never sit on floor or cross-legged (alti-palthi na maarein / no lotus pose)',
          rationale: 'Extreme knee rotational torques strain the healing posterior medial meniscus horn.',
          indian_context_note: 'During puja/prayers or dining, sit on a dining chair or sofa rather than on floor mats.'
        },
        {
          category: 'Commute & Travel',
          directive: 'Wear hinged knee brace during travel and avoid kick-starting two-wheelers',
          rationale: 'Prevents sudden hyperextension or twisting when stepping off buses, autos, or metro stairs.',
          indian_context_note: 'Fasten brace snugly around patella before boarding metro or auto-rickshaw.'
        },
        {
          category: 'Physical Habits',
          directive: 'Apply ice pack (barf ki sikaai) for 15 minutes immediately after every exercise session',
          rationale: 'Suppresses post-exercise reactive synovial effusion and accelerates recovery.',
          indian_context_note: 'Wrap gel pack or crushed ice in a dry cotton cloth; never apply bare ice directly to skin.'
        }
      ],
      red_flag_warnings: [
        'Sudden acute knee "locking" where knee cannot be straightened at all (displaced bucket-handle meniscus tear)',
        'Rapid swelling within 2 hours of walking accompanied by hot joint and fever (hemarthrosis or septic arthritis)',
        'Calf tenderness, warmth, or swelling (suspected deep vein thrombosis)'
      ],
      dietary_and_hydration_notes: [
        'Maintain lean protein intake (paneer, soya, pulses, eggs, fish) to counteract VMO quadriceps atrophy.',
        'Drink adequate water to prevent Diacerein-related mild dehydration.'
      ]
    },
    schedule: {
      daily_schedule: [
        {
          time_slot: '07:30 AM - 08:30 AM',
          period: 'Morning',
          title: 'Morning Gastro-Protection, Medication & Quadriceps Activation',
          action_items: [
            'Take Cap Pantocid 40 on empty stomach with warm water',
            '30 mins later: Take Tab Chymoral Forte before breakfast',
            'Post-breakfast: Isometric quad sets (straight leg towel press under knee x 15 reps)'
          ],
          medications_due: ['Cap Pantocid 40 (empty stomach)', 'Tab Chymoral Forte (30 min ac)'],
          therapy_focus: 'VMO isometric recruitment without joint shear'
        },
        {
          time_slot: '01:30 PM - 02:30 PM',
          period: 'Midday',
          title: 'Lunch, Midday Enzyme & Chondroprotective Nourishment',
          action_items: [
            'Take Tab Chymoral Forte 30 min before lunch',
            'Wholesome lunch followed by Tab Jointace DN',
            'Brief 5-minute seated hamstring stretch with knee elevated'
          ],
          medications_due: ['Tab Chymoral Forte (30 min ac)', 'Tab Jointace DN (after lunch)'],
          therapy_focus: 'Cartilage recovery & joint decompression'
        },
        {
          time_slot: '06:30 PM - 07:30 PM',
          period: 'Evening',
          title: 'PhysioPulse AI Computer Vision Rehabilitation Studio',
          action_items: [
            'Wear comfortable shorts and strap knee tracking marker / position camera',
            'Execute PhysioPulse Suite: Protocol 2 (Knee Extension & Squat to 60°) + Protocol 6 (Hip Abduction Gluteus Medius)',
            'Post-session: 15 minutes of ice pack application (barf sikaai) over anterior knee'
          ],
          medications_due: ['No scheduled pills; Dolo 650 only if pain >5/10'],
          therapy_focus: 'Markerless closed-loop kinetic chain rehabilitation',
          is_physiopulse_session: true
        },
        {
          time_slot: '09:30 PM - 10:30 PM',
          period: 'Night',
          title: 'Dinner, Pre-Bed Enzyme & Sleep Positioning',
          action_items: [
            'Take evening dose of Tab Chymoral Forte 30 min before dinner',
            'Sleep supine or on side with a small pillow between knees to maintain neutral hip-knee alignment',
            'Keep knee brace unlocked or off while sleeping in bed'
          ],
          medications_due: ['Tab Chymoral Forte (30 min ac)'],
          therapy_focus: 'Nocturnal effusion drainage and ligament resting'
        }
      ],
      milestones: [
        {
          phase: 'Phase 1 (Days 1 - 5)',
          title: 'Effusion Control & Safe Static Closed-Chain Quad Firing',
          goals: [
            'Eliminate joint effusion (trace swelling only)',
            'Achieve 10 reps of closed-chain knee squats to 45° with 0 valgus collapse',
            'Restore bilateral quadriceps symmetry to >80%'
          ],
          target_rom_gain: '0° Extension to 60° Flexion',
          frequency: 'Daily evening session + morning isometrics'
        },
        {
          phase: 'Phase 2 (Days 6 - 10)',
          title: 'Gluteus Medius Kinetic Chain Integration',
          goals: [
            'Progress hip abduction (Protocol 6) to 35° with zero trunk side-tilt',
            'Walk downstairs with steady reciprocal steps wearing hinged brace',
            'Achieve 60° pain-free squat depth'
          ],
          target_rom_gain: '0° to 80° Flexion',
          frequency: 'Daily evening session'
        },
        {
          phase: 'Phase 3 (Days 11 - 14)',
          title: 'Dynamic Biomechanical Gait Stabilization',
          goals: [
            'Perform single-leg stance balance test for 20 seconds without wobbling',
            'Sustain 90%+ kinematic compliance across full 3-exercise routine',
            'Present PhysioPulse AI Telemetry report at AIIMS OPD review'
          ],
          target_rom_gain: 'Full Functional 90°+ Squat',
          frequency: '5 days / week'
        }
      ],
      follow_up: {
        review_after_days: 14,
        tentative_date: '10/11/2026',
        investigations_to_bring: [
          'PhysioPulse AI Multi-Protocol Kinematic Report (PDF)',
          'Previous AIIMS Knee MRI films & OPD card'
        ],
        doctor_name: 'Dr. Anita Sengupta (AIIMS New Delhi)'
      }
    }
  },

  lumbar_sciatica: {
    id: 'report_spine_gupta_03',
    source: 'calibrated_sample',
    image_url: '/prescriptions/dr_gupta_lumbar_spine.png',
    raw_transcription: `MAX SUPER SPECIALITY HOSPITAL · GURUGRAM | Spine Surgery & Orthopaedics
Dr. Rajesh Gupta, MBBS, MS (Ortho), MCh (Spine - UK) | Reg: HN-MED-3184
Pt: David Miller / Amit Kulkarni | 44/M | Date: 27/10/2026 | BP: 132/86 | Wt: 78kg
c/o Severe Low Back Ache (LBA) radiating down right buttock to lateral calf.
    Pins & needles / tingling sensation in right foot thumb x 3 wks.
    Severe aggravation on prolonged sitting in car commute & forward bending.
O/E Straight Leg Raise (SLR) +ve on Right at 40° with radicular shooting pain.
    L4-L5 lumbar paraspinal muscle spasm severe; loss of lumbar lordosis.
    Right EHL power 4/5. Ankle jerk sluggish.
Inv MRI L-S Spine: L4-L5 posterior paracentral disc protrusion with right traversing
    L5 nerve root compression & thecal sac indentation.
Dx  L4-L5 PIVD (Slip Disc) with Right Sciatica & Lumbar Radiculopathy.
Rx  1. Tab Maxmala 75 (Pregabalin + Methylcobalamin) 1 cap HS x 14d
    2. Tab Tolperitas 150 (Tolperisone) 1 tab BD pc x 7d
    3. Tab Defcort 6 (Deflazacort) 1 tab BD pc x 4d, then 1 tab OD x 3d, then stop
    4. Tab Pantocid-DSR 1 cap OD BBF x 10d
    5. Dynapar QPS spray TDS over lower back (no rubbing).
Adv Prescribed: Protocol 7 (Lumbar Spine Flexion & Core) + Protocol 6 (Hip Abduction)
    + Protocol 3 (Cervical Posture Guard). Avoid all spinal axial twisting.
    STRICT AVOIDANCE OF FORWARD BENDING (jhukna bilkul mana hai). No lifting >2 kg.
    Wear Lumbo-sacral (LS) belt during travel / car / two-wheeler commute.
    Hard bed / firm orthopedic mattress. Sleep with pillow between knees.
    R/A 10 days with PhysioPulse range of motion telemetry.`,
    doctor_details: {
      doctor_name: 'Dr. Rajesh Gupta',
      qualifications: 'MBBS, MS (Ortho), MCh (Spine Surgery - UK), AO Spine Fellow',
      hospital_or_clinic: 'Max Super Speciality Hospital · Gurugram',
      department: 'Max Institute of Musculoskeletal Sciences & Spine Care',
      registration_number: 'HN-MED-3184',
      contact: '+91 98188 98765',
      consultation_date: '27/10/2026',
      room: 'Spine Care OPD #118'
    },
    patient_details: {
      name: 'David Miller',
      age: 44,
      gender: 'Male',
      uhid: 'MAX-SPINE-77219',
      weight: '78 Kg',
      blood_pressure: '132/86 mmHg',
      pulse: '72 bpm'
    },
    handwriting_audit: {
      legibility_score_percent: 24,
      decipher_confidence_percent: 98,
      handwriting_style: 'Hurried neurosurgical cursive script with concise Latin dosage directions',
      shorthand_terms_decoded: [
        {
          raw_term: 'SLR +ve at 40°',
          decoded_meaning: 'Straight Leg Raise test positive at 40 degrees',
          clinical_context: 'Diagnostic indicator of severe L5/S1 nerve root mechanical irritation / disc compression'
        },
        {
          raw_term: 'PIVD with Sciatica',
          decoded_meaning: 'Prolapsed Intervertebral Disc with Sciatic Nerve Radiculopathy',
          clinical_context: 'L4-L5 herniated disc causing shooting electric leg pain'
        },
        {
          raw_term: 'Jhukna bilkul mana hai',
          decoded_meaning: 'Strictly avoid forward bending at waist (Zero lumbar flexion under load)',
          clinical_context: 'Forward bending generates hydrostatic intradiscal pressure >250 psi, risking catastrophic disc extrusion'
        },
        {
          raw_term: 'LS belt during commute',
          decoded_meaning: 'Wear Lumbo-Sacral corset orthosis during car or two-wheeler travel',
          clinical_context: 'Dampens road vibrations and limits micro-motion across lumbar segments'
        }
      ]
    },
    clinical_findings: {
      chief_complaints: [
        'Lancinating electric pain radiating from right lower back into right buttock, posterior thigh, and calf',
        'Tingling and numbness over the dorsum of right foot and big toe (L5 dermatome)',
        'Inability to sit in an office chair or drive car for more than 20 minutes without unbearable agony'
      ],
      on_examination_signs: [
        'Straight Leg Raise (SLR) strongly positive on Right at 40° with radiating electric shocks',
        'Severe bilateral lumbar paraspinal muscle spasm with loss of physiological lordosis ("flat back")',
        'Right Extensor Hallucis Longus (EHL) power 4/5 (mild motor deficit)',
        'Lasegue sign positive; tenderness on percussion over L4-L5 interspinous ligament'
      ],
      radiology_findings: [
        'MRI Lumbosacral Spine: L4-L5 posterior paracentral disc extrusion with right traversing L5 nerve root impingement and moderate thecal sac compression'
      ],
      diagnosis: 'L4-L5 Prolapsed Intervertebral Disc (PIVD) with Right Sciatica & Acute Lumbar Radiculopathy',
      icd10_code: 'M51.16',
      severity_assessment: 'Severe / Guarded'
    },
    session_plan: {
      patient_name: 'David Miller',
      affected_area: 'Lumbar Spine & Sciatic Kinetic Chain',
      vas_pain_level: 7,
      clinical_diagnosis_summary: 'Spine-sparing isometric core and pelvic stabilization routine engineered to decompress the compressed L5 root without provocative spinal flexion or axial torsion.',
      precautions: 'STRICTLY AVOID ANY FORWARD BENDING OR SPINAL ROTATION. Exercises must be performed within neutral spine limits only.',
      circuit_mode: 'standard',
      exercises: [
        {
          protocol_id: 7,
          protocol_name: 'P7: Lumbar Spine & Core Rehabilitation',
          target_reps: 8,
          target_rom_degrees: 60,
          clinical_rationale: 'Trains deep transversus abdominis and multifidus co-contraction to stabilize the L4-L5 segment in neutral posture.',
          sensor_focus: 'Lumbar lordosis plumb angle & anterior pelvic tilt monitor',
          compensation_watch: 'Detects forward spine rounding & compensatory pelvic twisting'
        },
        {
          protocol_id: 6,
          protocol_name: 'P6: Total Hip Replacement / Hip Abduction',
          target_reps: 10,
          target_rom_degrees: 30,
          clinical_rationale: 'Strengthens gluteus medius to eliminate Trendelenburg pelvic drop, reducing shear across the lower lumbar facet joints.',
          sensor_focus: 'Hip coronal abduction vector',
          compensation_watch: 'Watch for lumbar lateral flexion instead of pure hip movement'
        },
        {
          protocol_id: 3,
          protocol_name: 'P3: Cervical & Ergonomic Posture Guard',
          target_reps: 10,
          target_rom_degrees: 85,
          clinical_rationale: 'Restores whole-spine sagittal alignment, relieving downward axial gravity load on the injured lumbar disc.',
          sensor_focus: 'Cervicothoracic posture alignment line',
          compensation_watch: 'Avoid cervical hyperextension'
        }
      ]
    },
    treatment_plan: {
      clinical_overview: 'Intensive medical stabilization combining short-course corticosteroid taper, neuropathic membrane stabilizer, non-sedating muscle relaxant, rigid LS bracing, and computer vision spinal biofeedback.',
      medications: [
        {
          name: 'Tab Maxmala 75',
          generic_composition: 'Pregabalin 75mg + Methylcobalamin 750mcg',
          dosage: '1 capsule',
          frequency: '0-0-1 (Once daily at bedtime)',
          timing: 'Bedtime with water (HS)',
          duration: '14 days',
          purpose: 'Neuropathic membrane stabilizer targeting shooting sciatic radicular nerve pain and promoting myelin sheath repair',
          special_instructions: 'Take consistently at night. Causes mild drowsiness that helps restorative sleep.'
        },
        {
          name: 'Tab Tolperitas 150',
          generic_composition: 'Tolperisone HCl 150mg',
          dosage: '1 tablet',
          frequency: '1-0-1 (Twice daily)',
          timing: 'After meals (pc)',
          duration: '7 days',
          purpose: 'Spinal-acting non-sedating muscle relaxant relieving intense paraspinal muscle guard',
          special_instructions: 'Take after breakfast and after dinner.'
        },
        {
          name: 'Tab Defcort 6',
          generic_composition: 'Deflazacort 6mg (Oral Corticosteroid)',
          dosage: '1 tablet',
          frequency: 'Tapering dose (BD x 4d, then OD x 3d, then stop)',
          timing: 'After meals with milk or food (pc)',
          duration: '7 days total',
          purpose: 'Potent acute anti-inflammatory agent shrinking chemical radiculitis around the compressed nerve root',
          special_instructions: 'Follow tapering schedule strictly. Do not discontinue abruptly without finishing the 7-day taper.'
        },
        {
          name: 'Cap Pantocid-DSR',
          generic_composition: 'Pantoprazole 40mg + Domperidone 30mg SR',
          dosage: '1 capsule',
          frequency: '1-0-0 (Once daily)',
          timing: 'Empty stomach (BBF)',
          duration: '10 days',
          purpose: 'Gastric mucosal protection during steroid and anti-inflammatory therapy',
          special_instructions: 'Take first thing in the morning with water.'
        },
        {
          name: 'Dynapar QPS Spray',
          generic_composition: 'Diclofenac Diethylamine 4.64% w/v Quick Penetrating Solution',
          dosage: '4-5 sprays',
          frequency: 'TDS (Three times daily)',
          timing: 'Over lower back area',
          duration: '10 days',
          purpose: 'Rapid non-greasy transdermal pain relief over paraspinal trigger points',
          special_instructions: 'Spray over lower back and allow to dry naturally. Do NOT rub vigorously.'
        }
      ],
      lifestyle_adaptations: [
        {
          category: 'Sitting & Posture',
          directive: 'Strictly avoid sitting for more than 25 minutes consecutively; use lumbar support roll',
          rationale: 'Slouched sitting increases disc pressure from 100 kg to over 185 kg, pushing the herniation into the nerve root.',
          indian_context_note: 'Use a firm lumbar support cushion behind lower back. Never sit on soft low bean bags or saggy sofas.'
        },
        {
          category: 'Commute & Travel',
          directive: 'Wear rigid Lumbo-Sacral (LS) belt during all motorized transport (car, auto, metro)',
          rationale: 'Absorbs mechanical road shocks and sudden potholes common on Indian roads that trigger sharp disc flare-ups.',
          indian_context_note: 'Fasten LS belt firmly across pelvis and lower abdomen before getting into vehicle; remove while resting in bed.'
        },
        {
          category: 'Physical Habits',
          directive: 'STRICT ZERO FORWARD BENDING (jhukna bilkul mana hai) & no lifting weights >2 kg',
          rationale: 'Bending forward with straight legs creates a fulcrum lever multiplying shear force across L4-L5 by 10 times.',
          indian_context_note: 'To pick up any object from the floor, bend knees in a squat while keeping spine completely vertical, or ask family assistance.'
        },
        {
          category: 'Sleep Ergonomics',
          directive: 'Sleep on a firm orthopedic mattress; position a pillow between knees (side sleeping)',
          rationale: 'Prevents pelvic torsion from twisting the lumbar spine during the night.',
          indian_context_note: 'If mattress is soft or sagging, place a 1/2-inch wooden ply board beneath the mattress or sleep on a firm floor mat.'
        }
      ],
      red_flag_warnings: [
        'Sudden loss of bowel or bladder control / involuntary leakage or inability to urinate (Cauda Equina Syndrome - EMERGENCY)',
        'Progressive foot drop where foot drags on floor and toes cannot be lifted while walking',
        'Numbness spreading to the saddle area (groin, buttocks, inner thighs)',
        'Sudden severe motor weakness in both legs simultaneously'
      ],
      dietary_and_hydration_notes: [
        'Eat high-fiber Indian foods (isabgol / psyllium husk, papaya, oats) to prevent constipation, as straining raises disc pressure.',
        'Drink 3 liters of water daily to assist nerve conduction recovery.'
      ]
    },
    schedule: {
      daily_schedule: [
        {
          time_slot: '07:30 AM - 08:30 AM',
          period: 'Morning',
          title: 'Morning Awakening, Gastric Protection & Gentle Decompression',
          action_items: [
            'Take Cap Pantocid-DSR 30 mins before breakfast on empty stomach',
            'Nutritious breakfast followed by morning dose of Tab Defcort 6 and Tab Tolperitas 150',
            'Log-roll out of bed (turn sideways, drop feet down, push up with arms—never sit up straight)'
          ],
          medications_due: ['Cap Pantocid-DSR (empty stomach)', 'Tab Defcort 6 (after breakfast)', 'Tab Tolperitas 150 (after breakfast)'],
          therapy_focus: 'Spine-sparing log roll & morning nerve decompression'
        },
        {
          time_slot: '01:00 PM - 02:00 PM',
          period: 'Midday',
          title: 'Midday Spinal Unloading & Topical Analgesic Spray',
          action_items: [
            '5 minutes of supine 90-90 resting on bed (calves resting on chair) to take disc pressure to near zero',
            'Spray Dynapar QPS across lumbar spine and allow to dry',
            'Gentle pelvic tilts in neutral alignment'
          ],
          medications_due: ['Dynapar QPS spray (topical)'],
          therapy_focus: 'Discal hydrostatic pressure relief'
        },
        {
          time_slot: '06:30 PM - 07:30 PM',
          period: 'Evening',
          title: 'PhysioPulse AI Spinal Biofeedback Rehabilitation Studio',
          action_items: [
            'Fasten Lumbo-Sacral belt lightly for support or exercise in neutral clothes',
            'Launch PhysioPulse AI Studio: Protocol 7 (Lumbar Spine Core Guard) + Protocol 6 (Hip Abduction) + Protocol 3 (Posture Guard)',
            'Real-time goniometric sensor tracking verifies zero spinal flexion compensation'
          ],
          medications_due: ['No scheduled pills; rest after exercise'],
          therapy_focus: 'Closed-loop markerless core stabilization',
          is_physiopulse_session: true
        },
        {
          time_slot: '09:30 PM - 10:30 PM',
          period: 'Night',
          title: 'Dinner, Neuropathic Medicine & Nocturnal Sleep Alignment',
          action_items: [
            'Dinner followed by evening dose of Tab Tolperitas 150 and evening Tab Defcort 6 (Days 1-4)',
            'Take Tab Maxmala 75 with a glass of water 20 minutes before sleep',
            'Lie on firm mattress with pillow between knees; ensure neck is aligned with thin contour pillow'
          ],
          medications_due: ['Tab Maxmala 75 (at bedtime)', 'Tab Tolperitas 150 (after dinner)', 'Tab Defcort 6 (after dinner, Days 1-4)'],
          therapy_focus: 'Sciatic nerve healing & sleep comfort'
        }
      ],
      milestones: [
        {
          phase: 'Phase 1 (Days 1 - 4)',
          title: 'Chemical Radiculitis Suppression & Neutral Core Bracing',
          goals: [
            'Centralize sciatic pain (decrease peripheral radiation past the knee)',
            'Eliminate painful lumbar paraspinal spasm with Tolperisone + steroid taper',
            'Master neutral spine posture with zero flexion during daily transitions'
          ],
          target_rom_gain: 'Safe Neutral Stability (60° controlled flexion)',
          frequency: 'Daily evening PhysioPulse session'
        },
        {
          phase: 'Phase 2 (Days 5 - 8)',
          title: 'Gluteus Synergist & Pelvic Tilt Recruitment',
          goals: [
            'Improve Straight Leg Raise tolerance from 40° to 65° without radicular shock',
            'Complete 10 reps of Protocol 6 (Hip Abduction) with zero pelvic twisting',
            'Complete steroid taper safely without rebound inflammation'
          ],
          target_rom_gain: '70° Controlled Range',
          frequency: 'Daily evening session'
        },
        {
          phase: 'Phase 3 (Days 9 - 14)',
          title: 'Whole-Spine Functional Ergonomic Endurance',
          goals: [
            'Sit comfortably for 45 minutes with lumbar support cushion',
            'Achieve 95%+ kinematic compliance on PhysioPulse AI suite',
            'Review with Dr. Rajesh Gupta at Max Healthcare with complete compliance ledger'
          ],
          target_rom_gain: 'Full Functional Dynamic Stability',
          frequency: '5 days / week'
        }
      ],
      follow_up: {
        review_after_days: 10,
        tentative_date: '06/11/2026',
        investigations_to_bring: [
          'PhysioPulse AI Full Session Telemetry & Compliance Report (PDF)',
          'Previous Max Healthcare Spine MRI films'
        ],
        doctor_name: 'Dr. Rajesh Gupta (Max Super Speciality Hospital)'
      }
    }
  },

  xray_knee_oa: {
    id: 'report_xray_knee_oa_01',
    source: 'calibrated_sample',
    raw_transcription: `DIGITAL RADIOGRAPHY CLINICAL REPORT
STUDY: BILATERAL KNEES WEIGHT-BEARING AP AND LATERAL VIEWS
CLINICAL INDICATION: 58-year-old male with persistent mechanical bilateral knee crepitus, pain on stair climbing, and morning stiffness lasting ~20 minutes.

OBSERVATIONS:
- Articular Alignment: Normal femorotibial weight-bearing mechanical axis.
- Joint Space Morphology: Marked asymmetric joint space narrowing noted in the medial tibiofemoral compartment bilaterally, right significantly greater than left. Lateral compartments remain relatively preserved.
- Osseous Features: Prominent subchondral sclerosis along the weight-bearing medial tibial plateau. Small marginal osteophytes noted at the medial femoral condyle and medial tibial margins. Spiking of the tibial eminences.
- Patellofemoral Articulation: Mild lateral patellar tilt with early subchondral sclerosis; no gross loose body.
- Soft Tissues: Mild suprapatellar soft tissue fullness; no radiopaque joint mice.

IMPRESSION:
1. BILATERAL KNEE OSTEOARTHRITIS, MEDIAL COMPARTMENT PREDOMINANT (RIGHT > LEFT).
2. KELLGREN-LAWRENCE GRADE 2 (MODERATE RADIOLOGICAL OSTEOARTHRITIS).
3. CLINICAL DIRECTIVE: Recommend conservative non-impact biomechanical rehabilitation. Target quadriceps co-contraction and pelvic abductor stabilization. RESTRICT KNEE HYPERFLEXION TO MAXIMUM 85 DEGREES TO PREVENT EXCESSIVE MEDIAL COMPRESSION.`,
    doctor_details: {
      doctor_name: 'Dr. S. K. Narang',
      qualifications: 'MBBS, MD Radiodiagnosis (PGI Chandigarh)',
      hospital_or_clinic: 'Narang Advanced Imaging & Diagnostic Centre',
      department: 'Department of Musculoskeletal Radiology',
      registration_number: 'DMC-RAD-48912',
      contact: '+91 11 4123 7700',
      consultation_date: '28/10/2026',
      room: 'Imaging Suite X-02'
    },
    patient_details: {
      name: 'Harish Verma',
      age: 58,
      gender: 'Male',
      uhid: 'UHID-DL-89104',
      weight: '76 kg',
      blood_pressure: '128/84 mmHg',
      pulse: '74 bpm'
    },
    handwriting_audit: {
      legibility_score_percent: 98,
      decipher_confidence_percent: 99,
      handwriting_style: 'Digital High-Resolution Plain Film Radiograph (PACS Verified)',
      shorthand_terms_decoded: [
        {
          raw_term: 'KL Grade 2',
          decoded_meaning: 'Kellgren-Lawrence Grade 2 (Definite osteophytes, possible joint space narrowing)',
          clinical_context: 'Standard radiographic classification for osteoarthritis severity'
        },
        {
          raw_term: 'W/B AP',
          decoded_meaning: 'Weight-Bearing Anteroposterior View',
          clinical_context: 'Demonstrates functional joint space compression under body mass'
        },
        {
          raw_term: 'ROM Cap 85°',
          decoded_meaning: 'Restricted Range of Motion Limit: 85 degrees',
          clinical_context: 'Kinematic boundary preventing excessive medial compartment cartilage shearing'
        }
      ]
    },
    clinical_findings: {
      chief_complaints: [
        'Bilateral inner knee joint pain on descending stairs (VAS 6/10)',
        'Joint stiffness after prolonged sitting and upon waking (~20 minutes)',
        'Audible crepitus during terminal sit-to-stand transitions'
      ],
      on_examination_signs: [
        'Tenderness localized over medial joint line of right knee',
        'Coarse patellofemoral crepitus on passive knee excursion',
        'Mild quadriceps atrophy (vastus medialis obliquus) compared to hip adductors'
      ],
      radiology_findings: [
        'Medial tibiofemoral joint space narrowing (Right > Left)',
        'Medial tibial subchondral sclerosis & marginal osteophytosis',
        'Kellgren-Lawrence Grade 2 (Moderate Osteoarthritis)'
      ],
      diagnosis: 'Bilateral Knee Osteoarthritis (Medial Compartment Predominant, KL Grade 2)',
      icd10_code: 'M17.11',
      severity_assessment: 'Moderate'
    },
    radiology_scan: {
      modality: 'xray',
      modality_label: 'Digital Plain Film Radiograph (Bilateral Weight-Bearing AP)',
      body_region: 'Bilateral Knee Compartment (Tibiofemoral Joint)',
      structural_findings: [
        'Medial compartment joint space reduction (Right > Left)',
        'Subchondral sclerosis along medial tibial plateau',
        'Marginal tibial osteophytes without acute cortical disruption'
      ],
      pathology_grade: 'Kellgren-Lawrence Grade 2 (Moderate Osteoarthritis)',
      biomechanical_restrictions: {
        recommended_rom_cap_degrees: 85,
        restricted_movements: [
          'Deep squats beyond 85 degrees (triggers extreme medial tibial plateau contact stress)',
          'High-impact running or ballistic jumping',
          'Prolonged cross-legged sitting on floor (alti-palthi)'
        ],
        contraindications: [
          'High-velocity unresisted terminal knee snapping',
          'Heavy loaded leg press in acute flare-up'
        ]
      }
    },
    session_plan: {
      patient_name: 'Harish Verma',
      affected_area: 'Bilateral Knee & Kinetic Stabilizers',
      vas_pain_level: 6,
      clinical_diagnosis_summary: 'Targeted patellofemoral and tibiofemoral stabilization routine calibrated directly from weight-bearing radiograph. Features Protocol 2 (Knee Extension / Quad Arc) with range of motion safely capped at 85° to protect medial articular cartilage, synergized with Protocol 6 (Hip Abduction Gluteus Medius) to prevent knee valgus collapse, and anchored by Protocol 3 (Cervical & Axial Posture Guard).',
      precautions: 'CRITICAL X-RAY SAFEGUARD: Capped knee flexion at 85° (KL Grade 2 Medial Compartment OA). Keep movement velocity controlled; avoid knee cave-in during squats.',
      circuit_mode: 'standard',
      exercises: [
        {
          protocol_id: 2,
          protocol_name: 'P2: Post-ACL & Knee OA Extension (Guarded 85°)',
          target_reps: 8,
          target_rom_degrees: 85,
          clinical_rationale: 'Calibrated from X-Ray: Capped at 85° to strengthen Vastus Medialis Obliquus without compressive joint pinching.',
          sensor_focus: 'Tibiofemoral joint angle & valgus tracking',
          compensation_watch: 'Watch for contralateral pelvic drop and forward trunk collapse'
        },
        {
          protocol_id: 6,
          protocol_name: 'P6: Total Hip & Pelvic Side Abduction',
          target_reps: 8,
          target_rom_degrees: 28,
          clinical_rationale: 'Activates gluteus medius to eliminate Trendelenburg gait and offload medial knee compartment.',
          sensor_focus: 'Pelvic coronal level & hip abduction angle',
          compensation_watch: 'Avoid lateral trunk lean to substitute hip weakness'
        },
        {
          protocol_id: 3,
          protocol_name: 'P3: Cervical & Ergonomic Posture Guard',
          target_reps: 1,
          target_rom_degrees: 85,
          clinical_rationale: 'Maintains upright axial plumb line during kinetic chain loading.',
          sensor_focus: 'Cervical alignment & head protrusion',
          compensation_watch: 'Do not allow forward head slouch'
        }
      ]
    },
    treatment_plan: {
      clinical_overview: 'Multimodal osteoarthritis care plan combining conservative pharmacotherapy, protective knee offloading, and kinematic vision-monitored quadriceps rehabilitation.',
      medications: [
        {
          name: 'Tab Jointace DN',
          generic_composition: 'Glucosamine Sulfate 750mg + Diacerein 50mg',
          dosage: '1 tablet',
          frequency: 'Once Daily (1-0-0)',
          timing: 'After breakfast with water',
          duration: '60 days',
          purpose: 'Chondroprotective agent to stimulate cartilage matrix synthesis',
          special_instructions: 'May take 3-4 weeks for noticeable symptomatic relief'
        },
        {
          name: 'Tab Zerodol-SP',
          generic_composition: 'Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg',
          dosage: '1 tablet',
          frequency: 'Twice Daily (1-0-1)',
          timing: 'After meals (morning & evening)',
          duration: '5 days only (during acute painful flare-ups)',
          purpose: 'Relieves inflammatory articular synovitis and joint effusion',
          special_instructions: 'Take strictly after meals; discontinue once pain settles below VAS 3'
        },
        {
          name: 'Tab Pan-D',
          generic_composition: 'Pantoprazole 40mg + Domperidone 30mg SR',
          dosage: '1 capsule',
          frequency: 'Once Daily (OD BBF)',
          timing: '30 minutes before breakfast',
          duration: '5 days',
          purpose: 'Gastric mucosal protection during NSAID therapy',
          special_instructions: 'Swallow whole with warm water'
        }
      ],
      lifestyle_adaptations: [
        {
          category: 'Toilet & Hygiene',
          directive: 'Strictly avoid low floor Indian toilets; utilize elevated Western commode seat.',
          rationale: 'Deep squatting on Indian commodes exerts up to 7x body weight shear across osteoarthritic medial tibial plateau.',
          indian_context_note: 'Use a raised commode attachment or wall grab rails in bathroom.'
        },
        {
          category: 'Sitting & Posture',
          directive: 'Eliminate floor sitting and cross-legged sitting (alti-palthi / sukhasana).',
          rationale: 'Hyperflexion compresses the diseased medial cartilage against tibial osteophytes.',
          indian_context_note: 'Sit on dining chair or armchair with knee bent at comfortable 90 degrees.'
        },
        {
          category: 'Commute & Travel',
          directive: 'Wear neoprene open-patella stabilizing knee cap during market walks or daily commute.',
          rationale: 'Improves proprioceptive joint awareness and reduces patellofemoral friction.',
          indian_context_note: 'Remove knee cap when resting or sleeping.'
        }
      ],
      red_flag_warnings: [
        'Sudden acute knee swelling (hot, tense effusion) or fever',
        'Knee giving way / sudden mechanical locking preventing straightening',
        'Calf tenderness, redness, or asymmetric swelling (rule out DVT)'
      ],
      dietary_and_hydration_notes: [
        'Maintain daily target weight control to reduce joint loading (1 kg weight loss reduces 4 kg knee joint burden)',
        'Ensure daily calcium and Vitamin D3 supplementation'
      ]
    },
    schedule: {
      daily_schedule: [
        {
          time_slot: '07:30 AM - 08:30 AM',
          period: 'Morning',
          title: 'Morning Medication & Gentle Warm-Up',
          action_items: [
            'Take Pan-D 30 mins before breakfast on empty stomach',
            'Nutritious breakfast followed by Tab Jointace DN',
            'Apply warm moist towel fomentation to knees for 10 minutes to ease morning stiffness'
          ],
          medications_due: ['Tab Pan-D (empty stomach)', 'Tab Jointace DN (after breakfast)'],
          therapy_focus: 'Articular lubrication and stiffness relief'
        },
        {
          time_slot: '05:30 PM - 06:15 PM',
          period: 'Evening',
          title: 'PhysioPulse AI Guarded Vision Session (Knee Circuit)',
          action_items: [
            'Launch PhysioPulse AI on laptop webcam',
            'Complete Protocol 2 (Knee OA Arc) capped strictly at 85 degrees',
            'Complete Protocol 6 (Hip Abduction) for pelvic stability',
            'Verify zero knee valgus compensation on live AI telemetry hud'
          ],
          medications_due: ['Tab Zerodol-SP (if pain > 4/10 after evening tea)'],
          therapy_focus: 'Targeted VMO quadriceps co-contraction & pelvic stabilization',
          is_physiopulse_session: true
        },
        {
          time_slot: '09:30 PM - 10:15 PM',
          period: 'Night',
          title: 'Night Sleep Alignment',
          action_items: [
            'Light dinner',
            'Place small contour pillow under knees when lying supine or between knees when side sleeping'
          ],
          medications_due: [],
          therapy_focus: 'Nocturnal decompression'
        }
      ],
      milestones: [
        {
          phase: 'Phase 1 (Days 1 - 7)',
          title: 'Acute Load Offloading & 85° Safe Excursion',
          goals: [
            'Zero pain flare during daily walking',
            'Complete all prescribed sets of 85° quad extensions without knee shaking',
            'Reduce morning stiffness duration to under 10 minutes'
          ],
          target_rom_gain: 'Guarded 85° Pain-Free Arc',
          frequency: 'Daily evening PhysioPulse session'
        },
        {
          phase: 'Phase 2 (Days 8 - 14)',
          title: 'Hip Abductor Kinetic Strength & Symmetry',
          goals: [
            'Achieve >92% bilateral kinematic symmetry on PhysioPulse vision ledger',
            'Descend a standard flight of 12 stairs with minimal railing support'
          ],
          target_rom_gain: '85° - 90° Functional Stability',
          frequency: 'Daily session'
        }
      ],
      follow_up: {
        review_after_days: 14,
        tentative_date: '13/11/2026',
        investigations_to_bring: [
          'PhysioPulse AI Kinematic Session Telemetry & CPT Ledger Report (PDF)',
          'Previous Bilateral Knee X-Ray films'
        ],
        doctor_name: 'Dr. S. K. Narang (Narang Imaging Centre)'
      }
    }
  },

  mri_shoulder_tear: {
    id: 'report_mri_shoulder_tear_01',
    source: 'calibrated_sample',
    raw_transcription: `MAGNETIC RESONANCE IMAGING (MRI) REPORT
STUDY: HIGH-FIELD 3.0T MRI OF THE RIGHT SHOULDER JOINT
SEQUENCES: CORONAL OBLIQUE T2 FS, SAGITTAL OBLIQUE T1, AXIAL T2*, AND CORONAL PD.
CLINICAL INDICATION: 46-year-old female software executive with acute-on-chronic painful right shoulder arc, painful catch at 70°-90° of abduction, and nocturnal sleep disruption when rolling onto right side.

OBSERVATIONS:
- Supraspinatus Tendon: Significant focal hyperintensity on T2-weighted and PD fat-suppressed images in the distal insertional critical zone (footprint of greater tuberosity). High-grade partial-thickness articular surface tear measuring 6.2 mm AP x 4.1 mm transverse. No full-thickness tendon retraction or fatty atrophy of muscle belly (Goutallier Grade 0).
- Infraspinatus & Teres Minor: Intact tendon contours without focal tear.
- Subscapularis: Mild tendinosis at the superior insertion; no discrete tear or subluxation of long head of biceps.
- Biceps Tendon: Long head of biceps tendon is located normally within the bicipital groove without tear or dislocation.
- Subacromial Space & Bursa: Prominent fluid signal within the subacromial-subdeltoid bursa with thickened bursal walls, reflecting reactive subacromial impingement bursitis.
- Acromioclavicular Joint: Type II acromion with anteroinferior sloping spur encroaching upon the supraspinatus outlet.

IMPRESSION:
1. HIGH-GRADE PARTIAL-THICKNESS ARTICULAR SURFACE TEAR OF THE RIGHT SUPRASPINATUS TENDON (ELLMAN GRADE 2-3).
2. REACTIVE SUBACROMIAL-SUBDELTOID BURSITIS SECONDARY TO MECHANICAL OUTLET IMPINGEMENT (TYPE II ACROMION).
3. CLINICAL & BIOMECHANICAL DIRECTIVE: Conservative kinematic rehabilitation recommended. RESTRICT CORONAL SHOULDER ABDUCTION TO MAXIMUM 70 DEGREES TO PREVENT AGGRAVATING SUBACROMIAL PINCHING. AVOID BALLISTIC OVERHEAD MOVEMENTS.`,
    doctor_details: {
      doctor_name: 'Dr. Priya Venkataraman',
      qualifications: 'MBBS, DMRD, DNB Radiology (Fellowship Musculoskeletal MRI)',
      hospital_or_clinic: 'CityScan Advanced 3.0T MRI & Neuro-Imaging Institute',
      department: 'Musculoskeletal MRI Section',
      registration_number: 'MCI-MRI-51029',
      contact: '+91 80 2699 4500',
      consultation_date: '29/10/2026',
      room: '3.0T MRI Suite 1'
    },
    patient_details: {
      name: 'Meera Krishnan',
      age: 46,
      gender: 'Female',
      uhid: 'UHID-BLR-77291',
      weight: '62 kg',
      blood_pressure: '122/78 mmHg',
      pulse: '70 bpm'
    },
    handwriting_audit: {
      legibility_score_percent: 99,
      decipher_confidence_percent: 99,
      handwriting_style: 'Diagnostic 3.0T Magnetic Resonance Imaging Report (PACS Verified)',
      shorthand_terms_decoded: [
        {
          raw_term: 'T2 FS Hyperintensity',
          decoded_meaning: 'High-signal fluid edema indicating tissue tearing and acute inflammation on fat-suppressed scans',
          clinical_context: 'Diagnostic hallmark of rotator cuff tendinopathy and tendon tears'
        },
        {
          raw_term: 'Ellman Grade 2-3',
          decoded_meaning: 'Partial-thickness tear depth between 3mm and 6mm (involving >50% of tendon thickness)',
          clinical_context: 'Clinical staging determining conservative vs surgical pathway'
        },
        {
          raw_term: 'ROM Cap 70°',
          decoded_meaning: 'Target Range of Motion Capped at 70 degrees',
          clinical_context: 'Prevents greater tuberosity from impinging against the anteroinferior acromial spur'
        }
      ]
    },
    clinical_findings: {
      chief_complaints: [
        'Severe right shoulder pain when reaching sideways or overhead (VAS 7/10)',
        'Inability to sleep on the right side due to throbbing lateral ache',
        'Painful arc caught sharply between 65° and 90° of arm raise'
      ],
      on_examination_signs: [
        'Positive Neer impingement test and Hawkins-Kennedy sign',
        'Marked tenderness over the greater tuberosity anteriorly',
        'Compensatory upper trapezius hiking when attempting coronal abduction'
      ],
      radiology_findings: [
        '6.2 mm high-grade partial-thickness articular tear of supraspinatus tendon',
        'Subacromial-subdeltoid impingement bursitis',
        'Type II acromion with anteroinferior osseous spur'
      ],
      diagnosis: 'Right Shoulder Supraspinatus Tendon High-Grade Partial Tear & Subacromial Bursitis',
      icd10_code: 'M75.111',
      severity_assessment: 'Severe / Guarded'
    },
    radiology_scan: {
      modality: 'mri',
      modality_label: 'High-Field 3.0T MRI (Coronal Oblique T2 FS Sequence)',
      body_region: 'Right Glenohumeral Joint & Rotator Cuff Arch',
      structural_findings: [
        'High-signal focal defect in distal critical zone of supraspinatus (6.2 mm)',
        'Prominent subacromial-subdeltoid fluid with thickened bursal walls',
        'Type II acromion with anterior-inferior sloping causing mechanical outlet impingement'
      ],
      pathology_grade: 'High-Grade Partial-Thickness Tear (Ellman Grade 2-3 Articular)',
      biomechanical_restrictions: {
        recommended_rom_cap_degrees: 70,
        restricted_movements: [
          'Coronal plane shoulder abduction past 70 degrees (impinges against acromial spur)',
          'Sudden ballistic overhead reaching or heavy lifting',
          'Internal rotation with forced adduction behind back'
        ],
        contraindications: [
          'High-angle bilateral wall slides beyond 110 degrees during acute phase',
          'Dumbbell lateral shoulder raises'
        ]
      }
    },
    session_plan: {
      patient_name: 'Meera Krishnan',
      affected_area: 'Right Shoulder & Scapulohumeral Rhythm',
      vas_pain_level: 7,
      clinical_diagnosis_summary: 'Targeted kinematic protocol calibrated directly from 3.0T Shoulder MRI study. Crucially, Protocol 1 (Frozen Shoulder / Abduction) is automatically capped at 70° (guarded from standard 90°) to prevent the supraspinatus footprint from impinging under the Type II acromial spur. Synergized with Protocol 5 (Bilateral Overhead Wall-Slide) capped at 110° and anchored by Protocol 3 (Cervical Posture Guard) to suppress compensatory trapezius hiking.',
      precautions: 'CRITICAL 3.0T MRI SAFEGUARD: ROM capped at 70° for supraspinatus tear. Pyttsx3 audio biofeedback will alert immediately if elevation exceeds 70° or if shoulder shrug compensation is detected.',
      circuit_mode: 'targeted',
      exercises: [
        {
          protocol_id: 1,
          protocol_name: 'P1: Rotator Cuff Abduction (MRI Guarded 70°)',
          target_reps: 6,
          target_rom_degrees: 70,
          clinical_rationale: 'Calibrated from 3.0T MRI: Strictly capped at 70° to isolate deltoid/supraspinatus without subacromial spur friction.',
          sensor_focus: 'Glenohumeral vector & shoulder hiking avoidance',
          compensation_watch: 'Watch for trapezius shrug substitution and elbow bending'
        },
        {
          protocol_id: 5,
          protocol_name: 'P5: Bilateral Overhead Wall-Slide Sync (Gentle 110°)',
          target_reps: 6,
          target_rom_degrees: 110,
          clinical_rationale: 'Retrains upward scapular rotation and serratus anterior activation to open the subacromial outlet.',
          sensor_focus: 'Bilateral scapular elevation synchrony',
          compensation_watch: 'Avoid hyperextending lumbar spine during wall slide'
        },
        {
          protocol_id: 3,
          protocol_name: 'P3: Cervical & Ergonomic Posture Guard',
          target_reps: 1,
          target_rom_degrees: 85,
          clinical_rationale: 'Stabilizes deep cervical neck flexors to prevent ipsilateral neck strain.',
          sensor_focus: 'Axial cervical alignment plumb line',
          compensation_watch: 'Do not allow chin protrusion or slouch'
        }
      ]
    },
    treatment_plan: {
      clinical_overview: 'Specialized non-operative rotator cuff restoration program combining targeted NSAID inflammation suppression, subacromial rest, and guarded computer vision movement coaching.',
      medications: [
        {
          name: 'Tab Myoril 4mg',
          generic_composition: 'Thiocolchicoside 4mg',
          dosage: '1 capsule',
          frequency: 'Twice Daily (1-0-1)',
          timing: 'After meals',
          duration: '5 days',
          purpose: 'Centrally-acting muscle relaxant to relieve acute upper trapezius spasm',
          special_instructions: 'May cause mild daytime drowsiness; avoid driving'
        },
        {
          name: 'Tab Zerodol-SP',
          generic_composition: 'Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg',
          dosage: '1 tablet',
          frequency: 'Twice Daily (1-0-1)',
          timing: 'After meals',
          duration: '5 days',
          purpose: 'Reduces subacromial-subdeltoid bursal effusion and tendon inflammation',
          special_instructions: 'Take strictly after food with full glass of water'
        },
        {
          name: 'Tab Pan-D',
          generic_composition: 'Pantoprazole 40mg + Domperidone 30mg SR',
          dosage: '1 capsule',
          frequency: 'Once Daily (OD BBF)',
          timing: '30 mins before breakfast',
          duration: '5 days',
          purpose: 'Gastric protection',
          special_instructions: 'Swallow whole on empty stomach'
        }
      ],
      lifestyle_adaptations: [
        {
          category: 'Sleep Ergonomics',
          directive: 'Do not sleep on the right side. Sleep on left side with a supportive pillow hugging right arm or on back.',
          rationale: 'Direct lateral decubitus pressure occludes microvascular blood flow to the already vulnerable supraspinatus critical zone.',
          indian_context_note: 'Prop right arm on a soft pillow to keep arm in gentle 20-30 degree abduction.'
        },
        {
          category: 'Commute & Travel',
          directive: 'Do not carry heavy laptop bags or vegetable bags on right shoulder strap.',
          rationale: 'Axial strap compression directly pinches the inflamed subacromial bursa against the acromial spur.',
          indian_context_note: 'Switch to backpack with padded bilateral shoulder straps or use wheeled trolley.'
        },
        {
          category: 'Physical Habits',
          directive: 'Avoid reaching into high kitchen cabinets or top shelves with the right arm.',
          rationale: 'Overhead reaching >70 degrees mechanically impinges the torn tendon fibers.',
          indian_context_note: 'Keep daily kitchen utensils at chest level.'
        }
      ],
      red_flag_warnings: [
        'Sudden complete inability to raise arm (potential full-thickness progression)',
        'Severe intractable nocturnal pain waking patient every 1-2 hours',
        'Numbness or tingling radiating down to thumb or fingertips'
      ],
      dietary_and_hydration_notes: [
        'Maintain high-protein intake (eggs, paneer, lentils, collagen) to support tendon tissue collagen synthesis',
        'Adequate hydration (2.5L daily)'
      ]
    },
    schedule: {
      daily_schedule: [
        {
          time_slot: '08:00 AM - 08:45 AM',
          period: 'Morning',
          title: 'Morning Medication & Cryotherapy',
          action_items: [
            'Pan-D 30 mins before breakfast',
            'Nutritious breakfast followed by Zerodol-SP and Myoril',
            'Apply ice pack wrapped in clean towel to anterior shoulder for 15 mins'
          ],
          medications_due: ['Tab Pan-D', 'Tab Zerodol-SP', 'Tab Myoril 4mg'],
          therapy_focus: 'Bursal effusion suppression'
        },
        {
          time_slot: '06:00 PM - 06:45 PM',
          period: 'Evening',
          title: 'PhysioPulse AI Guarded Vision Session (MRI 70° Circuit)',
          action_items: [
            'Set up webcam 5-6 feet away in well-lit room',
            'Execute Protocol 1 (Shoulder Abduction) - observe strict 70 degree green HUD boundary',
            'Execute Protocol 5 (Bilateral Wall Slide) with smooth scapular glide',
            'Execute Protocol 3 (Cervical Posture Guard)'
          ],
          medications_due: ['Tab Zerodol-SP (post dinner)', 'Tab Myoril 4mg (post dinner)'],
          therapy_focus: 'Scapulohumeral rhythm without impingement',
          is_physiopulse_session: true
        },
        {
          time_slot: '10:00 PM - 10:30 PM',
          period: 'Night',
          title: 'Night Sleep Positioning',
          action_items: [
            'Place pillow wedge under right arm',
            'Ensure cervical neck alignment'
          ],
          medications_due: [],
          therapy_focus: 'Nocturnal microvascular preservation'
        }
      ],
      milestones: [
        {
          phase: 'Phase 1 (Days 1 - 5)',
          title: 'Impingement Suppression & 70° Guarded Arc',
          goals: [
            'Eliminate sharp pain catch on arm elevation',
            'Achieve 100% compliance with 70° safe ceiling on PhysioPulse AI',
            'Sleep continuously for 6 hours without right shoulder waking'
          ],
          target_rom_gain: 'Safe 70° Guarded Arc',
          frequency: 'Daily evening session'
        },
        {
          phase: 'Phase 2 (Days 6 - 12)',
          title: 'Serratus Anterior & Scapular Upward Rotation',
          goals: [
            'Symmetric scapulohumeral rhythm on Protocol 5',
            'Zero trapezius hike detected by MediaPipe landmarks'
          ],
          target_rom_gain: '70° - 80° Progression (Painless)',
          frequency: 'Daily session'
        }
      ],
      follow_up: {
        review_after_days: 10,
        tentative_date: '09/11/2026',
        investigations_to_bring: [
          'PhysioPulse AI Session Kinematic Ledger & Compliance Report',
          'CityScan 3.0T MRI Film Jacket & DICOM CD'
        ],
        doctor_name: 'Dr. Priya Venkataraman (CityScan Institute)'
      }
    }
  }
};

/**
 * Helper to convert an uploaded or sample prescription into a standard PhysioPulse PrescriptionOutput
 */
export function convertReportToPhysioPrescription(report: DecipheredDoctorReport): PrescriptionOutput {
  const romCap = report.radiology_scan?.biomechanical_restrictions?.recommended_rom_cap_degrees;

  let precautions = report.session_plan.precautions;
  if (romCap && report.radiology_scan) {
    const safeTag = `[${report.radiology_scan.modality.toUpperCase()} SAFEGUARD: Target ROM capped at ${romCap}° based on ${report.radiology_scan.pathology_grade}]. `;
    if (!precautions.includes(safeTag)) {
      precautions = `${safeTag}${precautions}`;
    }
  }

  return {
    patient_name: report.patient_details.name || report.session_plan.patient_name || 'Patient',
    clinical_diagnosis_summary: report.session_plan.clinical_diagnosis_summary,
    precautions,
    exercises: report.session_plan.exercises.map((ex) => {
      // If a radiology ROM cap is active and applies to this joint, safely restrict target_rom_degrees
      let targetRom = ex.target_rom_degrees;
      if (romCap && ex.target_rom_degrees > romCap) {
        // Only cap for the primary affected joint
        if (
          (report.radiology_scan?.modality === 'xray' && ex.protocol_id === 2) ||
          (report.radiology_scan?.modality === 'mri' && ex.protocol_id === 1)
        ) {
          targetRom = romCap;
        }
      }

      return {
        protocol_id: ex.protocol_id,
        protocol_name: ex.protocol_name,
        target_reps: ex.target_reps,
        target_rom_degrees: targetRom,
        clinical_rationale: ex.clinical_rationale
      };
    })
  };
}
