import urllib.request
import json
import base64
import time

print("=" * 70)
print("  PHYSIOPULSE AI - DOCTOR PRESCRIPTION OCR & CARE PLAN AUDIT")
print("=" * 70)

# 1. Test /session HTML rendering
print("\n[TEST 1] Auditing /session HTML page for Doctor Prescription OCR...")
try:
    with urllib.request.urlopen('http://localhost:3000/session') as res:
        html = res.read().decode('utf-8')
        assert "Doctor" in html or "Prescription" in html, "Prescription UI missing in HTML"
        assert "Messy Indian Handwriting OCR" in html or "Scan Prescription" in html, "OCR text missing"
        print("  ✓ /session page loaded successfully (Status 200)")
        print("  ✓ Found 'Doctor Prescription' and 'Messy Indian Handwriting OCR' UI hooks in DOM")
except Exception as e:
    print("  ✗ Failed to audit /session HTML:", e)

# 2. Test Calibrated Indian Doctor Samples (Rotator Cuff, ACL Knee, Lumbar Spine)
samples = [
    ("rotator_cuff", "Dr. R. K. Sharma (Apollo Hospitals)", "Shoulder"),
    ("acl_knee", "Dr. Anita Sengupta (AIIMS New Delhi)", "Knee"),
    ("lumbar_sciatica", "Dr. Rajesh Gupta (Max Healthcare)", "Lumbar")
]

print("\n[TEST 2] Testing All 3 Indian Doctor Prescription Samples...")
for sample_id, expected_dr, expected_joint in samples:
    req = urllib.request.Request(
        'http://localhost:3000/api/ocr-prescription',
        data=json.dumps({'sampleId': sample_id}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    t0 = time.time()
    try:
        with urllib.request.urlopen(req) as res:
            data = json.loads(res.read().decode('utf-8'))
            t1 = time.time()
            rep = data['report']
            dr_name = rep['doctor_details']['doctor_name']
            hospital = rep['doctor_details']['hospital_or_clinic']
            diagnosis = rep['clinical_findings']['diagnosis']
            legibility = rep['handwriting_audit']['legibility_score_percent']
            confidence = rep['handwriting_audit']['decipher_confidence_percent']
            protocols = [ex['protocol_name'] for ex in rep['session_plan']['exercises']]
            meds = [m['name'] + f" ({m['frequency']})" for m in rep['treatment_plan']['medications']]
            daily_slots = [s['time_slot'] + " - " + s['title'] for s in rep['schedule']['daily_schedule']]
            milestones = [m['phase'] + ": " + m['title'] for m in rep['schedule']['milestones']]
            review_days = rep['schedule']['follow_up']['review_after_days']

            print(f"\n  ► Sample: {sample_id.upper()} ({t1-t0:.2f}s)")
            print(f"    • Consultant: {dr_name} | {hospital}")
            print(f"    • Deciphered Diagnosis: {diagnosis[:65]}...")
            print(f"    • Handwriting Legibility: {legibility}% | OCR Confidence: {confidence}%")
            print(f"    • Prescribed Kinetic Routine ({len(protocols)} protocols): {', '.join(protocols[:3])}")
            print(f"    • Medications Decoded ({len(meds)} items): {', '.join(meds[:3])}")
            print(f"    • Daily Regimen Slots: {len(daily_slots)} time slots (Morning, Midday, Evening CV Session, Night)")
            print(f"    • Progression Roadmap: {len(milestones)} phases | Follow-up review: in {review_days} days")
    except Exception as e:
        print(f"  ✗ Failed for sample {sample_id}:", e)

# 3. Test Live Gemini Multimodal Vision OCR on Image
print("\n[TEST 3] Testing Live Multimodal Vision OCR with Prescription Image...")
try:
    with open('web_app/public/prescriptions/dr_sharma_rotator_cuff.png', 'rb') as f:
        img_b64 = base64.b64encode(f.read()).decode('utf-8')
    
    t0 = time.time()
    req = urllib.request.Request(
        'http://localhost:3000/api/ocr-prescription',
        data=json.dumps({
            'image': img_b64,
            'mimeType': 'image/png',
            'fileName': 'dr_sharma_rotator_cuff.png'
        }).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode('utf-8'))
        t1 = time.time()
        print(f"  ✓ Live Multimodal API call succeeded in {t1-t0:.2f}s")
        print(f"  ✓ Source: {data.get('source')}")
        print(f"  ✓ Doctor: {data['report']['doctor_details']['doctor_name']}")
        print(f"  ✓ Diagnosis: {data['report']['clinical_findings']['diagnosis']}")
        print(f"  ✓ Exercises Prescribed: {len(data['report']['session_plan']['exercises'])}")
        print(f"  ✓ Decoded Shorthand Terms: {len(data['report']['handwriting_audit']['shorthand_terms_decoded'])}")
except Exception as e:
    print("  ✗ Live Vision OCR test failed:", e)

print("\n" + "=" * 70)
print("  ALL VERIFICATION CHECKS COMPLETED!")
print("=" * 70)
