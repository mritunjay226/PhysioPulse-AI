import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 Widescreen standard
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Colors
    BG_DARK = RGBColor(11, 19, 43)        # #0B132B Deep Obsidian Navy
    CARD_BG = RGBColor(22, 33, 62)        # #16213E Indigo Card
    CARD_BORDER = RGBColor(39, 53, 90)    # #27355A
    ACCENT_CYAN = RGBColor(0, 229, 255)   # #00E5FF Vibrant Tech Cyan
    ACCENT_EMERALD = RGBColor(16, 185, 129)# #10B981 Clinical Green
    ACCENT_ROSE = RGBColor(244, 63, 94)   # #F43F5E Compensation Red
    ACCENT_AMBER = RGBColor(245, 158, 11) # #F59E0B Warning Gold
    TEXT_WHITE = RGBColor(255, 255, 255)  # #FFFFFF
    TEXT_MUTED = RGBColor(148, 163, 184)  # #94A3B8 Slate Gray
    TEXT_DIM = RGBColor(100, 116, 139)    # #64748B Dark Slate

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, track_text, title_text, slide_num=""):
        # Track Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.4), Inches(4.2), Inches(0.35))
        badge.fill.solid()
        badge.fill.fore_color.rgb = CARD_BG
        badge.line.color.rgb = ACCENT_CYAN
        badge.line.width = Pt(1)
        tf = badge.text_frame
        tf.word_wrap = False
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = track_text.upper()
        run.font.name = "Arial"
        run.font.size = Pt(9.5)
        run.font.bold = True
        run.font.color.rgb = ACCENT_CYAN

        # Title
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.82), Inches(10.5), Inches(0.7))
        tf_t = tb.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_right = tf_t.margin_top = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        run_t = p_t.add_run()
        run_t.text = title_text
        run_t.font.name = "Arial"
        run_t.font.size = Pt(21)
        run_t.font.bold = True
        run_t.font.color.rgb = TEXT_WHITE

        # Slide Number
        if slide_num:
            nb = slide.shapes.add_textbox(Inches(11.5), Inches(0.4), Inches(1.0), Inches(0.35))
            tf_n = nb.text_frame
            p_n = tf_n.paragraphs[0]
            p_n.alignment = PP_ALIGN.RIGHT
            run_n = p_n.add_run()
            run_n.text = slide_num
            run_n.font.name = "Arial"
            run_n.font.size = Pt(10)
            run_n.font.color.rgb = TEXT_MUTED

    # ==========================================================
    # SLIDE 1: HERO COVER SLIDE
    # ==========================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Track Tag
    tag = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.6), Inches(5.2), Inches(0.38))
    tag.fill.solid()
    tag.fill.fore_color.rgb = CARD_BG
    tag.line.color.rgb = ACCENT_CYAN
    tag.line.width = Pt(1.2)
    p = tag.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "IDEAS 4.0 • PROBLEM STATEMENT 6: AI FOR SMARTER HEALTHCARE"
    r.font.name = "Arial"
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = ACCENT_CYAN

    # Main Brand Title
    tb = s1.shapes.add_textbox(Inches(0.8), Inches(1.2), Inches(11.7), Inches(1.1))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    r = p.add_run()
    r.text = "PhysioPulse AI"
    r.font.name = "Arial"
    r.font.size = Pt(46)
    r.font.bold = True
    r.font.color.rgb = TEXT_WHITE

    # High-impact Subtitle
    tb_sub = s1.shapes.add_textbox(Inches(0.8), Inches(2.25), Inches(11.7), Inches(1.0))
    tf_sub = tb_sub.text_frame
    tf_sub.word_wrap = True
    p1 = tf_sub.paragraphs[0]
    r1 = p1.add_run()
    r1.text = "Upload Doctor Reports → AI Auto-Plans Sessions → 60 FPS On-Device 3D Vision Biofeedback"
    r1.font.name = "Arial"
    r1.font.size = Pt(16.5)
    r1.font.bold = True
    r1.font.color.rgb = ACCENT_CYAN

    p2 = tf_sub.add_paragraph()
    r2 = p2.add_run()
    r2.text = "Patients upload discharge summaries, MRI findings, or prescription sheets. PhysioPulse simplifies the clinical jargon, formulates personalized kinetic rehab sessions, and coaches form in real time using any laptop or phone camera."
    r2.font.name = "Arial"
    r2.font.size = Pt(12.5)
    r2.font.color.rgb = TEXT_MUTED

    # 4 Hero Pillar Cards
    pillars = [
        ("33-Point 3D Pose", "60 FPS Local Core", "MediaPipe Full Landmarker running purely on-device. Zero cloud video latency; 100% patient video privacy.", ACCENT_CYAN),
        ("Report Upload & AI Plan", "Intake → Auto-Plan", "Patients upload doctor/MRI reports. AI extracts restrictions and plans auto-advancing kinematic queues.", ACCENT_AMBER),
        ("8 Clinical Protocols", "Full-Body Suite", "Cervical, Shoulder, Elbow, Wrist, Lumbar, Hip & Knee with live angle & vector goniometry.", ACCENT_EMERALD),
        ("100% On-Device Safety", "Responsible AI", "Built-in red-flag emergency triage (VAS ≥8 locks unguided reps) with CMS RTM billing ledger.", ACCENT_ROSE),
    ]

    card_w = Inches(2.78)
    card_h = Inches(3.2)
    start_x = Inches(0.8)
    y_pos = Inches(3.65)

    for i, (head, sub, desc, color) in enumerate(pillars):
        cx = start_x + i * (card_w + Inches(0.2))
        card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, y_pos, card_w, card_h)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = color
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = Inches(0.2)

        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = head
        r.font.name = "Arial"
        r.font.size = Pt(15)
        r.font.bold = True
        r.font.color.rgb = TEXT_WHITE

        p_sub = tf.add_paragraph()
        r_sub = p_sub.add_run()
        r_sub.text = sub.upper()
        r_sub.font.name = "Arial"
        r_sub.font.size = Pt(9.5)
        r_sub.font.bold = True
        r_sub.font.color.rgb = color

        p_desc = tf.add_paragraph()
        p_desc.space_before = Pt(12)
        r_desc = p_desc.add_run()
        r_desc.text = desc
        r_desc.font.name = "Arial"
        r_desc.font.size = Pt(11)
        r_desc.font.color.rgb = TEXT_MUTED

    # ==========================================================
    # SLIDE 2: THE PROBLEM: THE "BLIND HOME-REHAB" CRISIS
    # ==========================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "The Real-World Orthopedic Crisis", "The Problem: Unintelligible Reports & The 'Blind Home-Rehab' Gap", "02 / 09")

    prob_cards = [
        ("The ₹1,000/Session Cost Barrier", "70%+ Rehab Drop-Off Rate",
         "• Daily clinic physiotherapy costs ₹800–₹1,500 per visit plus painful travel in Tier-2/3 towns.\n\n• Most patients abandon therapy within 10 days, causing permanent loss of joint Range of Motion (ROM).", ACCENT_ROSE),
        ("Biomechanical Compensation & Cheat-Reps", "Zero Eyes at Home",
         "• Patients unconsciously cheat when recovering—shrugging shoulders or twisting spines.\n\n• Passive videos (YouTube/fitness apps) cannot see joint angles or interrupt a patient mid-rep when form slips.", ACCENT_AMBER),
        ("Doctor Report Upload & Autonomous Planning", "Bridging the Paper Gap",
         "• Patients leave clinics with unintelligible MRI summaries or paper exercise handouts.\n\n• PhysioPulse lets patients upload doctor discharge reports directly—AI translates clinical jargon and auto-plans personalized kinematic sessions.", ACCENT_CYAN)
    ]

    card_w2 = Inches(3.74)
    card_h2 = Inches(4.3)
    y_pos2 = Inches(1.65)

    for i, (head, sub, desc, color) in enumerate(prob_cards):
        cx = Inches(0.8) + i * (card_w2 + Inches(0.25))
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, y_pos2, card_w2, card_h2)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = color
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = Inches(0.25)

        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = head
        r.font.name = "Arial"
        r.font.size = Pt(15.5)
        r.font.bold = True
        r.font.color.rgb = TEXT_WHITE

        p_sub = tf.add_paragraph()
        r_sub = p_sub.add_run()
        r_sub.text = sub.upper()
        r_sub.font.name = "Arial"
        r_sub.font.size = Pt(10)
        r_sub.font.bold = True
        r_sub.font.color.rgb = color

        p_desc = tf.add_paragraph()
        p_desc.space_before = Pt(14)
        r_desc = p_desc.add_run()
        r_desc.text = desc
        r_desc.font.name = "Arial"
        r_desc.font.size = Pt(11.5)
        r_desc.font.color.rgb = TEXT_MUTED

    # Bottom Banner
    bb = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.15), Inches(11.73), Inches(0.85))
    bb.fill.solid()
    bb.fill.fore_color.rgb = RGBColor(16, 28, 54)
    bb.line.color.rgb = ACCENT_CYAN
    bb.line.width = Pt(1)
    tf_bb = bb.text_frame
    tf_bb.word_wrap = True
    p_bb = tf_bb.paragraphs[0]
    p_bb.alignment = PP_ALIGN.CENTER
    r_bb = p_bb.add_run()
    r_bb.text = "THE CORE REALIZATION: "
    r_bb.font.name = "Arial"
    r_bb.font.size = Pt(11.5)
    r_bb.font.bold = True
    r_bb.font.color.rgb = ACCENT_CYAN

    r_bb2 = p_bb.add_run()
    r_bb2.text = "Text chatbots only offer Q&A. True 'Smarter Healthcare' demands combining LLM Clinical Triage with 60 FPS On-Device Computer Vision Biomechanics to guide recovery hands-free."
    r_bb2.font.name = "Arial"
    r_bb2.font.size = Pt(11)
    r_bb2.font.color.rgb = TEXT_WHITE

    # ==========================================================
    # SLIDE 3: 100% ALIGNMENT WITH PROBLEM STATEMENT 6
    # ==========================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "Mandatory Track Requirements", "100% Alignment with Track 6: 'AI for Smarter Healthcare'", "03 / 09")

    matrix_rows = [
        ("1. Multilingual AI Health Assistant\n(Hindi, English + Regional Dialect)",
         "Natural language symptom intake supporting Hindi (हिन्दी), Hinglish, and English. Accompanied by voice biofeedback coaching the user during every movement.",
         "Intake Stage + pyttsx3 Audio Coach"),
        ("2. Smart Symptom Guidance &\nEmergency Medical Triage",
         "Evaluates VAS pain scale (1–10). Built-in red-flag emergency guardrail: acute pain (≥8/10) automatically locks unguided exercise and triggers hospital referral.",
         "AI Triage Guardrail Engine"),
        ("3. Medical Report Simplifier &\nAutonomous Session Planner",
         "Patients upload doctor discharge summaries, MRI scans, or prescription sheets. Clinical AI parses diagnoses and auto-plans sequential kinematic routines ('prescribed_session.json').",
         "Doctor Report Upload + AI Engine"),
        ("4. Preventive Healthcare &\nActionable Wellness Tracking",
         "Preventive posture guard for desk workers (P3 Cervical Neck & P8 Carpal Tunnel Wrist) with degree-by-degree ROM progression and compliance charts.",
         "physiopulse.py + Web Telemetry"),
        ("5. Responsible AI, Privacy &\nNon-Diagnostic Guardrails",
         "100% local on-device camera inference (zero video frames sent to cloud). Explicit clinical disclaimer: PhysioPulse assists recovery—never replaces clinicians.",
         "Local OpenCV / MediaPipe Core")
    ]

    y_start = Inches(1.6)
    row_h = Inches(1.0)
    for i, (req, impl, mod) in enumerate(matrix_rows):
        ry = y_start + i * (row_h + Inches(0.12))

        # Req box
        b1 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), ry, Inches(3.2), row_h)
        b1.fill.solid()
        b1.fill.fore_color.rgb = CARD_BG
        b1.line.color.rgb = ACCENT_CYAN
        b1.line.width = Pt(1)
        tf = b1.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.15)
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = req
        r.font.name = "Arial"
        r.font.size = Pt(10.5)
        r.font.bold = True
        r.font.color.rgb = TEXT_WHITE

        # Impl box
        b2 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.1), ry, Inches(5.8), row_h)
        b2.fill.solid()
        b2.fill.fore_color.rgb = CARD_BG
        b2.line.color.rgb = CARD_BORDER
        b2.line.width = Pt(1)
        tf = b2.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.2)
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = impl
        r.font.name = "Arial"
        r.font.size = Pt(10.5)
        r.font.color.rgb = TEXT_MUTED

        # Module box
        b3 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.0), ry, Inches(2.53), row_h)
        b3.fill.solid()
        b3.fill.fore_color.rgb = RGBColor(16, 28, 54)
        b3.line.color.rgb = ACCENT_EMERALD
        b3.line.width = Pt(1)
        tf = b3.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.15)
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = mod
        r.font.name = "Arial"
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = ACCENT_EMERALD

    # ==========================================================
    # SLIDE 4: 4-STAGE CLOSED-LOOP AI ARCHITECTURE
    # ==========================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "Autonomous End-to-End Workflow", "Our Approach: 4-Stage Closed-Loop AI & Edge Vision Architecture", "04 / 09")

    stages = [
        ("STAGE 1", "Doctor Report Upload & AI", "• Upload discharge / MRI reports\n• AI simplifies clinical jargon\n• Acute red-flag safety triage\n• Auto-plans personalized sets", ACCENT_CYAN),
        ("STAGE 2", "3D Edge Vision", "• 33-landmark MediaPipe Full core\n• True gravity reference vector\n• Scale-invariant normalization\n• 60 FPS local on-device pipeline", ACCENT_EMERALD),
        ("STAGE 3", "Biofeedback Engine", "• 8 clinical orthopedic protocols\n• 6-frame compensation debouncer\n• Non-blocking audio voice coach\n• Red HUD skeleton visual alert", ACCENT_AMBER),
        ("STAGE 4", "Clinical Telemetry", "• Auto-advances protocol queue\n• Writes clinical_session_report.json\n• CMS RTM CPT insurance coding\n• 1-Click Doctor PDF letterhead", ACCENT_ROSE)
    ]

    card_w4 = Inches(2.78)
    card_h4 = Inches(3.6)
    y_pos4 = Inches(1.6)

    for i, (stg, head, desc, color) in enumerate(stages):
        cx = Inches(0.8) + i * (card_w4 + Inches(0.2))
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, y_pos4, card_w4, card_h4)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = color
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = Inches(0.2)

        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = stg
        r.font.name = "Arial"
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = color

        p_head = tf.add_paragraph()
        r_head = p_head.add_run()
        r_head.text = head
        r_head.font.name = "Arial"
        r_head.font.size = Pt(14)
        r_head.font.bold = True
        r_head.font.color.rgb = TEXT_WHITE

        p_desc = tf.add_paragraph()
        p_desc.space_before = Pt(12)
        r_desc = p_desc.add_run()
        r_desc.text = desc
        r_desc.font.name = "Arial"
        r_desc.font.size = Pt(11)
        r_desc.font.color.rgb = TEXT_MUTED

    # Closed-loop Feedback Bar
    fb = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.4), Inches(11.73), Inches(1.5))
    fb.fill.solid()
    fb.fill.fore_color.rgb = RGBColor(16, 28, 54)
    fb.line.color.rgb = ACCENT_CYAN
    fb.line.width = Pt(1.5)

    tf_fb = fb.text_frame
    tf_fb.word_wrap = True
    tf_fb.margin_left = tf_fb.margin_right = Inches(0.3)
    p = tf_fb.paragraphs[0]
    r = p.add_run()
    r.text = "🔄 CLOSED-LOOP BIOMECHANICAL ADAPTATION: "
    r.font.name = "Arial"
    r.font.size = Pt(11.5)
    r.font.bold = True
    r.font.color.rgb = ACCENT_CYAN

    r2 = p.add_run()
    r2.text = "Why PhysioPulse is truly closed-loop:\n"
    r2.font.name = "Arial"
    r2.font.size = Pt(11)
    r2.font.color.rgb = TEXT_WHITE

    p_body = tf_fb.add_paragraph()
    r_body = p_body.add_run()
    r_body.text = "When a patient completes reps with high bilateral symmetry and zero compensation frames, the Clinical AI Agent automatically increases target ROM (+5°) and rep volume for next session. If compensatory shrugs are caught, the system auto-calibrates downward to protect the articular capsule."
    r_body.font.name = "Arial"
    r_body.font.size = Pt(10.5)
    r_body.font.color.rgb = TEXT_MUTED

    # ==========================================================
    # SLIDE 5: ENGINEERING DEPTH & SIGNAL STABILIZATION
    # ==========================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "Biomechanical Precision & Math", "Engineering Depth: Signal Stabilization & Clinical ROM Telemetry", "05 / 09")

    # Left: Embed Matplotlib Chart 1
    if os.path.exists("chart_signal_stabilization.png"):
        s5.shapes.add_picture("chart_signal_stabilization.png", Inches(0.8), Inches(1.6), Inches(5.8), Inches(3.6))

    # Right: Embed Matplotlib Chart 2
    if os.path.exists("chart_14day_telemetry.png"):
        s5.shapes.add_picture("chart_14day_telemetry.png", Inches(6.75), Inches(1.6), Inches(5.8), Inches(3.6))

    # Bottom 3 Technical Callouts
    tech_boxes = [
        ("2D/3D Dot-Product Goniometry", "θ = arccos((BA · BC) / (||BA|| ||BC||))", "Eliminates arctan quadrant flips; measures true anatomical vertex angles across 3D space.", ACCENT_CYAN),
        ("Dual-Layer EMA Jitter Filter", "α_landmarks=0.38  •  α_angles=0.30", "Filters out webcam pixel noise and tremor without introducing artificial lag or latency.", ACCENT_EMERALD),
        ("6-Frame Biomechanical Debouncer", "Duration > 0.2s  •  Confidence > 0.50", "Requires 6 consecutive bad posture frames before alerting, preventing false alarms.", ACCENT_AMBER)
    ]

    cw5 = Inches(3.74)
    for i, (title, formula, exp, color) in enumerate(tech_boxes):
        cx = Inches(0.8) + i * (cw5 + Inches(0.25))
        box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(5.35), cw5, Inches(1.65))
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = color
        box.line.width = Pt(1.2)

        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.2)
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = title
        r.font.name = "Arial"
        r.font.size = Pt(11.5)
        r.font.bold = True
        r.font.color.rgb = TEXT_WHITE

        p_f = tf.add_paragraph()
        r_f = p_f.add_run()
        r_f.text = formula
        r_f.font.name = "Courier New"
        r_f.font.size = Pt(9.5)
        r_f.font.bold = True
        r_f.font.color.rgb = color

        p_e = tf.add_paragraph()
        p_e.space_before = Pt(4)
        r_e = p_e.add_run()
        r_e.text = exp
        r_e.font.name = "Arial"
        r_e.font.size = Pt(10)
        r_e.font.color.rgb = TEXT_MUTED

    # ==========================================================
    # SLIDE 6: 8 PARAMETRIC CLINICAL PROTOCOLS
    # ==========================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Clinical Orthopedic Suite", "Full-Body Clinical Suite: 8 Parametric Kinematic Protocols", "06 / 09")

    # Table of 8 Protocols
    table_shape = s6.shapes.add_table(9, 5, Inches(0.8), Inches(1.5), Inches(11.73), Inches(5.4))
    table = table_shape.table
    table.columns[0].width = Inches(0.8)   # ID
    table.columns[1].width = Inches(2.6)   # Protocol Name
    table.columns[2].width = Inches(2.3)   # Anatomical Joint
    table.columns[3].width = Inches(3.6)   # Primary Vector & Target
    table.columns[4].width = Inches(2.43)  # Compensation Caught

    headers = ["ID", "Clinical Protocol Name", "Anatomical Joint", "Primary Vector & Target", "Compensatory Error Caught"]
    for col_idx, h_text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(16, 28, 54)
        p = cell.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = h_text
        r.font.name = "Arial"
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = ACCENT_CYAN

    protocol_data = [
        ("P1", "Frozen Shoulder Abduction", "Glenohumeral Joint", "Vertical Ref → Shoulder → Elbow (90°+)", "Shrugging / Bent Elbow"),
        ("P2", "Post-ACL Knee Extension / Squat", "Tibiofemoral Joint", "Hip → Knee → Ankle Flexion (≤112°)", "Torso Forward Lean"),
        ("P3", "Cervical & Desk Posture Guard", "Cervical Spine", "Collarbone Plumb Line → Nose (<14°)", "Posture Drift / Head Tilt"),
        ("P4", "Post-Fracture Elbow Flexion", "Humeroulnar Joint", "Shoulder → Elbow → Wrist (145°→55°)", "Upper-Arm Elbow Drift"),
        ("P5", "Bilateral Overhead Wall-Slide", "Bilateral Shoulder", "Dual Arm Synchronous Abduction (115°+)", ">18° Bilateral Symmetry Gap"),
        ("P6", "Total Hip Replacement Abduction", "Coxofemoral Joint", "Hip Vertical → Hip → Ankle (28°+)", "Lateral Trunk Lean"),
        ("P7", "Lumbar Spine Flexion / Slip-Disc", "Lumbar Spine", "Hip Vertical → Hip → Shoulder (25°+)", "Spinal Shoulder Twist"),
        ("P8", "Carpal Tunnel Wrist Extension", "Radiocarpal Joint", "Elbow → Wrist → Index Knuckle (22°+)", "Shoulder Trapezius Tension")
    ]

    for row_idx, row_data in enumerate(protocol_data, start=1):
        for col_idx, text in enumerate(row_data):
            cell = table.cell(row_idx, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = CARD_BG if row_idx % 2 == 1 else RGBColor(18, 26, 48)
            p = cell.text_frame.paragraphs[0]
            if col_idx == 0:
                p.alignment = PP_ALIGN.CENTER
            r = p.add_run()
            r.text = text
            r.font.name = "Arial"
            r.font.size = Pt(10)
            if col_idx == 0:
                r.font.bold = True
                r.font.color.rgb = ACCENT_CYAN
            elif col_idx == 1:
                r.font.bold = True
                r.font.color.rgb = TEXT_WHITE
            elif col_idx == 4:
                r.font.bold = True
                r.font.color.rgb = ACCENT_ROSE
            else:
                r.font.color.rgb = TEXT_MUTED

    # ==========================================================
    # SLIDE 7: COMMERCIAL VIABILITY & CMS RTM REIMBURSEMENT
    # ==========================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "B2B Business Model & Monetization", "Commercial Viability: CMS Remote Therapeutic Monitoring (RTM)", "07 / 09")

    # Left: Embed Matplotlib Chart 4
    if os.path.exists("chart_cpt_reimbursement.png"):
        s7.shapes.add_picture("chart_cpt_reimbursement.png", Inches(0.8), Inches(1.6), Inches(5.8), Inches(3.6))

    # Right: 3 Monetization Pillars
    b2b_pillars = [
        ("Direct Reimbursement under CMS RTM", "CPT Codes 98975, 98977 & 98980",
         "PhysioPulse qualifies for official Remote Therapeutic Monitoring reimbursement ($125.28/patient/month). Clinics generate new Medicare/commercial revenue without adding staff.", ACCENT_EMERALD),
        ("$150,336 Annual Practice Yield", "Predictable B2B SaaS + Clinic Margin",
         "A moderate clinic cohort of 100 enrolled post-op patients yields $150K+ in annual practice revenue. PhysioPulse charges an 18% SaaS platform fee ($22/pt/mo).", ACCENT_CYAN),
        ("Closing the Doctor Feedback Loop", "Official PDF Telemetry Letterhead",
         "Doctors receive automated degree-by-degree ROM progression curves, compliance timestamps, and bilateral symmetry scores—reducing costly malpractice and readmissions.", ACCENT_AMBER)
    ]

    card_w7 = Inches(5.68)
    card_h7 = Inches(1.15)
    for i, (head, sub, desc, color) in enumerate(b2b_pillars):
        cy = Inches(1.6) + i * (card_h7 + Inches(0.12))
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.85), cy, card_w7, card_h7)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = color
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.2)
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = head
        r.font.name = "Arial"
        r.font.size = Pt(11.5)
        r.font.bold = True
        r.font.color.rgb = TEXT_WHITE

        p_s = tf.add_paragraph()
        r_s = p_s.add_run()
        r_s.text = sub.upper()
        r_s.font.name = "Arial"
        r_s.font.size = Pt(9)
        r_s.font.bold = True
        r_s.font.color.rgb = color

        p_d = tf.add_paragraph()
        r_d = p_d.add_run()
        r_d.text = desc
        r_d.font.name = "Arial"
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = TEXT_MUTED

    # Bottom Summary Banner
    bb7 = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.45), Inches(11.73), Inches(1.45))
    bb7.fill.solid()
    bb7.fill.fore_color.rgb = RGBColor(16, 28, 54)
    bb7.line.color.rgb = ACCENT_CYAN
    bb7.line.width = Pt(1)
    tf_bb7 = bb7.text_frame
    tf_bb7.word_wrap = True
    tf_bb7.margin_left = tf_bb7.margin_right = Inches(0.3)
    p = tf_bb7.paragraphs[0]
    r = p.add_run()
    r.text = "WHY CLINICS ADOPT PHYSIOPULSE: "
    r.font.name = "Arial"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = ACCENT_CYAN

    r2 = p.add_run()
    r2.text = "Traditional hardware systems (wearables/sensors) cost ₹40,000+ per unit and require Bluetooth pairing. PhysioPulse requires zero dedicated hardware—it turns the patient's existing smartphone or laptop webcam into an FDA-compliant remote monitoring portal."
    r2.font.name = "Arial"
    r2.font.size = Pt(10.5)
    r2.font.color.rgb = TEXT_WHITE

    # ==========================================================
    # SLIDE 8: GO-TO-MARKET & ADOPTION TRAJECTORY
    # ==========================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "Mandatory Deliverable #2", "Impact, Adoption & Scaling Plan (0 → 1,000+ Users)", "08 / 09")

    # Left: Embed Matplotlib Chart 3
    if os.path.exists("chart_scaling_trajectory.png"):
        s8.shapes.add_picture("chart_scaling_trajectory.png", Inches(0.8), Inches(1.6), Inches(5.8), Inches(3.6))

    # Right: Phase 1 & Phase 2 Roadmaps
    phases = [
        ("Phase 1: First 100 Users (Zero-Budget Pilot)",
         "• Users 1–50 (Campus Hostel Rollout): Deploy P3 (Cervical Posture) & P8 (Carpal Tunnel) across university hostels & coding clubs as a 2-minute daily check.\n• Users 51–100 (Local Clinic Partnering): Onboard 5 outpatient clinics in Gurugram/NCR—giving therapists our free link so patients perform supervised home reps.", ACCENT_CYAN),
        ("Phase 2: Scaling to 1,000+ Users (Doctor Viral Loop)",
         "• WhatsApp Telemetry Growth Loop: Every completed session generates a 1-click Doctor Summary shared by the patient on WhatsApp.\n• B2B2C Clinic Multiplier: Each orthopedic surgeon or therapist who receives clean reports prescribes PhysioPulse to 25–40 additional outpatients.", ACCENT_EMERALD)
    ]

    card_w8 = Inches(5.68)
    card_h8 = Inches(1.72)
    for i, (title, body, color) in enumerate(phases):
        cy = Inches(1.6) + i * (card_h8 + Inches(0.16))
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.85), cy, card_w8, card_h8)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = color
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.2)
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = title
        r.font.name = "Arial"
        r.font.size = Pt(12)
        r.font.bold = True
        r.font.color.rgb = color

        p_b = tf.add_paragraph()
        p_b.space_before = Pt(6)
        r_b = p_b.add_run()
        r_b.text = body
        r_b.font.name = "Arial"
        r_b.font.size = Pt(10)
        r_b.font.color.rgb = TEXT_MUTED

    # Bottom Metric Bar
    bb8 = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.45), Inches(11.73), Inches(1.45))
    bb8.fill.solid()
    bb8.fill.fore_color.rgb = RGBColor(16, 28, 54)
    bb8.line.color.rgb = ACCENT_EMERALD
    bb8.line.width = Pt(1)
    tf_bb8 = bb8.text_frame
    tf_bb8.word_wrap = True
    tf_bb8.margin_left = tf_bb8.margin_right = Inches(0.3)
    p = tf_bb8.paragraphs[0]
    r = p.add_run()
    r.text = "HOW WE MEASURE REAL CLINICAL IMPACT (NOT JUST CLICKS):\n"
    r.font.name = "Arial"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = ACCENT_EMERALD

    p2 = tf_bb8.add_paragraph()
    r2 = p2.add_run()
    r2.text = "1. Clinical ROM Gain: Mean joint degree improvement over 14 days (e.g. Frozen Shoulder 48° → 92° validated via JSON telemetry)\n2. Form Error Reduction: >65% drop in flagged compensatory drift frames within 7 sessions\n3. Adherence Elevation: Lifting home rehab adherence from 30% clinic baseline to >85% via real-time audio coaching"
    r2.font.name = "Arial"
    r2.font.size = Pt(10)
    r2.font.color.rgb = TEXT_WHITE

    # ==========================================================
    # SLIDE 9: RESPONSIBLE AI GUARDRAILS & 90S LIVE DEMO
    # ==========================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "Safety Guardrails & Demo Script", "Responsible AI Guardrails, Privacy & Rehearsed 90s Live Demo", "09 / 09")

    # Left: Responsible AI Guardrails
    guard_box = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.2))
    guard_box.fill.solid()
    guard_box.fill.fore_color.rgb = CARD_BG
    guard_box.line.color.rgb = ACCENT_CYAN
    guard_box.line.width = Pt(1.5)

    tf_g = guard_box.text_frame
    tf_g.word_wrap = True
    tf_g.margin_left = tf_g.margin_right = Inches(0.25)
    p = tf_g.paragraphs[0]
    r = p.add_run()
    r.text = "STRICT COMPLIANCE WITH TRACK 6 RULES"
    r.font.name = "Arial"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = ACCENT_CYAN

    rules = [
        ("Assists—Never Replaces—Doctors", "All outputs carry explicit disclaimers: PhysioPulse AI is an educational & biomechanical feedback assistant, never a definitive diagnostic authority."),
        ("100% Local On-Device Video Privacy", "All 33-point pose landmarking runs in local RAM on device. Zero raw patient camera frames ever leave the computer or enter the cloud."),
        ("Emergency Red-Flag Safety Lock", "If a patient indicates acute pain (VAS ≥ 8/10) or trauma history, the system locks unguided exercise generation and shows emergency hospital contact info."),
        ("Synthetic Patient Data Guardrails", "All demo profiles, MRI scans, and telemetry progression trajectories use 100% anonymized, synthetic medical records."),
        ("Hands-Free & Non-Technical Accessibility", "One-click preset cards and natural voice prompts enable elderly patients to complete their routine without touching the mouse or keyboard.")
    ]

    for title, desc in rules:
        p_t = tf_g.add_paragraph()
        p_t.space_before = Pt(8)
        r_t = p_t.add_run()
        r_t.text = f"• {title}: "
        r_t.font.name = "Arial"
        r_t.font.size = Pt(10)
        r_t.font.bold = True
        r_t.font.color.rgb = TEXT_WHITE

        r_d = p_t.add_run()
        r_d.text = desc
        r_d.font.name = "Arial"
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = TEXT_MUTED

    # Right: Rehearsed 90s Live Demo Roadmap
    demo_box = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2))
    demo_box.fill.solid()
    demo_box.fill.fore_color.rgb = CARD_BG
    demo_box.line.color.rgb = ACCENT_AMBER
    demo_box.line.width = Pt(1.5)

    tf_d = demo_box.text_frame
    tf_d.word_wrap = True
    tf_d.margin_left = tf_d.margin_right = Inches(0.25)
    p = tf_d.paragraphs[0]
    r = p.add_run()
    r.text = "REHEARSED 90-SECOND STAGE DEMONSTRATION"
    r.font.name = "Arial"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = ACCENT_AMBER

    demo_steps = [
        ("Step 1: Doctor Report Upload & AI Auto-Plan (15s)", "Upload hospital discharge summary / MRI report (or click sample report) → AI simplifies medical jargon, extracts restrictions, and auto-plans the tailored session queue."),
        ("Step 2: Auto-Synthesize Kinetic Queue (15s)", "Click 'Synthesize Prescription Queue' → Clinical AI Agent maps symptoms to P1, P5, P3, P4 with target ROM & rep counts in prescribed_session.json."),
        ("Step 3: Launch 60 FPS Local Vision Engine (20s)", "Click 'Launch Vision Session' → Camera opens, announces Protocol 1 via voice coach, and displays live shoulder abduction angle in green."),
        ("Step 4: Trigger Live Compensatory Error (20s)", "Intentionally shrug shoulder or tilt neck → Skeletal vector turns RED instantly on screen while Voice Coach commands: 'Don't shrug your shoulder!'"),
        ("Step 5: Auto-Advance & Doctor PDF Report (20s)", "Complete target reps → Engine auto-advances to next protocol, writes clinical_session_report.json, and renders official printable Doctor Letterhead with CPT codes.")
    ]

    for title, desc in demo_steps:
        p_t = tf_d.add_paragraph()
        p_t.space_before = Pt(8)
        r_t = p_t.add_run()
        r_t.text = f"{title}\n"
        r_t.font.name = "Arial"
        r_t.font.size = Pt(10)
        r_t.font.bold = True
        r_t.font.color.rgb = ACCENT_AMBER

        r_d = p_t.add_run()
        r_d.text = desc
        r_d.font.name = "Arial"
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = TEXT_MUTED

    # Save
    output_filename = "PhysioPulse_AI_Pitch_Deck_10_out_of_10.pptx"
    prs.save(output_filename)
    print(f"Presentation successfully created: {output_filename}")

if __name__ == "__main__":
    create_deck()
