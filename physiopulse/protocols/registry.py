MODE_NAMES = {
    1: "P1: Frozen Shoulder Abduction (Seated/Standing)",
    2: "P2: Post-ACL Knee Extension & Squat (Full Body)",
    3: "P3: Cervical & Ergonomic Posture Guard (Seated)",
    4: "P4: Post-Fracture Elbow Flexion Rehab (Seated)",
    5: "P5: Bilateral Overhead Wall-Slide Sync (Dual Arm)",
    6: "P6: Total Hip Replacement Side Abduction (Standing)",
    7: "P7: Lumbar Spine Flexion / Slip-Disc Rehab (Torso)",
    8: "P8: Carpal Tunnel Wrist & Forearm Extension (Seated)"
}

PROTOCOL_GUIDE = {
    1: {
        "title": "Frozen Shoulder Lateral Abduction",
        "short_name": "Shoulder Abduction",
        "joint": "Glenohumeral Joint (Shoulder)",
        "setup": "Stand or sit upright facing the camera, arm resting at your side.",
        "action": "Slowly raise your arm out to the side until parallel to floor (90°).",
        "avoid": "Keep shoulders relaxed down. Do not shrug shoulder or tilt torso sideways.",
        "camera_view": "Front View (Works Seated or Standing)"
    },
    2: {
        "title": "Post-ACL Knee Extension & Controlled Squat",
        "short_name": "Knee Squat & Extension",
        "joint": "Tibiofemoral & Patellofemoral (Knee)",
        "setup": "Stand with feet shoulder-width apart, full body in camera frame.",
        "action": "Hinge hips back and bend knees down to 90° into a controlled squat.",
        "avoid": "Keep knees tracking over toes. Do not lean chest excessively forward.",
        "camera_view": "Full Body Front/Oblique View"
    },
    3: {
        "title": "Cervical & Ergonomic Posture Retraction Guard",
        "short_name": "Cervical Posture Guard",
        "joint": "Craniovertebral & Neck Spine",
        "setup": "Sit tall facing camera, relax shoulders down away from ears.",
        "action": "Gently glide chin straight backwards and hold ergonomic alignment for 5 sec.",
        "avoid": "Do not tilt head down or sideways. Keep eye gaze horizontal.",
        "camera_view": "Upper Body Seated View"
    },
    4: {
        "title": "Post-Fracture Elbow Flexion Rehabilitation",
        "short_name": "Elbow Flexion Curl",
        "joint": "Humeroulnar Joint (Elbow)",
        "setup": "Sit or stand with upper arm pinned lightly against side of ribcage.",
        "action": "Bend elbow smoothly, curling palm upward toward shoulder (125°+).",
        "avoid": "Keep upper arm pinned. Do not swing elbow forward or flare outward.",
        "camera_view": "Front / Seated View"
    },
    5: {
        "title": "Bilateral Overhead Wall-Slide Sync",
        "short_name": "Overhead Wall Slide",
        "joint": "Scapulothoracic & Serratus Anterior",
        "setup": "Sit or stand tall with both elbows visible in camera frame.",
        "action": "Slide both arms upwards simultaneously into high 'V' pattern (120°+).",
        "avoid": "Keep arms symmetrical. Do not lift one arm faster than the other.",
        "camera_view": "Front View (Both Arms)"
    },
    6: {
        "title": "Total Hip Replacement Lateral Side Abduction",
        "short_name": "Hip Side Abduction",
        "joint": "Coxofemoral & Gluteus Medius (Hip)",
        "setup": "Stand upright with support if needed, feet pointing straight forward.",
        "action": "Keeping leg straight, smoothly raise leg out to side to 28°-35°.",
        "avoid": "Keep torso strictly vertical. Do not lean upper body sideways.",
        "camera_view": "Full Body Front View"
    },
    7: {
        "title": "Lumbar Spine Flexion & Hip Hinge Rehab",
        "short_name": "Lumbar Hip Hinge",
        "joint": "Lumbopelvic Rhythm & Spine",
        "setup": "Stand with shoulders and hips visible in camera frame.",
        "action": "Hinge forward from hips, keeping spine long and flat (25°-35°).",
        "avoid": "Keep shoulders level. Do not twist spine while hinging.",
        "camera_view": "Upper/Full Body View"
    },
    8: {
        "title": "Carpal Tunnel Wrist & Forearm Extension",
        "short_name": "Wrist & Nerve Glide",
        "joint": "Radiocarpal Joint (Wrist)",
        "setup": "Sit with forearm raised clearly in camera view.",
        "action": "Slowly flex and extend wrist upward toward ceiling (22°+).",
        "avoid": "Keep shoulders relaxed. Do not shrug shoulder to lift hand.",
        "camera_view": "Seated Forearm/Wrist View"
    }
}

REQ_LANDMARKS = {
    1: [11, 12, 13, 14],
    2: [23, 24, 25, 26, 27, 28],
    3: [0, 7, 8, 11, 12],
    4: [11, 12, 13, 14, 15, 16],
    5: [11, 12, 13, 14],
    6: [23, 24, 25, 26, 27, 28],
    7: [11, 12, 23, 24],
    8: [13, 14, 15, 16, 19, 20]
}
