import os
from PIL import Image, ImageDraw, ImageFont

def generate_prescription(filename, data):
    width, height = 900, 1250
    # Creamy medical prescription paper with subtle paper texture
    img = Image.new('RGB', (width, height), color=(253, 252, 248))
    draw = ImageDraw.Draw(img)

    # Fonts
    font_header = ImageFont.truetype('C:\\Windows\\Fonts\\arialbd.ttf', 26)
    font_sub = ImageFont.truetype('C:\\Windows\\Fonts\\arial.ttf', 13)
    font_bold = ImageFont.truetype('C:\\Windows\\Fonts\\arialbd.ttf', 14)
    font_rx = ImageFont.truetype('C:\\Windows\\Fonts\\timesbd.ttf', 36)
    
    # Doctor handwriting fonts (Ink Free and Segoe Print)
    try:
        font_hand = ImageFont.truetype('C:\\Windows\\Fonts\\Inkfree.ttf', 20)
        font_hand_sm = ImageFont.truetype('C:\\Windows\\Fonts\\Inkfree.ttf', 17)
        font_sig = ImageFont.truetype('C:\\Windows\\Fonts\\MISTRAL.TTF', 34)
    except Exception:
        font_hand = ImageFont.truetype('C:\\Windows\\Fonts\\segoepr.ttf', 18)
        font_hand_sm = ImageFont.truetype('C:\\Windows\\Fonts\\segoepr.ttf', 15)
        font_sig = ImageFont.truetype('C:\\Windows\\Fonts\\segoeprb.ttf', 26)

    # 1. Hospital Header Banner
    header_color = data['header_color']
    draw.rectangle([0, 0, width, 140], fill=header_color)
    
    # Hospital Name & Details
    draw.text((40, 22), data['hospital_name'], fill=(255, 255, 255), font=font_header)
    draw.text((40, 60), data['dept_name'], fill=(220, 240, 255), font=font_sub)
    draw.text((40, 80), data['address_phone'], fill=(190, 220, 245), font=font_sub)
    draw.text((40, 102), f"NABH & JCI ACCREDITED | OPD CONSULTATION SLIP | ROOM: {data['room']}", fill=(255, 230, 150), font=font_sub)

    # Doctor credentials on top right
    dr_x = 510
    draw.text((dr_x, 24), data['doctor_name'], fill=(255, 255, 255), font=ImageFont.truetype('C:\\Windows\\Fonts\\arialbd.ttf', 17))
    draw.text((dr_x, 48), data['qualifications'], fill=(225, 240, 255), font=font_sub)
    draw.text((dr_x, 68), data['designation'], fill=(200, 225, 250), font=font_sub)
    draw.text((dr_x, 88), f"Reg. No: {data['reg_no']}", fill=(255, 235, 170), font=font_sub)
    draw.text((dr_x, 106), f"Contact: {data['dr_phone']}", fill=(200, 225, 250), font=font_sub)

    # 2. Patient Meta Box
    draw.rectangle([30, 155, width - 30, 215], fill=(245, 247, 250), outline=(210, 220, 230), width=1)
    meta_y = 165
    draw.text((45, meta_y), f"Patient Name: {data['patient_name']}", fill=(30, 41, 59), font=font_bold)
    draw.text((400, meta_y), f"Age/Gender: {data['patient_age_sex']}", fill=(51, 65, 85), font=font_sub)
    draw.text((620, meta_y), f"Date: {data['date']}", fill=(51, 65, 85), font=font_bold)

    draw.text((45, meta_y + 24), f"UHID / OPD: {data['uhid']}", fill=(71, 85, 105), font=font_sub)
    draw.text((250, meta_y + 24), f"Weight: {data['weight']}", fill=(71, 85, 105), font=font_sub)
    draw.text((400, meta_y + 24), f"BP: {data['bp']}", fill=(71, 85, 105), font=font_sub)
    draw.text((550, meta_y + 24), f"Pulse: {data['pulse']}", fill=(71, 85, 105), font=font_sub)
    draw.text((680, meta_y + 24), f"SpO2: 99%", fill=(71, 85, 105), font=font_sub)

    # 3. Faint clinical ruling lines on prescription notepad
    line_color = (235, 238, 242)
    for y in range(250, 1100, 36):
        draw.line([(40, y), (width - 40, y)], fill=line_color, width=1)

    # 4. Rx Symbol
    draw.text((45, 228), "℞", fill=(180, 40, 40), font=font_rx)

    # 5. Doctor's Cursive Handwritten Prescription Content (Doctor Ink: Deep Blue Ballpoint)
    ink_color = (18, 48, 100) # Authentic Indian doctor blue ink
    curr_y = 280

    for item in data['handwritten_lines']:
        text = item['text']
        indent = item.get('indent', 45)
        is_bold_note = item.get('bold', False)
        font = font_hand if not is_bold_note else font_hand
        
        draw.text((indent, curr_y), text, fill=ink_color, font=font)
        curr_y += item.get('spacing', 34)

    # 6. Doctor's Stamp and Cursive Signature
    stamp_x, stamp_y = 540, 1030
    # Signature
    draw.text((stamp_x + 30, stamp_y - 45), data['signature_text'], fill=(10, 35, 85), font=font_sig)

    # Stamp box (Oval or Rectangular clinic seal in purple/blue ink)
    stamp_purple = (75, 40, 130)
    draw.rounded_rectangle([stamp_x, stamp_y, stamp_x + 300, stamp_y + 90], radius=8, outline=stamp_purple, width=2)
    draw.text((stamp_x + 18, stamp_y + 12), data['stamp_line1'], fill=stamp_purple, font=font_bold)
    draw.text((stamp_x + 18, stamp_y + 34), data['stamp_line2'], fill=stamp_purple, font=font_sub)
    draw.text((stamp_x + 18, stamp_y + 54), data['stamp_line3'], fill=stamp_purple, font=font_sub)
    draw.text((stamp_x + 18, stamp_y + 70), "APOLLO HEALTH CLINIC · VERIFIED", fill=stamp_purple, font=ImageFont.truetype('C:\\Windows\\Fonts\\arial.ttf', 10))

    # 7. Bottom Emergency & Safe Warning Footer
    draw.rectangle([0, height - 45, width, height], fill=(240, 243, 246))
    draw.text((40, height - 32), "⚠️ IMPORTANT: Follow prescribed physical therapy & dosage strictly. In case of acute pain or allergic reaction, visit OPD or call hospital emergency 1066.", fill=(100, 116, 139), font=ImageFont.truetype('C:\\Windows\\Fonts\\arial.ttf', 11))

    # Save PNG
    out_path = os.path.join('web_app', 'public', 'prescriptions', filename)
    img.save(out_path, quality=95)
    print(f"Generated prescription: {out_path} ({os.path.getsize(out_path)} bytes)")

# Sample 1: Rotator Cuff & Cervical Spondylosis
data_rotator = {
    'hospital_name': 'APOLLO HOSPITALS · NEW DELHI',
    'dept_name': 'DEPARTMENT OF ORTHOPAEDICS, ARTHROSCOPY & SPORTS MEDICINE',
    'address_phone': 'Sarita Vihar, Delhi Mathura Road, New Delhi - 110076 | Ph: +91-11-26925858',
    'room': 'OPD-204 (Tower B)',
    'header_color': (14, 116, 144), # Apollo Cyan/Teal
    'doctor_name': 'Dr. R. K. Sharma, MS (Ortho)',
    'qualifications': 'MBBS, MS (Ortho - AIIMS), MCh Ortho (Dundee)',
    'designation': 'Senior Consultant - Shoulder & Sports Injuries',
    'reg_no': 'DMC/R/14298',
    'dr_phone': '+91 98101 23456',
    'patient_name': 'Sarah Jenkins (Mrs.)',
    'patient_age_sex': '38 Yrs / Female',
    'date': '27/10/2026',
    'uhid': 'APO-2026-98124',
    'weight': '62 Kg',
    'bp': '122/80 mmHg',
    'pulse': '74 bpm',
    'signature_text': 'Dr. R. K. Sharma',
    'stamp_line1': 'DR. R. K. SHARMA, MS (ORTHO)',
    'stamp_line2': 'Reg. No. DMC/14298 · Apollo Hospitals',
    'stamp_line3': 'Shoulder & Sports Medicine Unit',
    'handwritten_lines': [
        {'text': "C/o: Severe Rt shoulder pain & guarded abduction x 6 wks.", 'indent': 50, 'spacing': 32},
        {'text': "     Difficulty lifting arm above 80°, combing hair, reaching behind back.", 'indent': 50, 'spacing': 30},
        {'text': "     Associated chronic neck stiffness (desk worker, 9 hrs daily laptop).", 'indent': 50, 'spacing': 34},
        {'text': "O/E: Supraspinatus tendon insertion point tenderness (+).", 'indent': 50, 'spacing': 32},
        {'text': "     Hawkins-Kennedy & Neer's impingement test: strongly +ve.", 'indent': 50, 'spacing': 32},
        {'text': "     Painful Arc between 60° - 110°. Cervical trapezius spasm (+).", 'indent': 50, 'spacing': 34},
        {'text': "Inv: MRI Rt Shoulder: Partial bursal tear supraspinatus + subacromial bursitis.", 'indent': 50, 'spacing': 32},
        {'text': "Dx:  Subacromial Impingement / Frozen Shoulder (Phase II)", 'indent': 50, 'spacing': 30, 'bold': True},
        {'text': "     + Cervical Spondylosis (Postural Trapezius Myofascial Strain).", 'indent': 50, 'spacing': 38},
        {'text': "Rx (Medications):", 'indent': 50, 'spacing': 30},
        {'text': "  1. Tab Zerodol-SP (Aceclofenac + PCM + Serratiopeptidase) - 1 tab BD pc x 5d", 'indent': 60, 'spacing': 32},
        {'text': "  2. Cap Pan-D (Pantoprazole + Domperidone) - 1 cap OD BBF (empty stom) x 5d", 'indent': 60, 'spacing': 32},
        {'text': "  3. Tab Myoril 4mg (Thiocolchicoside) - 1 tab HS (bedtime) x 5d", 'indent': 60, 'spacing': 32},
        {'text': "  4. Tab Shelcal 500 (Calcium + Vit D3) - 1 tab OD pc x 30d", 'indent': 60, 'spacing': 32},
        {'text': "  5. Omnigel / Volini ointment - Gentle local application TDS (No hard rubbing).", 'indent': 60, 'spacing': 36},
        {'text': "Physiotherapy & Directives (PhysioPulse AI):", 'indent': 50, 'spacing': 30},
        {'text': "  * Active Kinetic Circuit: Protocol 1 (Shoulder Abduction) + Protocol 3 (Cervical Guard)", 'indent': 60, 'spacing': 30},
        {'text': "    + Protocol 5 (Bilateral Overhead Wall-Slide Sync). Target ROM: 90° initially.", 'indent': 60, 'spacing': 32},
        {'text': "  * Hot water fomentation (garam paani sikaai) 15-20 min BD before exercises.", 'indent': 60, 'spacing': 32},
        {'text': "  * STRICT AVOIDANCE of sudden overhead jerky motions or lifting heavy grocery bags.", 'indent': 60, 'spacing': 32},
        {'text': "  * Review after (R/A) 10 days with PhysioPulse AI Compliance Report.", 'indent': 60, 'spacing': 36},
    ]
}

# Sample 2: ACL Reconstruction & Knee OA
data_knee = {
    'hospital_name': 'ALL INDIA INSTITUTE OF MEDICAL SCIENCES (AIIMS)',
    'dept_name': 'JAI PRAKASH NARAYAN APEX TRAUMA CENTRE & ORTHOPAEDICS',
    'address_phone': 'Ansari Nagar East, New Delhi - 110029 | OPD Complex Counter #12',
    'room': 'Knee & Arthroplasty OPD',
    'header_color': (21, 128, 61), # Emerald / Green
    'doctor_name': 'Dr. Anita Sengupta, MS, DNB',
    'qualifications': 'MBBS, MS (Ortho - AIIMS), Fellowship Sports Knee (Innsbruck)',
    'designation': 'Additional Professor - Knee & Ligament Reconstruction',
    'reg_no': 'MCI-18492-DEL',
    'dr_phone': '+91 98112 34567',
    'patient_name': 'Marcus Vance / Rajesh V.',
    'patient_age_sex': '29 Yrs / Male',
    'date': '27/10/2026',
    'uhid': 'AIIMS-ORTHO-44910',
    'weight': '74 Kg',
    'bp': '128/84 mmHg',
    'pulse': '78 bpm',
    'signature_text': 'Dr. Anita Sengupta',
    'stamp_line1': 'DR. ANITA SENGUPTA, MS (ORTHO), DNB',
    'stamp_line2': 'Reg. No. MCI-18492 · AIIMS New Delhi',
    'stamp_line3': 'Knee & Ligament Reconstruction Unit',
    'handwritten_lines': [
        {'text': "C/o: Left knee giving way sensation, instability when stepping down stairs.", 'indent': 50, 'spacing': 32},
        {'text': "     Post twisting injury playing football 8 wks back. Joint line swelling (+).", 'indent': 50, 'spacing': 34},
        {'text': "O/E: Lachman test +ve (Grade II laxity with soft endpoint).", 'indent': 50, 'spacing': 32},
        {'text': "     Anterior Drawer +ve. Joint effusion mild-moderate.", 'indent': 50, 'spacing': 32},
        {'text': "     VMO (Vastus Medialis) atrophy ~1.5 cm compared to right thigh.", 'indent': 50, 'spacing': 34},
        {'text': "Inv: MRI Left Knee: High grade partial ACL tear + medial meniscus tear (posterior horn).", 'indent': 50, 'spacing': 34},
        {'text': "Dx:  Left Knee ACL Insufficiency + Patellofemoral Instability.", 'indent': 50, 'spacing': 38, 'bold': True},
        {'text': "Rx (Medications):", 'indent': 50, 'spacing': 30},
        {'text': "  1. Tab Chymoral Forte (Trypsin-Chymotrypsin) - 1 tab TDS ac (30 min before food) x 6d", 'indent': 60, 'spacing': 32},
        {'text': "  2. Tab Dolo 650 (Paracetamol) - 1 tab SOS (only if acute pain, max BD)", 'indent': 60, 'spacing': 32},
        {'text': "  3. Tab Jointace DN (Glucosamine + Diacerein) - 1 tab OD pc x 30d", 'indent': 60, 'spacing': 32},
        {'text': "  4. Cap Pantocid 40 (Pantoprazole) - 1 tab OD BBF x 6d", 'indent': 60, 'spacing': 36},
        {'text': "Physiotherapy & Indian Lifestyle Directives:", 'indent': 50, 'spacing': 30},
        {'text': "  * PhysioPulse AI: Protocol 2 (Post-ACL Knee Extension & Squat) + Protocol 6 (Hip Abduction)", 'indent': 60, 'spacing': 30},
        {'text': "    + Protocol 7 (Lumbar Core Anchor) to recruit kinetic chain gluteus medius.", 'indent': 60, 'spacing': 32},
        {'text': "  * STRICTLY AVOID Indian toilet / deep squatting. Use Western commode only.", 'indent': 60, 'spacing': 32},
        {'text': "  * NO sitting on floor or cross-legged (alti-palthi na maarein).", 'indent': 60, 'spacing': 32},
        {'text': "  * Use hinged knee brace while commuting. Ice packs 15 mins post-exercise.", 'indent': 60, 'spacing': 32},
        {'text': "  * Review after (R/A) 14 days in Knee Clinic with PhysioPulse symmetry stats.", 'indent': 60, 'spacing': 36},
    ]
}

# Sample 3: Lumbar Spine L4-L5 Slip Disc / Sciatica
data_spine = {
    'hospital_name': 'MAX SUPER SPECIALITY HOSPITAL · GURUGRAM',
    'dept_name': 'MAX INSTITUTE OF MUSCULOSKELETAL SCIENCES & SPINE CARE',
    'address_phone': 'B-Block, Sushant Lok 1, Gurugram, Haryana - 122001 | Ph: 0124-6623000',
    'room': 'Spine Care OPD #118',
    'header_color': (67, 56, 202), # Indigo / Spine
    'doctor_name': 'Dr. Rajesh Gupta, MCh (Spine)',
    'qualifications': 'MBBS, MS (Ortho), MCh (Spine Surgery - UK), AO Spine Fellow',
    'designation': 'Director & Head - Minimally Invasive Spine Surgery',
    'reg_no': 'HN-MED-3184',
    'dr_phone': '+91 98188 98765',
    'patient_name': 'David Miller / Amit Kulkarni',
    'patient_age_sex': '44 Yrs / Male',
    'date': '27/10/2026',
    'uhid': 'MAX-SPINE-77219',
    'weight': '78 Kg',
    'bp': '132/86 mmHg',
    'pulse': '72 bpm',
    'signature_text': 'Dr. Rajesh Gupta',
    'stamp_line1': 'DR. RAJESH GUPTA, MCh (SPINE)',
    'stamp_line2': 'Reg. No. HN-MED-3184 · Max Healthcare',
    'stamp_line3': 'Head, Spine & Neuro-Ortho Centre',
    'handwritten_lines': [
        {'text': "C/o: Severe Low Back Ache (LBA) radiating down right buttock to lateral calf.", 'indent': 50, 'spacing': 32},
        {'text': "     Pins & needles / tingling sensation in right foot thumb x 3 wks.", 'indent': 50, 'spacing': 30},
        {'text': "     Severe aggravation on prolonged sitting in car commute & forward bending.", 'indent': 50, 'spacing': 34},
        {'text': "O/E: Straight Leg Raise (SLR) +ve on Right at 40° with radicular shooting pain.", 'indent': 50, 'spacing': 32},
        {'text': "     L4-L5 lumbar paraspinal muscle spasm severe; loss of lumbar lordosis.", 'indent': 50, 'spacing': 32},
        {'text': "     Right EHL (Extensor Hallucis Longus) power 4/5. Ankle jerk sluggish.", 'indent': 50, 'spacing': 34},
        {'text': "Inv: MRI L-S Spine: L4-L5 posterior paracentral disc protrusion with right traversing", 'indent': 50, 'spacing': 30},
        {'text': "     L5 nerve root compression & thecal sac indentation.", 'indent': 50, 'spacing': 34},
        {'text': "Dx:  L4-L5 PIVD (Slip Disc) with Right Sciatica & Lumbar Radiculopathy.", 'indent': 50, 'spacing': 38, 'bold': True},
        {'text': "Rx (Medications):", 'indent': 50, 'spacing': 30},
        {'text': "  1. Tab Maxmala 75 (Pregabalin 75mg + Methylcobalamin) - 1 cap HS x 14d", 'indent': 60, 'spacing': 32},
        {'text': "  2. Tab Tolperitas 150 (Tolperisone - muscle relaxant) - 1 tab BD pc x 7d", 'indent': 60, 'spacing': 32},
        {'text': "  3. Tab Defcort 6 (Deflazacort) - 1 tab BD pc x 4d, then 1 tab OD x 3d, then stop", 'indent': 60, 'spacing': 32},
        {'text': "  4. Tab Pantocid-DSR - 1 cap OD BBF (empty stomach) x 10d", 'indent': 60, 'spacing': 32},
        {'text': "  5. Dynapar QPS spray - Spray over lower back TDS, let dry without rubbing.", 'indent': 60, 'spacing': 36},
        {'text': "Strict Spine Precautions & Physio (PhysioPulse AI):", 'indent': 50, 'spacing': 30},
        {'text': "  * Prescribed: Protocol 7 (Lumbar Spine Flexion & Core) + Protocol 6 (Hip Abduction)", 'indent': 60, 'spacing': 30},
        {'text': "    + Protocol 3 (Cervical Posture Guard). Avoid all spinal axial twisting.", 'indent': 60, 'spacing': 32},
        {'text': "  * STRICT AVOIDANCE OF FORWARD BENDING (jhukna bilkul mana hai). No lifting > 2 kg.", 'indent': 60, 'spacing': 32},
        {'text': "  * Wear Lumbo-sacral (LS) belt during travel / car / two-wheeler commute.", 'indent': 60, 'spacing': 32},
        {'text': "  * Hard bed / firm orthopedic mattress. Sleep with pillow between knees.", 'indent': 60, 'spacing': 32},
        {'text': "  * Review after (R/A) 10 days with PhysioPulse range of motion telemetry.", 'indent': 60, 'spacing': 36},
    ]
}

generate_prescription('dr_sharma_rotator_cuff.png', data_rotator)
generate_prescription('dr_sengupta_acl_knee.png', data_knee)
generate_prescription('dr_gupta_lumbar_spine.png', data_spine)
print("All 3 authentic Indian doctor prescription images successfully created!")
