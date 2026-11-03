import urllib.request
import json

# 1. Verify HTML theme on /session
url = 'http://localhost:3000/session'
req = urllib.request.urlopen(url)
html = req.read().decode('utf-8')

print("=== 1. HTML THEME AUDIT (/session) ===")
print("Status code:", req.getcode())
print("HTML length:", len(html))
print("Has 'dark' in <html class=...:", 'dark' in html[:html.find('</head>')])
print("Has pure dark zinc '#09090b':", '#09090b' in html)
print("Has old light slate '#EFF2F6':", '#EFF2F6' in html)
print("Has 'PHYSIOPULSE AI':", 'PHYSIOPULSE' in html)
print("Has 'Rehabilitation Circuit Depth':", 'Rehabilitation Circuit Depth' in html)

# 2. Test AI Triage & Prescription for Multi-Exercise Kinetic Chains
print("\n=== 2. AI TRIAGE & PRESCRIPTION ENGINE TEST ===")
test_cases = [
    {
        "name": "Sarah Jenkins",
        "age": 34,
        "affectedArea": "Shoulder & Glenohumeral Joint",
        "painLevel": 6,
        "symptoms": "Rotator cuff tendonitis and neck tightness after long work days.",
        "circuitMode": "standard"
    },
    {
        "name": "Marcus Vance",
        "age": 28,
        "affectedArea": "Knee & Tibiofemoral Joint",
        "painLevel": 5,
        "symptoms": "Post-ACL reconstruction 6 months ago. Knee feels unsteady on squats.",
        "circuitMode": "standard"
    },
    {
        "name": "David Miller",
        "age": 42,
        "affectedArea": "Wrist & Carpal Tunnel",
        "painLevel": 4,
        "symptoms": "Carpal tunnel tingling in thumb and index finger from intense keyboard typing.",
        "circuitMode": "comprehensive"
    }
]

for tc in test_cases:
    post_data = json.dumps(tc).encode('utf-8')
    api_req = urllib.request.Request(
        'http://localhost:3000/api/prescribe-session',
        data=post_data,
        headers={'Content-Type': 'application/json'}
    )
    api_resp = urllib.request.urlopen(api_req)
    result = json.loads(api_resp.read().decode('utf-8'))
    
    print(f"\nTest: {tc['affectedArea']} ({tc['circuitMode']} mode)")
    print(f"Source: {result.get('source')}")
    exercises = result.get('prescription', {}).get('exercises', [])
    print(f"Total Prescribed Exercises: {len(exercises)}")
    for i, ex in enumerate(exercises, 1):
        print(f"  {i}. [P{ex['protocol_id']}] {ex['protocol_name']} ({ex['target_reps']} reps, {ex['target_rom_degrees']} deg)")
