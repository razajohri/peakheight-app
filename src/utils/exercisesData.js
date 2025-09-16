// Exercises dataset (offline-first)

export const CATEGORIES = [
  { id: 'posture', name: 'Posture' },
  { id: 'masai-jump', name: 'Masai Jump' },
  { id: 'upper-body', name: 'Upper Body' },
  { id: 'lower-body', name: 'Lower Body' },
  { id: 'feet-ankles', name: 'Feet & Ankles' },
  { id: 'chest', name: 'Chest' },
  { id: 'neck', name: 'Neck' },
  { id: 'shoulders', name: 'Shoulders' },
  { id: 'pelvic-tilt', name: 'Pelvic Tilt' },
  { id: 'hands', name: 'Hands' },
  { id: 'hamstrings', name: 'Hamstrings' },
  { id: 'stretching', name: 'Stretching' },
  { id: 'strength', name: 'Strength' },
  { id: 'recovery', name: 'Recovery' },
];

// difficulty: 'Beginner' | 'Inter' | 'Advanced'
// impact: 'Low' | 'Medium' | 'High'

export const EXERCISES = [
  {
    id: 'ex-001',
    name: 'Hanging Stretch',
    categoryId: 'stretching',
    durationMin: 3, // 30s + 45s + 60s = 135s = 2.25min, rounded to 3min
    difficulty: 'Beginner',
    impact: 'High',
    icon: 'fitness',
    shortDescription: 'Spinal decompression and shoulder opening.',
    benefits: [
      'Decompresses spine and improves posture',
      'Opens shoulders and lats',
      'Relieves lower back tension',
    ],
    targetMuscles: ['Spine', 'Lats', 'Shoulders'],
    equipment: ['Bar (optional)'],
    steps: [
      'Grip a stable overhead bar with both hands.',
      'Let your body hang, keeping shoulders engaged.',
      'Breathe steadily for 20–30 seconds; repeat 3–5 times.',
    ],
    subExercises: [
      {
        id: 'ex-001-1',
        name: 'Basic Hang',
        duration: 30,
        description: 'Simple hanging with full body weight',
        steps: ['Grip bar with both hands', 'Let body hang naturally', 'Keep shoulders engaged', 'Breathe deeply for 30 seconds']
      },
      {
        id: 'ex-001-2',
        name: 'Active Hang',
        duration: 45,
        description: 'Hanging with shoulder blade activation',
        steps: ['Start in basic hang position', 'Pull shoulder blades down and back', 'Hold for 15 seconds', 'Release and repeat', 'Focus on lat engagement']
      },
      {
        id: 'ex-001-3',
        name: 'Hanging Flow',
        duration: 60,
        description: 'Dynamic hanging with gentle movement',
        steps: ['Begin with basic hang', 'Gently sway side to side', 'Add small leg movements', 'Focus on spinal decompression', 'Breathe rhythmically throughout']
      }
    ]
  },
  {
    id: 'ex-002',
    name: 'Cobra Stretch',
    categoryId: 'stretching',
    durationMin: 3, // 30s + 45s + 60s = 135s = 2.25min, rounded to 3min
    difficulty: 'Beginner',
    impact: 'Medium',
    icon: 'body',
    shortDescription: 'Thoracic extension and hip flexor opener.',
    benefits: ['Promotes spinal extension', 'Opens chest', 'Reduces slouching'],
    targetMuscles: ['Spine extensors', 'Hip flexors', 'Chest'],
    equipment: [],
    steps: [
      'Lie prone, hands under shoulders.',
      'Press chest up, shoulders down and back.',
      'Hold 20–30s; repeat 3–4 times.',
    ],
    subExercises: [
      {
        id: 'ex-002-1',
        name: 'Baby Cobra',
        duration: 30,
        description: 'Gentle spinal extension with minimal arm support',
        steps: ['Lie face down', 'Place hands under shoulders', 'Lift chest slightly off ground', 'Keep elbows close to body', 'Hold for 30 seconds']
      },
      {
        id: 'ex-002-2',
        name: 'Full Cobra',
        duration: 45,
        description: 'Complete spinal extension with full arm support',
        steps: ['Start in baby cobra position', 'Press through hands to lift chest higher', 'Keep shoulders down and back', 'Engage core muscles', 'Hold for 45 seconds']
      },
      {
        id: 'ex-002-3',
        name: 'Dynamic Cobra',
        duration: 60,
        description: 'Flowing cobra with gentle movement',
        steps: ['Begin in baby cobra', 'Flow between baby and full cobra', 'Add gentle side-to-side movement', 'Focus on spinal articulation', 'Breathe deeply throughout']
      }
    ]
  },
  {
    id: 'ex-003',
    name: 'Posture Power',
    categoryId: 'posture',
    durationMin: 3,
    difficulty: 'Beginner',
    impact: 'Medium',
    icon: 'body',
    shortDescription: 'A series of squats and lunge holds designed to strengthen the muscles in your legs, core, and back that are responsible for maintaining good posture.',
    benefits: ['Improved posture', 'Core strength', 'Leg endurance', 'Back support'],
    targetMuscles: ['Legs', 'Core', 'Back'],
    equipment: ['Wall (for Wall Sit)'],
    steps: [
      'Complete all 4 exercises in sequence',
      'Focus on proper form and breathing',
      'Hold each position for the specified duration',
      'Rest 10 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-003-1',
        name: 'Squat Hold',
        duration: 30,
        steps: [
          'Stand with feet shoulder-width apart',
          'Lower into a squat position',
          'Keep your back straight',
          'Hold the position for 30 seconds'
        ]
      },
      {
        id: 'ex-003-2',
        name: 'Split Lunge Hold',
        duration: 60,
        steps: [
          'Step one leg forward into a lunge position',
          'Ensure your front knee is directly above your ankle',
          'Lower your back knee towards the ground',
          'Hold the position for 60 seconds each side'
        ]
      },
      {
        id: 'ex-003-3',
        name: 'Side Lunge Hold',
        duration: 60,
        steps: [
          'Stand with feet wide apart',
          'Shift your weight to one side',
          'Bend that knee while keeping the other leg straight',
          'Keep your back straight and hold for 60 seconds each side'
        ]
      },
      {
        id: 'ex-003-4',
        name: 'Wall Sit',
        duration: 30,
        steps: [
          'Lean your back against a wall',
          'Slide down until your knees are bent at a 90-degree angle',
          'As if sitting in a chair',
          'Hold the position for 30 seconds'
        ]
      }
    ]
  },
  {
    id: 'ex-004',
    name: 'Posture Stabilizer',
    categoryId: 'posture',
    durationMin: 4, // 30+30+30+30+15+30+30+15 = 210s = 3.5min, rounded to 4min
    difficulty: 'Inter',
    impact: 'Medium',
    icon: 'home',
    shortDescription: 'A series of planks and isometric exercises that improve posture by strengthening muscles in the core and back, supporting proper alignment of the spine, and improving balance and stability.',
    benefits: ['Core strength', 'Spinal alignment', 'Balance improvement', 'Posture support'],
    targetMuscles: ['Core', 'Back', 'Glutes', 'Shoulders'],
    equipment: [],
    steps: [
      'Complete all 8 exercises in sequence',
      'Focus on proper form and breathing',
      'Hold each position for the specified duration',
      'Rest 5 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-004-1',
        name: 'Dead Bug',
        duration: 30,
        steps: [
          'Lie on back with arms up and knees up',
          'Extend opposite arm and leg',
          'Keep back flat on floor',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-004-2',
        name: 'Bridge Leg Lift',
        duration: 30,
        steps: [
          'Start in bridge position',
          'Lift one leg up',
          'Keep hips level',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-004-3',
        name: 'Bicycle Crunch Hold',
        duration: 30,
        steps: [
          'Lie on back with knees bent',
          'Bring knees to 90 degrees',
          'Hold position with core engaged',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-004-4',
        name: 'Bird Dog',
        duration: 30,
        steps: [
          'Start on hands and knees',
          'Extend opposite arm and leg',
          'Keep core stable',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-004-5',
        name: 'Airplane',
        duration: 15,
        steps: [
          'Stand on one leg',
          'Extend arms to sides',
          'Lean forward with straight back',
          'Hold for 15 seconds each side'
        ]
      },
      {
        id: 'ex-004-6',
        name: 'Lying Side Leg Raise',
        duration: 30,
        steps: [
          'Lie on your side',
          'Lift top leg up',
          'Keep leg straight',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-004-7',
        name: 'Elbow Side Plank',
        duration: 30,
        steps: [
          'Start in side plank on elbow',
          'Keep body in straight line',
          'Engage core',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-004-8',
        name: 'Hand Plank',
        duration: 15,
        steps: [
          'Start in plank position on hands',
          'Keep body in straight line',
          'Engage core and glutes',
          'Hold for 15 seconds'
        ]
      }
    ]
  },
  {
    id: 'ex-005',
    name: 'Pelvic Tilt',
    categoryId: 'posture',
    durationMin: 3, // 30s + 45s + 60s = 135s = 2.25min, rounded to 3min
    difficulty: 'Beginner',
    impact: 'Medium',
    icon: 'body',
    shortDescription: 'Core control for lumbar neutrality.',
    benefits: ['Strengthens deep core', 'Reduces lumbar sway', 'Body awareness'],
    targetMuscles: ['Core', 'Lower back'],
    equipment: [],
    steps: [
      'Lie supine, knees bent.',
      'Gently tuck pelvis to press low back into floor.',
      'Hold 3–5s; 12–15 reps.',
    ],
    subExercises: [
      {
        id: 'ex-005-1',
        name: 'Basic Pelvic Tilt',
        duration: 30,
        description: 'Simple pelvic tilt with core engagement',
        steps: ['Lie on back with knees bent', 'Gently tuck pelvis to press low back to floor', 'Hold for 3-5 seconds', 'Release and repeat', 'Focus on core control']
      },
      {
        id: 'ex-005-2',
        name: 'Pelvic Tilt Pulses',
        duration: 45,
        description: 'Small pulsing movements in pelvic tilt',
        steps: ['Start in basic pelvic tilt', 'Add small pulsing movements', 'Keep core engaged throughout', 'Focus on lower back control', 'Continue for 45 seconds']
      },
      {
        id: 'ex-005-3',
        name: 'Pelvic Tilt Flow',
        duration: 60,
        description: 'Flowing pelvic tilts with breathing',
        steps: ['Begin with basic tilt', 'Add breathing coordination', 'Flow between positions', 'Focus on core stability', 'Maintain smooth movement']
      }
    ]
  },
  {
    id: 'ex-006',
    name: 'Lower Body 1',
    categoryId: 'lower-body',
    durationMin: 5,
    difficulty: 'Beginner',
    impact: 'Medium',
    icon: 'body',
    shortDescription: 'A beginner routine designed to increase flexibility in your hips, hamstrings, glutes, groin, and thighs.',
    benefits: ['Hip flexibility', 'Hamstring mobility', 'Glute activation', 'Groin opening', 'Thigh strength'],
    targetMuscles: ['Hips', 'Hamstrings', 'Glutes', 'Groin', 'Thighs'],
    equipment: [],
    steps: [
      'Complete all 6 exercises in sequence',
      'Focus on proper form and breathing',
      'Hold each stretch for the specified duration',
      'Rest 10 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-006-1',
        name: 'Wide Leg Bend',
        duration: 30,
        steps: [
          'Stand with legs wide apart',
          'Bend forward from hips',
          'Place hands on floor between feet',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-006-2',
        name: 'Lunge',
        duration: 60,
        steps: [
          'Step forward with one leg',
          'Lower into lunge position',
          'Keep front knee over ankle',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-006-3',
        name: 'Reverse Lunge',
        duration: 60,
        steps: [
          'Step back with one leg',
          'Lower into lunge position',
          'Keep front knee over ankle',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-006-4',
        name: 'Butterfly',
        duration: 30,
        steps: [
          'Sit with soles of feet together',
          'Knees bent out to sides',
          'Gently press knees down',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-006-5',
        name: 'Quad Stretch',
        duration: 60,
        steps: [
          'Lie on your side',
          'Bend top leg and grab foot',
          'Pull foot toward glutes',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-006-6',
        name: 'Lying Figure Four',
        duration: 60,
        steps: [
          'Lie on your back',
          'Cross one ankle over opposite knee',
          'Pull knee toward chest',
          'Hold for 30 seconds each side'
        ]
      }
    ]
  },
  {
    id: 'ex-008',
    name: 'Neck 1',
    categoryId: 'neck',
    durationMin: 4, // 15+15+30+30+30+30+30+30 = 210s = 3.5min, rounded to 4min
    difficulty: 'Beginner',
    impact: 'Low',
    icon: 'arrow-up-down',
    shortDescription: 'A series of stretches designed to increase flexibility in the neck.',
    benefits: ['Neck flexibility', 'Reduced stiffness', 'Improved mobility', 'Better posture'],
    targetMuscles: ['Neck muscles', 'Cervical spine', 'Upper traps'],
    equipment: [],
    steps: [
      'Complete all 8 exercises in sequence',
      'Focus on gentle, controlled movements',
      'Hold each stretch for the specified duration',
      'Breathe naturally throughout'
    ],
    subExercises: [
      {
        id: 'ex-008-1',
        name: 'Diver',
        duration: 15,
        steps: [
          'Stand with feet hip-width apart',
          'Bend forward from hips',
          'Let arms hang naturally',
          'Hold for 15 seconds'
        ]
      },
      {
        id: 'ex-008-2',
        name: 'Cactus Arms',
        duration: 15,
        steps: [
          'Stand with arms bent at 90 degrees',
          'Elbows at shoulder height',
          'Forearms pointing up',
          'Hold for 15 seconds'
        ]
      },
      {
        id: 'ex-008-3',
        name: 'Neck Extension',
        duration: 30,
        steps: [
          'Start in neutral position',
          'Gently tilt head back',
          'Look up toward ceiling',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-008-4',
        name: 'Neck Flexion',
        duration: 30,
        steps: [
          'Start in neutral position',
          'Gently tuck chin to chest',
          'Feel stretch in back of neck',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-008-5',
        name: 'Ear-to-Shoulder',
        duration: 30,
        steps: [
          'Start in neutral position',
          'Gently tilt head to one side',
          'Bring ear toward shoulder',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-008-6',
        name: 'Scalene Stretch',
        duration: 30,
        steps: [
          'Start in neutral position',
          'Tilt head to one side',
          'Gently pull with opposite hand',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-008-7',
        name: 'Scapula Stretch',
        duration: 30,
        steps: [
          'Reach one arm across body',
          'Use other hand to pull elbow',
          'Feel stretch in shoulder blade',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-008-8',
        name: 'Neck Rotation',
        duration: 30,
        steps: [
          'Start in neutral position',
          'Slowly turn head to one side',
          'Look over shoulder',
          'Hold for 30 seconds each side'
        ]
      }
    ]
  },
  {
    id: 'ex-011',
    name: 'Thoracic Cat-Cow',
    categoryId: 'posture',
    durationMin: 6,
    difficulty: 'Beginner',
    impact: 'Low',
    icon: 'body',
    shortDescription: 'Segmental spinal flexion/extension.',
    benefits: ['Mobilizes thoracic spine', 'Improves posture awareness'],
    targetMuscles: ['Spine', 'Core'],
    equipment: [],
    steps: ['On all fours', 'Alternate arch and round', 'Slow breathing 8–10 reps'],
  },
  {
    id: 'ex-014',
    name: 'Lower Body 2',
    categoryId: 'lower-body',
    durationMin: 7, // 60+30+60+30+30+60+60+60 = 390s = 6.5min, rounded to 7min
    difficulty: 'Inter',
    impact: 'Medium',
    icon: 'body',
    shortDescription: 'An intermediate routine designed to increase flexibility in your hips, hamstrings, glutes, groin, and thighs.',
    benefits: ['Enhanced flexibility', 'Better mobility', 'Injury prevention', 'Improved range of motion'],
    targetMuscles: ['Hips', 'Hamstrings', 'Glutes', 'Groin', 'Thighs'],
    equipment: [],
    steps: [
      'Complete all 8 exercises in sequence',
      'Focus on deep breathing during stretches',
      'Hold each position for the full duration',
      'Rest 5 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-014-1',
        name: 'Kneeling Quad',
        duration: 60,
        steps: [
          'Kneel on one knee',
          'Grab back foot with hand',
          'Pull foot toward glutes',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-014-2',
        name: 'Downward Dog',
        duration: 30,
        steps: [
          'Start on hands and knees',
          'Tuck toes and lift hips up',
          'Straighten legs as much as possible',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-014-3',
        name: 'Pigeon',
        duration: 60,
        steps: [
          'Start in downward dog',
          'Bring one knee forward',
          'Extend other leg back',
          'Lower to forearms for deeper stretch',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-014-4',
        name: 'Thunderbolt',
        duration: 30,
        steps: [
          'Kneel on the floor',
          'Sit back on your heels',
          'Keep spine straight',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-014-5',
        name: 'Butterfly',
        duration: 30,
        steps: [
          'Sit with soles of feet together',
          'Knees bent out to sides',
          'Gently press knees down',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-014-6',
        name: 'Hurdler',
        duration: 60,
        steps: [
          'Sit with one leg extended',
          'Other leg bent to side',
          'Bend forward over extended leg',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-014-7',
        name: 'Quad Stretch',
        duration: 60,
        steps: [
          'Lie on your side',
          'Bend top leg and grab foot',
          'Pull foot toward glutes',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-014-8',
        name: 'Lying Figure Four',
        duration: 60,
        steps: [
          'Lie on your back',
          'Cross one ankle over opposite knee',
          'Pull knee toward chest',
          'Hold for 30 seconds each side'
        ]
      }
    ]
  },
  {
    id: 'ex-015',
    name: 'Lower Body 3',
    categoryId: 'lower-body',
    durationMin: 16, // 60+30+30+30+60+60+60+60+60+60+30+60+60+60+60+30+60+60+60 = 960s = 16min
    difficulty: 'Advanced',
    impact: 'High',
    icon: 'body',
    shortDescription: 'An expert routine designed to increase flexibility in your hips, hamstrings, glutes, groin, and thighs.',
    benefits: ['Maximum flexibility', 'Advanced mobility', 'Expert-level control', 'Comprehensive lower body training'],
    targetMuscles: ['Hips', 'Hamstrings', 'Glutes', 'Groin', 'Thighs', 'Calves'],
    equipment: [],
    steps: [
      'Complete all 19 exercises in sequence',
      'Focus on deep breathing and proper form',
      'Hold each position for the full duration',
      'Rest 5 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-015-1',
        name: 'Pigeon',
        duration: 60,
        steps: [
          'Start in downward dog',
          'Bring one knee forward',
          'Extend other leg back',
          'Lower to forearms for deeper stretch',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-015-2',
        name: 'Thunderbolt',
        duration: 30,
        steps: [
          'Kneel on the floor',
          'Sit back on your heels',
          'Keep spine straight',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-015-3',
        name: 'Toe Squat',
        duration: 30,
        steps: [
          'Kneel on the floor',
          'Sit back on your heels',
          'Lift knees off ground',
          'Balance on toes',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-015-4',
        name: 'Butterfly',
        duration: 30,
        steps: [
          'Sit with soles of feet together',
          'Knees bent out to sides',
          'Gently press knees down',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-015-5',
        name: 'Double Pigeon',
        duration: 60,
        steps: [
          'Sit with one leg bent in front',
          'Stack other leg on top',
          'Bend forward over legs',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-015-6',
        name: 'Seated Twist',
        duration: 60,
        steps: [
          'Sit with legs crossed',
          'Place one hand behind you',
          'Other hand on opposite knee',
          'Twist torso gently',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-015-7',
        name: 'Leaning 90/90',
        duration: 60,
        steps: [
          'Sit with both knees bent at 90 degrees',
          'One leg in front, one to the side',
          'Lean forward over front leg',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-015-8',
        name: 'Hurdler',
        duration: 60,
        steps: [
          'Sit with one leg extended',
          'Other leg bent to side',
          'Bend forward over extended leg',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-015-9',
        name: 'Quad Stretch',
        duration: 60,
        steps: [
          'Lie on your side',
          'Bend top leg and grab foot',
          'Pull foot toward glutes',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-015-10',
        name: 'Lying Figure Four',
        duration: 60,
        steps: [
          'Lie on your back',
          'Cross one ankle over opposite knee',
          'Pull knee toward chest',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-015-11',
        name: 'Wide Leg Bend',
        duration: 30,
        steps: [
          'Stand with legs wide apart',
          'Bend forward from hips',
          'Place hands on floor between feet',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-015-12',
        name: 'Side Lunge',
        duration: 60,
        steps: [
          'Step to the side with one leg',
          'Bend knee and lower hips',
          'Keep other leg straight',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-015-13',
        name: 'Lunge',
        duration: 60,
        steps: [
          'Step forward with one leg',
          'Lower into lunge position',
          'Keep front knee over ankle',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-015-14',
        name: 'Reverse Lunge',
        duration: 60,
        steps: [
          'Step back with one leg',
          'Lower into lunge position',
          'Keep front knee over ankle',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-015-15',
        name: 'Kneeling Quad',
        duration: 60,
        steps: [
          'Kneel on one knee',
          'Grab back foot with hand',
          'Pull foot toward glutes',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-015-16',
        name: 'Downward Dog',
        duration: 30,
        steps: [
          'Start on hands and knees',
          'Tuck toes and lift hips up',
          'Straighten legs as much as possible',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-015-17',
        name: 'Standing Quad',
        duration: 60,
        steps: [
          'Stand on one leg',
          'Bend other leg and grab foot',
          'Pull foot toward glutes',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-015-18',
        name: 'Standing Hamstring',
        duration: 60,
        steps: [
          'Stand with one leg on elevated surface',
          'Bend forward from hips',
          'Reach toward elevated foot',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-015-19',
        name: 'Standing Calf',
        duration: 60,
        steps: [
          'Stand facing a wall',
          'Step one foot back',
          'Press heel down to stretch calf',
          'Hold for 30 seconds each side'
        ]
      }
    ]
  },
  {
    id: 'ex-017',
    name: 'Upper Body 1',
    categoryId: 'upper-body',
    durationMin: 5, // 30+30+30+30+30+60+30+30+30 = 300s = 5min
    difficulty: 'Beginner',
    impact: 'Low',
    icon: 'body',
    shortDescription: 'A beginner routine designed to increase flexibility in your neck, shoulders, chest, and upper back.',
    benefits: ['Neck flexibility', 'Shoulder mobility', 'Chest opening', 'Upper back strength'],
    targetMuscles: ['Neck', 'Shoulders', 'Chest', 'Upper back'],
    equipment: [],
    steps: [
      'Complete all 9 exercises in sequence',
      'Focus on proper form and breathing',
      'Hold each stretch for the specified duration',
      'Rest 5 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-017-1',
        name: 'Chest Opener',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Clasp hands behind back',
          'Lift arms up and back',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-017-2',
        name: 'Overhead Tricep',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Reach one arm overhead',
          'Bend elbow, hand behind head',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-017-3',
        name: 'One Arm Hug',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Bring one arm across chest',
          'Use other arm to gently pull',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-017-4',
        name: 'Reverse Shoulder',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Reach one arm behind head',
          'Gently pull elbow with other hand',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-017-5',
        name: 'Diver',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Bend forward from hips',
          'Extend arms forward',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-017-6',
        name: 'Wall Arms',
        duration: 60,
        steps: [
          'Stand facing wall',
          'Place forearms on wall',
          'Keep arms at 90 degrees',
          'Hold for 1 minute'
        ]
      },
      {
        id: 'ex-017-7',
        name: 'Chin Retractions',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Gently tuck chin back',
          'Hold for 5 seconds, repeat',
          'Continue for 30 seconds'
        ]
      },
      {
        id: 'ex-017-8',
        name: 'Ear-to-Shoulder',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Gently tilt head to one side',
          'Use hand to apply gentle pressure',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-017-9',
        name: 'Scalene Stretch',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Tilt head to one side',
          'Gently pull with opposite hand',
          'Hold for 30 seconds each side'
        ]
      }
    ]
  },
  {
    id: 'ex-018',
    name: 'Upper Body 2',
    categoryId: 'upper-body',
    durationMin: 5, // 30+60+30+30+30+30+30+30 = 270s = 4.5min, rounded to 5min
    difficulty: 'Inter',
    impact: 'Medium',
    icon: 'body',
    shortDescription: 'An intermediate routine designed to increase flexibility in your neck, shoulders, chest, and upper back.',
    benefits: ['Enhanced neck flexibility', 'Improved shoulder mobility', 'Better chest opening', 'Stronger upper back'],
    targetMuscles: ['Neck', 'Shoulders', 'Chest', 'Upper back'],
    equipment: [],
    steps: [
      'Complete all 8 exercises in sequence',
      'Focus on deep breathing during stretches',
      'Hold each position for the full duration',
      'Rest 5 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-018-1',
        name: 'Diver',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Bend forward from hips',
          'Extend arms forward',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-018-2',
        name: 'Wall Arms',
        duration: 60,
        steps: [
          'Stand facing wall',
          'Place forearms on wall',
          'Keep arms at 90 degrees',
          'Hold for 1 minute'
        ]
      },
      {
        id: 'ex-018-3',
        name: 'Neck Roll',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Slowly roll head in circles',
          'Keep movements gentle',
          'Complete 5 rolls each direction for 30 seconds'
        ]
      },
      {
        id: 'ex-018-4',
        name: 'Chin Retractions',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Gently tuck chin back',
          'Hold for 5 seconds, repeat',
          'Continue for 30 seconds'
        ]
      },
      {
        id: 'ex-018-5',
        name: 'Ear-to-Shoulder',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Gently tilt head to one side',
          'Use hand to apply gentle pressure',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-018-6',
        name: 'Neck Rotation',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Slowly turn head to one side',
          'Look over shoulder',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-018-7',
        name: 'Scapula Stretch',
        duration: 30,
        steps: [
          'Reach one arm across body',
          'Use other hand to pull elbow',
          'Feel stretch in shoulder blade',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-018-8',
        name: 'Scalene Stretch',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Tilt head to one side',
          'Gently pull with opposite hand',
          'Hold for 30 seconds each side'
        ]
      }
    ]
  },
  {
    id: 'ex-019',
    name: 'Wrist Extension Stretch',
    categoryId: 'hands',
    durationMin: 5,
    difficulty: 'Beginner',
    impact: 'Low',
    icon: 'hand',
    shortDescription: 'Relieve tight forearms.',
    benefits: ['Better push-up position', 'Healthier wrists'],
    targetMuscles: ['Forearm flexors'],
    equipment: [],
    steps: ['Palm down, fingers forward', 'Lean gently', 'Hold 20s'],
  },
  {
    id: 'ex-020',
    name: 'Wrist Flexion Stretch',
    categoryId: 'hands',
    durationMin: 5,
    difficulty: 'Beginner',
    impact: 'Low',
    icon: 'hand',
    shortDescription: 'Balance wrist mobility.',
    benefits: ['Relieves strain', 'Improves hand function'],
    targetMuscles: ['Forearm extensors'],
    equipment: [],
    steps: ['Palm up, fingers toward you', 'Lean gently', 'Hold 20s'],
  },
  {
    id: 'ex-021',
    name: 'Neck 2',
    categoryId: 'neck',
    durationMin: 5, // 30+30+30+30+30+60+30+30 = 270s = 4.5min, rounded to 5min
    difficulty: 'Inter',
    impact: 'Medium',
    icon: 'arrow-back',
    shortDescription: 'A series of stretches designed to increase flexibility in the neck.',
    benefits: ['Enhanced neck flexibility', 'Improved mobility', 'Better posture', 'Reduced tension'],
    targetMuscles: ['Neck muscles', 'Cervical spine', 'Upper traps', 'Shoulders'],
    equipment: [],
    steps: [
      'Complete all 8 exercises in sequence',
      'Focus on deep, controlled stretches',
      'Hold each position for the full duration',
      'Breathe deeply throughout'
    ],
    subExercises: [
      {
        id: 'ex-021-1',
        name: 'Neck Flexion',
        duration: 30,
        steps: [
          'Start in neutral position',
          'Gently tuck chin to chest',
          'Feel stretch in back of neck',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-021-2',
        name: 'Ear-to-Shoulder',
        duration: 30,
        steps: [
          'Start in neutral position',
          'Gently tilt head to one side',
          'Bring ear toward shoulder',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-021-3',
        name: 'Scalene Stretch',
        duration: 30,
        steps: [
          'Start in neutral position',
          'Tilt head to one side',
          'Gently pull with opposite hand',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-021-4',
        name: 'Scapula Stretch',
        duration: 30,
        steps: [
          'Reach one arm across body',
          'Use other hand to pull elbow',
          'Feel stretch in shoulder blade',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-021-5',
        name: 'Neck Rotation',
        duration: 30,
        steps: [
          'Start in neutral position',
          'Slowly turn head to one side',
          'Look over shoulder',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-021-6',
        name: 'Wall Arms',
        duration: 60,
        steps: [
          'Stand facing a wall',
          'Place forearms on wall',
          'Keep arms at 90 degrees',
          'Hold for 1 minute'
        ]
      },
      {
        id: 'ex-021-7',
        name: 'Reverse Shoulder',
        duration: 30,
        steps: [
          'Reach one arm behind back',
          'Use other hand to pull elbow',
          'Feel stretch in shoulder',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-021-8',
        name: 'Bear Hug',
        duration: 30,
        steps: [
          'Cross arms over chest',
          'Hug yourself tightly',
          'Feel stretch in upper back',
          'Hold for 30 seconds'
        ]
      }
    ]
  },
  {
    id: 'ex-023',
    name: 'Quadruped T-Spine Rotation',
    categoryId: 'posture',
    durationMin: 6,
    difficulty: 'Beginner',
    impact: 'Low',
    icon: 'refresh',
    shortDescription: 'Thread the needle variant.',
    benefits: ['Thoracic rotation', 'Upper back relief'],
    targetMuscles: ['Thoracic spine'],
    equipment: [],
    steps: ['Hand behind head', 'Rotate elbow up', 'Slow 8–10 reps each'],
  },
  {
    id: 'ex-024',
    name: 'Dead Bug',
    categoryId: 'posture',
    durationMin: 7,
    difficulty: 'Beginner',
    impact: 'Medium',
    icon: 'bug',
    shortDescription: 'Core stability drill.',
    benefits: ['Spine-friendly core', 'Better pelvic control'],
    targetMuscles: ['Core'],
    equipment: [],
    steps: ['Arms up, knees up', 'Opposite arm/leg extend', 'Keep back flat 8–10 each'],
  },
  {
    id: 'ex-026',
    name: 'Neck 3',
    categoryId: 'neck',
    durationMin: 6, // 30+30+30+30+30+30+30+60+60 = 330s = 5.5min, rounded to 6min
    difficulty: 'Advanced',
    impact: 'High',
    icon: 'arrow-down',
    shortDescription: 'A series of stretches designed to increase flexibility in the neck.',
    benefits: ['Maximum neck flexibility', 'Advanced mobility', 'Expert-level control', 'Comprehensive neck training'],
    targetMuscles: ['Neck muscles', 'Cervical spine', 'Upper traps', 'Shoulders', 'Upper back'],
    equipment: [],
    steps: [
      'Complete all 9 exercises in sequence',
      'Focus on deep breathing and proper form',
      'Hold each position for the full duration',
      'Rest 5 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-026-1',
        name: 'Cactus Arms',
        duration: 30,
        steps: [
          'Stand with arms bent at 90 degrees',
          'Elbows at shoulder height',
          'Forearms pointing up',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-026-2',
        name: 'Neck Extension',
        duration: 30,
        steps: [
          'Start in neutral position',
          'Gently tilt head back',
          'Look up toward ceiling',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-026-3',
        name: 'Neck Flexion',
        duration: 30,
        steps: [
          'Start in neutral position',
          'Gently tuck chin to chest',
          'Feel stretch in back of neck',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-026-4',
        name: 'Ear-to-Shoulder',
        duration: 30,
        steps: [
          'Start in neutral position',
          'Gently tilt head to one side',
          'Bring ear toward shoulder',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-026-5',
        name: 'Scalene Stretch',
        duration: 30,
        steps: [
          'Start in neutral position',
          'Tilt head to one side',
          'Gently pull with opposite hand',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-026-6',
        name: 'Scapula Stretch',
        duration: 30,
        steps: [
          'Reach one arm across body',
          'Use other hand to pull elbow',
          'Feel stretch in shoulder blade',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-026-7',
        name: 'Neck Rotation',
        duration: 30,
        steps: [
          'Start in neutral position',
          'Slowly turn head to one side',
          'Look over shoulder',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-026-8',
        name: 'Wall Arms',
        duration: 60,
        steps: [
          'Stand facing a wall',
          'Place forearms on wall',
          'Keep arms at 90 degrees',
          'Hold for 1 minute'
        ]
      },
      {
        id: 'ex-026-9',
        name: 'One Arm Hug',
        duration: 60,
        steps: [
          'Reach one arm across chest',
          'Use other hand to pull elbow',
          'Feel stretch in shoulder',
          'Hold for 1 minute each side'
        ]
      }
    ]
  },
  {
    id: 'ex-027',
    name: 'Pelvic Tilt',
    categoryId: 'pelvic-tilt',
    durationMin: 5,
    difficulty: 'Beginner',
    impact: 'Medium',
    icon: 'body',
    shortDescription: 'Undo anterior pelvic tilt and an arched lower back with stretches that lengthen muscles in your lower back and hip flexors.',
    benefits: ['Corrects pelvic alignment', 'Reduces lower back arch', 'Improves hip flexor flexibility', 'Better posture'],
    targetMuscles: ['Lower back', 'Hip flexors', 'Glutes', 'Core'],
    equipment: [],
    steps: [
      'Complete all 8 exercises in sequence',
      'Focus on proper form and breathing',
      'Hold each stretch for the specified duration',
      'Rest 10 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-027-1',
        name: 'Knees-to-chest',
        duration: 30,
        steps: [
          'Lie on your back',
          'Bring both knees to chest',
          'Hug knees with arms',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-027-2',
        name: 'Lying Quad Stretch',
        duration: 60,
        steps: [
          'Lie on your side',
          'Bend top leg and grab foot',
          'Pull foot toward glutes',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-027-3',
        name: 'Lunge',
        duration: 30,
        steps: [
          'Step forward with one leg',
          'Lower into lunge position',
          'Keep front knee over ankle',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-027-4',
        name: 'Cat Cow',
        duration: 30,
        steps: [
          'Start on hands and knees',
          'Arch back (cow pose)',
          'Round spine (cat pose)',
          'Continue for 30 seconds'
        ]
      },
      {
        id: 'ex-027-5',
        name: 'Butterfly',
        duration: 30,
        steps: [
          'Sit with soles of feet together',
          'Knees bent out to sides',
          'Gently press knees down',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-027-6',
        name: 'Lying Figure Four',
        duration: 60,
        steps: [
          'Lie on your back',
          'Cross one ankle over opposite knee',
          'Pull knee toward chest',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-027-7',
        name: 'Pelvic Tilt Press',
        duration: 15,
        steps: [
          'Lie on back with knees bent',
          'Flatten lower back to floor',
          'Press pelvis up slightly',
          'Hold for 15 seconds'
        ]
      },
      {
        id: 'ex-027-8',
        name: 'Bridge',
        duration: 15,
        steps: [
          'Lie on back with knees bent',
          'Lift hips up into bridge',
          'Keep core engaged',
          'Hold for 15 seconds'
        ]
      }
    ]
  },
  {
    id: 'ex-028',
    name: 'Upper Body 3',
    categoryId: 'upper-body',
    durationMin: 4, // 30+30+30+30+30+30+30+30 = 240s = 4min
    difficulty: 'Advanced',
    impact: 'High',
    icon: 'expand',
    shortDescription: 'An expert routine designed to increase flexibility in your neck, shoulders, chest, and upper back.',
    benefits: ['Maximum flexibility', 'Advanced mobility', 'Expert-level control', 'Comprehensive upper body training'],
    targetMuscles: ['Neck', 'Shoulders', 'Chest', 'Upper back'],
    equipment: [],
    steps: [
      'Complete all 8 exercises in sequence',
      'Focus on deep breathing and proper form',
      'Hold each position for the full duration',
      'Rest 5 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-028-1',
        name: 'Shoulder Rolls',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Place hands on shoulders',
          'Roll shoulders forward and back',
          'Complete 10 rolls each direction for 30 seconds'
        ]
      },
      {
        id: 'ex-028-2',
        name: 'Upward Salute',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Raise both arms overhead',
          'Palms facing each other',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-028-3',
        name: 'Rag Doll',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Bend forward from hips',
          'Let arms hang loosely',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-028-4',
        name: 'Chest Opener',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Clasp hands behind back',
          'Lift arms up and back',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-028-5',
        name: 'Overhead Tricep',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Reach one arm overhead',
          'Bend elbow, hand behind head',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-028-6',
        name: 'One Arm Hug',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Bring one arm across chest',
          'Use other arm to gently pull',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-028-7',
        name: 'Forward Fold',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Bend forward from hips',
          'Let arms hang loosely',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-028-8',
        name: 'Cactus Arms',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Bend arms at 90 degrees',
          'Keep elbows at shoulder height',
          'Hold for 30 seconds'
        ]
      }
    ]
  },
  {
    id: 'ex-029',
    name: "Child's Pose with Side Reach",
    categoryId: 'recovery',
    durationMin: 6,
    difficulty: 'Beginner',
    impact: 'Low',
    icon: 'body',
    shortDescription: 'Restorative lat/QL stretch.',
    benefits: ['Relaxes back', 'Opens lats'],
    targetMuscles: ['Lats', 'QL'],
    equipment: [],
    steps: ['Child’s pose', 'Walk hands to one side', 'Hold and breathe'],
  },
  {
    id: 'ex-032',
    name: 'Chest Supported Row (Band)',
    categoryId: 'upper-body',
    durationMin: 8,
    difficulty: 'Beginner',
    impact: 'Medium',
    icon: 'fitness',
    shortDescription: 'Posterior chain pull.',
    benefits: ['Back strength', 'Shoulder balance'],
    targetMuscles: ['Lats', 'Rhomboids'],
    equipment: ['Band'],
    steps: ['Anchor band', 'Row elbows back', '12 reps x 3'],
  },
  {
    id: 'ex-034',
    name: 'Side Plank',
    categoryId: 'posture',
    durationMin: 6,
    difficulty: 'Inter',
    impact: 'Medium',
    icon: 'body',
    shortDescription: 'Lateral core strength.',
    benefits: ['Stabilizes spine', 'Improves posture'],
    targetMuscles: ['Obliques', 'Glute med'],
    equipment: [],
    steps: ['Elbow under shoulder', 'Lift hips', 'Hold 20–30s each side'],
  },
  {
    id: 'ex-036',
    name: 'Seated Nerve Glides',
    categoryId: 'recovery',
    durationMin: 6,
    difficulty: 'Beginner',
    impact: 'Low',
    icon: 'body',
    shortDescription: 'Gentle neural mobility.',
    benefits: ['Relieves tightness', 'Improves comfort'],
    targetMuscles: ['Neural tissue'],
    equipment: [],
    steps: ['Extend leg and ankle', 'Tilt head opposite', 'Slow rhythm 8–10 reps'],
  },
  {
    id: 'ex-038',
    name: 'Quadruped Rock Back',
    categoryId: 'recovery',
    durationMin: 6,
    difficulty: 'Beginner',
    impact: 'Low',
    icon: 'refresh',
    shortDescription: 'Hips + spine coordination.',
    benefits: ['Gentle mobility', 'Calming movement'],
    targetMuscles: ['Hips', 'Spine'],
    equipment: [],
    steps: ['On all fours', 'Rock hips to heels', 'Slow 10 reps'],
  },
  {
    id: 'ex-039',
    name: 'Scap Push-Ups',
    categoryId: 'upper-body',
    durationMin: 6,
    difficulty: 'Beginner',
    impact: 'Medium',
    icon: 'body',
    shortDescription: 'Protraction/retraction only.',
    benefits: ['Serratus activation', 'Better push-up form'],
    targetMuscles: ['Serratus', 'Traps'],
    equipment: [],
    steps: ['Plank position', 'Push floor away / let chest sink', '10–12 reps'],
  },
  // Additional Masai Jump exercises
  {
    id: 'ex-041',
    name: 'Masai Jump 1',
    categoryId: 'masai-jump',
    durationMin: 5,
    difficulty: 'Beginner',
    impact: 'High',
    icon: 'flash',
    shortDescription: 'A dynamic jumping routine inspired by the explosive power and rhythm of traditional Masai movements. Designed to activate your calves, improve ankle elasticity, and build vertical bounce.',
    benefits: ['Calf activation', 'Ankle elasticity', 'Vertical bounce', 'Explosive power'],
    targetMuscles: ['Calves', 'Ankles', 'Quads', 'Glutes'],
    equipment: [],
    steps: [
      'Complete all 7 exercises in sequence',
      'Focus on explosive power and rhythm',
      'Maintain soft landings throughout',
      'Rest between jump sets as indicated'
    ],
    subExercises: [
      {
        id: 'ex-041-1',
        name: 'Calf Pulses',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Rise up onto your toes',
          'Lower back down slowly',
          'Repeat pulsing motion for 30 seconds'
        ]
      },
      {
        id: 'ex-041-2',
        name: 'Knee Circles',
        duration: 30,
        steps: [
          'Stand with feet together',
          'Place hands on knees',
          'Make circular motions with knees',
          'Continue for 30 seconds'
        ]
      },
      {
        id: 'ex-041-3',
        name: 'Masai Jump',
        duration: 60,
        steps: [
          'Stand tall with feet hip-width apart',
          'Perform quick vertical hops',
          'Keep knee bend minimal',
          'Focus on ankle stiffness and explosive power',
          'Continue for 1 minute'
        ]
      },
      {
        id: 'ex-041-4',
        name: 'Rest',
        duration: 30,
        steps: [
          'Stand or walk gently',
          'Focus on controlled breathing',
          'Prepare for next exercise',
          'Rest for 30 seconds'
        ]
      },
      {
        id: 'ex-041-5',
        name: 'Masai Jump',
        duration: 60,
        steps: [
          'Stand tall with feet hip-width apart',
          'Perform quick vertical hops',
          'Keep knee bend minimal',
          'Focus on ankle stiffness and explosive power',
          'Continue for 1 minute'
        ]
      },
      {
        id: 'ex-041-6',
        name: 'Rest',
        duration: 30,
        steps: [
          'Stand or walk gently',
          'Focus on controlled breathing',
          'Prepare for next exercise',
          'Rest for 30 seconds'
        ]
      },
      {
        id: 'ex-041-7',
        name: 'Masai Jump',
        duration: 60,
        steps: [
          'Stand tall with feet hip-width apart',
          'Perform quick vertical hops',
          'Keep knee bend minimal',
          'Focus on ankle stiffness and explosive power',
          'Continue for 1 minute'
        ]
      }
    ]
  },
  {
    id: 'ex-042',
    name: 'Masai Jump 2',
    categoryId: 'masai-jump',
    durationMin: 6, // 30+60+30+60+30+60+30+60 = 360s = 6min
    difficulty: 'Inter',
    impact: 'High',
    icon: 'flash',
    shortDescription: 'A dynamic jumping routine inspired by the explosive power and rhythm of traditional Masai movements. Designed to activate your calves, improve ankle elasticity, and build vertical bounce.',
    benefits: ['Enhanced calf activation', 'Improved ankle elasticity', 'Advanced vertical bounce', 'Explosive power'],
    targetMuscles: ['Calves', 'Ankles', 'Quads', 'Glutes'],
    equipment: [],
    steps: [
      'Complete all 8 exercises in sequence',
      'Focus on explosive power and rhythm',
      'Maintain soft landings throughout',
      'Rest between jump sets as indicated'
    ],
    subExercises: [
      {
        id: 'ex-042-1',
        name: 'Knee Circles',
        duration: 30,
        steps: [
          'Stand with feet together',
          'Place hands on knees',
          'Make circular motions with knees',
          'Continue for 30 seconds'
        ]
      },
      {
        id: 'ex-042-2',
        name: 'Masai Jump',
        duration: 60,
        steps: [
          'Stand tall with feet hip-width apart',
          'Perform quick vertical hops',
          'Keep knee bend minimal',
          'Focus on ankle stiffness and explosive power',
          'Continue for 1 minute'
        ]
      },
      {
        id: 'ex-042-3',
        name: 'Rest',
        duration: 30,
        steps: [
          'Stand or walk gently',
          'Focus on controlled breathing',
          'Prepare for next exercise',
          'Rest for 30 seconds'
        ]
      },
      {
        id: 'ex-042-4',
        name: 'Masai Jump',
        duration: 60,
        steps: [
          'Stand tall with feet hip-width apart',
          'Perform quick vertical hops',
          'Keep knee bend minimal',
          'Focus on ankle stiffness and explosive power',
          'Continue for 1 minute'
        ]
      },
      {
        id: 'ex-042-5',
        name: 'Rest',
        duration: 30,
        steps: [
          'Stand or walk gently',
          'Focus on controlled breathing',
          'Prepare for next exercise',
          'Rest for 30 seconds'
        ]
      },
      {
        id: 'ex-042-6',
        name: 'Masai Jump',
        duration: 60,
        steps: [
          'Stand tall with feet hip-width apart',
          'Perform quick vertical hops',
          'Keep knee bend minimal',
          'Focus on ankle stiffness and explosive power',
          'Continue for 1 minute'
        ]
      },
      {
        id: 'ex-042-7',
        name: 'Rest',
        duration: 30,
        steps: [
          'Stand or walk gently',
          'Focus on controlled breathing',
          'Prepare for next exercise',
          'Rest for 30 seconds'
        ]
      },
      {
        id: 'ex-042-8',
        name: 'Masai Jump',
        duration: 60,
        steps: [
          'Stand tall with feet hip-width apart',
          'Perform quick vertical hops',
          'Keep knee bend minimal',
          'Focus on ankle stiffness and explosive power',
          'Continue for 1 minute'
        ]
      }
    ]
  },
  // Hamstrings Exercise Routines
  {
    id: 'ex-044',
    name: 'Hamstrings 1',
    categoryId: 'hamstrings',
    durationMin: 6, // 30+60+30+60+60+30+60 = 330s = 5.5min, rounded to 6min
    difficulty: 'Beginner',
    impact: 'Low',
    icon: 'body',
    shortDescription: 'Basic hamstring flexibility routine.',
    benefits: ['Hamstring flexibility', 'Improved posture', 'Reduced tightness'],
    targetMuscles: ['Hamstrings', 'Calves', 'Glutes'],
    equipment: [],
    steps: [
      'Complete all 7 exercises in sequence',
      'Focus on proper form and breathing',
      'Hold each stretch for the specified duration',
      'Rest 10 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-044-1',
        name: 'Toe Touch',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Slowly bend forward from hips',
          'Reach toward toes with straight legs',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-044-2',
        name: 'Cross Leg Fold',
        duration: 60,
        steps: [
          'Stand with one leg crossed over the other',
          'Bend forward from hips',
          'Reach toward floor with hands',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-044-3',
        name: 'Wide Leg Bend',
        duration: 30,
        steps: [
          'Stand with legs wide apart',
          'Bend forward from hips',
          'Place hands on floor between feet',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-044-4',
        name: 'Side Lunge',
        duration: 60,
        steps: [
          'Step to the side with one leg',
          'Bend knee and lower hips',
          'Keep other leg straight',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-044-5',
        name: 'Reverse Lunge',
        duration: 60,
        steps: [
          'Step back with one leg',
          'Lower into lunge position',
          'Keep front knee over ankle',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-044-6',
        name: 'Seated Fold',
        duration: 30,
        steps: [
          'Sit with legs extended forward',
          'Bend forward from hips',
          'Reach toward toes',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-044-7',
        name: 'Hurdler',
        duration: 60,
        steps: [
          'Sit with one leg extended',
          'Other leg bent to side',
          'Bend forward over extended leg',
          'Hold for 30 seconds each side'
        ]
      }
    ]
  },
  {
    id: 'ex-045',
    name: 'Hamstrings 2',
    categoryId: 'hamstrings',
    durationMin: 10, // 30+60+30+60+60+30+60+30+60+30+60+60 = 570s = 9.5min, rounded to 10min
    difficulty: 'Inter',
    impact: 'Medium',
    icon: 'fitness',
    shortDescription: 'Inter hamstring flexibility routine.',
    benefits: ['Enhanced flexibility', 'Better mobility', 'Injury prevention'],
    targetMuscles: ['Hamstrings', 'Hip flexors', 'Lower back'],
    equipment: [],
    steps: [
      'Complete all 12 exercises in sequence',
      'Focus on deep breathing during stretches',
      'Hold each position for the full duration',
      'Rest 5 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-045-1',
        name: 'Toe Touch',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Slowly bend forward from hips',
          'Reach toward toes with straight legs',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-045-2',
        name: 'Cross Leg Fold',
        duration: 60,
        steps: [
          'Stand with one leg crossed over the other',
          'Bend forward from hips',
          'Reach toward floor with hands',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-045-3',
        name: 'Wide Leg Bend',
        duration: 30,
        steps: [
          'Stand with legs wide apart',
          'Bend forward from hips',
          'Place hands on floor between feet',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-045-4',
        name: 'Side Lunge',
        duration: 60,
        steps: [
          'Step to the side with one leg',
          'Bend knee and lower hips',
          'Keep other leg straight',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-045-5',
        name: 'Reverse Lunge',
        duration: 60,
        steps: [
          'Step back with one leg',
          'Lower into lunge position',
          'Keep front knee over ankle',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-045-6',
        name: 'Downward Dog',
        duration: 30,
        steps: [
          'Start in plank position',
          'Lift hips up and back',
          'Form inverted V shape',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-045-7',
        name: 'Pigeon',
        duration: 60,
        steps: [
          'Start in downward dog',
          'Bring one knee forward',
          'Extend other leg back',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-045-8',
        name: 'Seated Fold',
        duration: 30,
        steps: [
          'Sit with legs extended forward',
          'Bend forward from hips',
          'Reach toward toes',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-045-9',
        name: 'Hurdler',
        duration: 60,
        steps: [
          'Sit with one leg extended',
          'Other leg bent to side',
          'Bend forward over extended leg',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-045-10',
        name: 'Seated Straddle',
        duration: 30,
        steps: [
          'Sit with legs spread wide',
          'Bend forward from hips',
          'Reach toward center',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-045-11',
        name: 'Lying Figure Four',
        duration: 60,
        steps: [
          'Lie on back with knees bent',
          'Cross one ankle over opposite knee',
          'Pull knee toward chest',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-045-12',
        name: 'Lying Hamstring',
        duration: 60,
        steps: [
          'Lie on back with one leg extended',
          'Lift other leg straight up',
          'Hold behind thigh or calf',
          'Hold for 30 seconds each side'
        ]
      }
    ]
  },
  {
    id: 'ex-046',
    name: 'Hamstrings 3',
    categoryId: 'hamstrings',
    durationMin: 15,
    difficulty: 'Advanced',
    impact: 'High',
    icon: 'fitness',
    shortDescription: 'Comprehensive hamstring flexibility routine.',
    benefits: ['Maximum flexibility', 'Full body mobility', 'Advanced stretching'],
    targetMuscles: ['Hamstrings', 'Quads', 'Hip flexors', 'Lower back', 'Glutes'],
    equipment: [],
    steps: [
      'Complete all 19 exercises in sequence',
      'Focus on deep, controlled breathing',
      'Hold each stretch for the full duration',
      'Rest 3 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-046-1',
        name: 'Rag Doll',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Let arms hang loosely',
          'Bend forward from hips',
          'Hold relaxed position for 30 seconds'
        ]
      },
      {
        id: 'ex-046-2',
        name: 'Toe Touch',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Slowly bend forward from hips',
          'Reach toward toes with straight legs',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-046-3',
        name: 'Cross Leg Fold',
        duration: 60,
        steps: [
          'Stand with one leg crossed over the other',
          'Bend forward from hips',
          'Reach toward floor with hands',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-046-4',
        name: 'Standing Quad',
        duration: 60,
        steps: [
          'Stand on one leg',
          'Bend other knee, grab foot',
          'Pull heel toward glutes',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-046-5',
        name: 'Wide Leg Bend',
        duration: 30,
        steps: [
          'Stand with legs wide apart',
          'Bend forward from hips',
          'Place hands on floor between feet',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-046-6',
        name: 'Squat Stretch',
        duration: 30,
        steps: [
          'Stand with feet wider than hips',
          'Lower into deep squat',
          'Use elbows to push knees out',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-046-7',
        name: 'Reverse Lunge',
        duration: 60,
        steps: [
          'Step back with one leg',
          'Lower into lunge position',
          'Keep front knee over ankle',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-046-8',
        name: 'Side Lunge',
        duration: 60,
        steps: [
          'Step to the side with one leg',
          'Bend knee and lower hips',
          'Keep other leg straight',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-046-9',
        name: 'Kneeling Quad',
        duration: 60,
        steps: [
          'Kneel on one knee',
          'Grab back foot with hand',
          'Pull heel toward glutes',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-046-10',
        name: 'Cobra Stretch',
        duration: 30,
        steps: [
          'Lie face down on floor',
          'Place hands under shoulders',
          'Push up, arching back',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-046-11',
        name: 'Downward Dog',
        duration: 30,
        steps: [
          'Start in plank position',
          'Lift hips up and back',
          'Form inverted V shape',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-046-12',
        name: 'Lizard Pose',
        duration: 60,
        steps: [
          'Start in downward dog',
          'Step one foot forward',
          'Lower forearms to floor',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-046-13',
        name: 'Pigeon',
        duration: 60,
        steps: [
          'Start in downward dog',
          'Bring one knee forward',
          'Extend other leg back',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-046-14',
        name: 'Seated Fold',
        duration: 30,
        steps: [
          'Sit with legs extended forward',
          'Bend forward from hips',
          'Reach toward toes',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-046-15',
        name: 'Hurdler',
        duration: 60,
        steps: [
          'Sit with one leg extended',
          'Other leg bent to side',
          'Bend forward over extended leg',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-046-16',
        name: 'Quad Stretch',
        duration: 60,
        steps: [
          'Lie on stomach',
          'Bend one knee, grab foot',
          'Pull heel toward glutes',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-046-17',
        name: 'Seated Straddle',
        duration: 30,
        steps: [
          'Sit with legs spread wide',
          'Bend forward from hips',
          'Reach toward center',
          'Hold stretch for 30 seconds'
        ]
      },
      {
        id: 'ex-046-18',
        name: 'Lying Figure Four',
        duration: 60,
        steps: [
          'Lie on back with knees bent',
          'Cross one ankle over opposite knee',
          'Pull knee toward chest',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-046-19',
        name: 'Lying Hamstring',
        duration: 60,
        steps: [
          'Lie on back with one leg extended',
          'Lift other leg straight up',
          'Hold behind thigh or calf',
          'Hold for 30 seconds each side'
        ]
      }
    ]
  },
  // Shoulders Exercise Routines
  {
    id: 'ex-047',
    name: 'Shoulders 1',
    categoryId: 'shoulders',
    durationMin: 5, // 30+30+30+30+30+30+30+60 = 270s = 4.5min, rounded to 5min
    difficulty: 'Beginner',
    impact: 'Low',
    icon: 'body',
    shortDescription: 'A series of stretches designed to increase flexibility in the shoulders.',
    benefits: ['Shoulder mobility', 'Improved posture', 'Reduced tension'],
    targetMuscles: ['Delts', 'Rotator cuff', 'Upper back'],
    equipment: ['Wall'],
    steps: [
      'Complete all 8 exercises in sequence',
      'Focus on proper form and breathing',
      'Hold each stretch for the specified duration',
      'Rest 5 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-047-1',
        name: 'One Arm Hug',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Bring one arm across chest',
          'Use other arm to gently pull',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-047-2',
        name: 'Reverse Shoulder',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Reach one arm behind head',
          'Gently pull elbow with other hand',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-047-3',
        name: 'Overhead Tricep',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Reach one arm overhead',
          'Bend elbow, hand behind head',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-047-4',
        name: 'Wall Arms',
        duration: 30,
        steps: [
          'Stand facing wall',
          'Place forearms on wall',
          'Keep arms at 90 degrees',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-047-5',
        name: 'Forward Fold',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Bend forward from hips',
          'Let arms hang loosely',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-047-6',
        name: 'Wall Pecs',
        duration: 30,
        steps: [
          'Stand next to wall',
          'Place one arm on wall',
          'Gently lean forward',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-047-7',
        name: 'Diver',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Bend forward from hips',
          'Extend arms forward',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-047-8',
        name: 'Wall Dog',
        duration: 60,
        steps: [
          'Stand facing wall',
          'Place hands on wall',
          'Walk feet back',
          'Hold downward dog position for 60 seconds'
        ]
      }
    ]
  },
  {
    id: 'ex-048',
    name: 'Shoulders 2',
    categoryId: 'shoulders',
    durationMin: 6, // 60+30+30+60+30+30+30+30+30 = 330s = 5.5min, rounded to 6min
    difficulty: 'Inter',
    impact: 'Medium',
    icon: 'fitness',
    shortDescription: 'A series of stretches designed to increase flexibility in the shoulders.',
    benefits: ['Enhanced mobility', 'Better posture', 'Reduced shoulder tension'],
    targetMuscles: ['Delts', 'Rotator cuff', 'Upper back', 'Neck'],
    equipment: ['Wall'],
    steps: [
      'Complete all 9 exercises in sequence',
      'Focus on deep breathing during stretches',
      'Hold each position for the full duration',
      'Rest 5 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-048-1',
        name: 'Wall Pecs',
        duration: 60,
        steps: [
          'Stand next to wall',
          'Place one arm on wall',
          'Gently lean forward',
          'Hold for 1 minute each side'
        ]
      },
      {
        id: 'ex-048-2',
        name: 'Diver',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Bend forward from hips',
          'Extend arms forward',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-048-3',
        name: 'Wall Dog',
        duration: 30,
        steps: [
          'Stand facing wall',
          'Place hands on wall',
          'Walk feet back',
          'Hold downward dog position for 30 seconds'
        ]
      },
      {
        id: 'ex-048-4',
        name: 'Shoulder Rolls',
        duration: 60,
        steps: [
          'Stand with feet hip-width apart',
          'Place hands on shoulders',
          'Roll shoulders forward and back',
          'Complete 10 rolls each direction for 1 minute'
        ]
      },
      {
        id: 'ex-048-5',
        name: 'Neck Roll',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Slowly roll head in circles',
          'Keep movements gentle',
          'Complete 5 rolls each direction for 30 seconds'
        ]
      },
      {
        id: 'ex-048-6',
        name: 'Ear-to-Shoulder',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Gently tilt head to one side',
          'Use hand to apply gentle pressure',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-048-7',
        name: 'Cactus Arms',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Bend arms at 90 degrees',
          'Keep elbows at shoulder height',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-048-8',
        name: 'Bear Hug',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Cross arms over chest',
          'Give yourself a gentle hug',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-048-9',
        name: 'Cobra Stretch',
        duration: 30,
        steps: [
          'Lie face down on floor',
          'Place hands under shoulders',
          'Push up, arching back',
          'Hold for 30 seconds'
        ]
      }
    ]
  },
  // Chest Exercise Routines
  {
    id: 'ex-049',
    name: 'Chest 1',
    categoryId: 'chest',
    durationMin: 5, // 30+30+30+60+60+60 = 270s = 4.5min, rounded to 5min
    difficulty: 'Beginner',
    impact: 'Low',
    icon: 'body',
    shortDescription: 'Basic chest flexibility routine.',
    benefits: ['Chest mobility', 'Improved posture', 'Reduced tension'],
    targetMuscles: ['Pecs', 'Anterior delts', 'Upper back'],
    equipment: ['Wall'],
    steps: [
      'Complete all 6 exercises in sequence',
      'Focus on proper form and breathing',
      'Hold each stretch for the specified duration',
      'Rest 5 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-049-1',
        name: 'Arm Swings',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Swing arms forward and backward',
          'Keep movements controlled',
          'Complete for 30 seconds'
        ]
      },
      {
        id: 'ex-049-2',
        name: 'Chest Opener',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Clasp hands behind back',
          'Lift arms up and back',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-049-3',
        name: 'Overhead Tricep',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Reach one arm overhead',
          'Bend elbow, hand behind head',
          'Hold for 15 seconds each side'
        ]
      },
      {
        id: 'ex-049-4',
        name: 'One Arm Hug',
        duration: 60,
        steps: [
          'Stand with feet hip-width apart',
          'Bring one arm across chest',
          'Use other arm to gently pull',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-049-5',
        name: 'Wall Arms',
        duration: 60,
        steps: [
          'Stand facing wall',
          'Place forearms on wall',
          'Slide arms up and down',
          'Complete 8-10 reps'
        ]
      },
      {
        id: 'ex-049-6',
        name: 'Wall Pecs',
        duration: 60,
        steps: [
          'Stand next to wall',
          'Place one arm on wall',
          'Gently lean forward',
          'Hold for 30 seconds each side'
        ]
      }
    ]
  },
  {
    id: 'ex-050',
    name: 'Chest 2',
    categoryId: 'chest',
    durationMin: 6,
    difficulty: 'Inter',
    impact: 'Medium',
    icon: 'fitness',
    shortDescription: 'Inter chest flexibility routine.',
    benefits: ['Enhanced chest mobility', 'Better posture', 'Reduced chest tension'],
    targetMuscles: ['Pecs', 'Anterior delts', 'Upper back', 'Triceps'],
    equipment: ['Wall'],
    steps: [
      'Complete all 9 exercises in sequence',
      'Focus on deep breathing during stretches',
      'Hold each position for the full duration',
      'Rest 3 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-050-1',
        name: 'Arm Swings',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Swing arms forward and backward',
          'Keep movements controlled',
          'Complete for 30 seconds'
        ]
      },
      {
        id: 'ex-050-2',
        name: 'Chest Opener',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Clasp hands behind back',
          'Lift arms up and back',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-050-3',
        name: 'Overhead Tricep',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Reach one arm overhead',
          'Bend elbow, hand behind head',
          'Hold for 15 seconds each side'
        ]
      },
      {
        id: 'ex-050-4',
        name: 'One Arm Hug',
        duration: 60,
        steps: [
          'Stand with feet hip-width apart',
          'Bring one arm across chest',
          'Use other arm to gently pull',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-050-5',
        name: 'Wall Arms',
        duration: 60,
        steps: [
          'Stand facing wall',
          'Place forearms on wall',
          'Slide arms up and down slowly',
          'Complete 12-15 reps'
        ]
      },
      {
        id: 'ex-050-6',
        name: 'Wall Pecs',
        duration: 60,
        steps: [
          'Stand next to wall',
          'Place one arm on wall',
          'Gently lean forward',
          'Hold for 30 seconds each side'
        ]
      },
      {
        id: 'ex-050-7',
        name: 'Reverse Shoulder',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Reach one arm behind head',
          'Gently pull elbow with other hand',
          'Hold for 15 seconds each side'
        ]
      },
      {
        id: 'ex-050-8',
        name: 'Wall Dog',
        duration: 30,
        steps: [
          'Stand facing wall',
          'Place hands on wall',
          'Walk feet back',
          'Hold downward dog position for 30 seconds'
        ]
      },
      {
        id: 'ex-050-9',
        name: 'Cat Cow',
        duration: 30,
        steps: [
          'Start on all fours',
          'Arch back (cow pose)',
          'Round spine (cat pose)',
          'Alternate for 30 seconds'
        ]
      }
    ]
  },
  {
    id: 'ex-051',
    name: 'Chest 3',
    categoryId: 'chest',
    durationMin: 5,
    difficulty: 'Advanced',
    impact: 'High',
    icon: 'fitness',
    shortDescription: 'Advanced chest flexibility routine.',
    benefits: ['Maximum chest mobility', 'Full range of motion', 'Advanced stretching'],
    targetMuscles: ['Pecs', 'Anterior delts', 'Upper back', 'Triceps', 'Core', 'Spine'],
    equipment: ['Wall', 'Floor'],
    steps: [
      'Complete all 8 exercises in sequence',
      'Focus on deep, controlled breathing',
      'Hold each stretch for the full duration',
      'Rest 2 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-051-1',
        name: 'Wall Dog',
        duration: 30,
        steps: [
          'Stand facing wall',
          'Place hands on wall',
          'Walk feet back',
          'Hold downward dog position for 30 seconds'
        ]
      },
      {
        id: 'ex-051-2',
        name: 'Cat Cow',
        duration: 30,
        steps: [
          'Start on all fours',
          'Arch back (cow pose)',
          'Round spine (cat pose)',
          'Alternate for 30 seconds'
        ]
      },
      {
        id: 'ex-051-3',
        name: 'Thread the Needle',
        duration: 60,
        steps: [
          'Start on all fours',
          'Thread one arm under body',
          'Hold for 30 seconds each side',
          'Keep hips level'
        ]
      },
      {
        id: 'ex-051-4',
        name: 'Cobra Stretch',
        duration: 30,
        steps: [
          'Lie face down on floor',
          'Place hands under shoulders',
          'Push up, arching back',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-051-5',
        name: 'Puppy Pose',
        duration: 30,
        steps: [
          'Start on all fours',
          'Walk hands forward',
          'Lower chest toward floor',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-051-6',
        name: 'Camel Pose',
        duration: 30,
        steps: [
          'Kneel on floor',
          'Arch back and reach for heels',
          'Keep hips over knees',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-051-7',
        name: 'Seated Chest',
        duration: 30,
        steps: [
          'Sit cross-legged',
          'Clasp hands behind head',
          'Open elbows wide',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-051-8',
        name: 'Spinal Twist',
        duration: 60,
        steps: [
          'Sit with legs bent',
          'Twist torso to one side',
          'Hold for 30 seconds each side',
          'Keep spine straight'
        ]
      }
    ]
  },
  // Feet & Ankles Exercise Routines
  {
    id: 'ex-052',
    name: 'Feet & Ankles 1',
    categoryId: 'feet-ankles',
    durationMin: 5, // 30+30+30+30+30+60+60 = 270s = 4.5min, rounded to 5min
    difficulty: 'Beginner',
    impact: 'Low',
    icon: 'footsteps',
    shortDescription: 'Basic foot and ankle flexibility routine.',
    benefits: ['Foot mobility', 'Ankle flexibility', 'Improved balance'],
    targetMuscles: ['Calves', 'Ankles', 'Feet', 'Quads'],
    equipment: ['Wall'],
    steps: [
      'Complete all 7 exercises in sequence',
      'Focus on proper form and balance',
      'Hold each stretch for the specified duration',
      'Rest 5 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-052-1',
        name: 'Single Leg Stand',
        duration: 30,
        steps: [
          'Stand on one leg',
          'Keep other leg slightly bent',
          'Maintain balance',
          'Hold for 15 seconds each leg'
        ]
      },
      {
        id: 'ex-052-2',
        name: 'Ankle Circles',
        duration: 30,
        steps: [
          'Stand on one leg',
          'Lift other foot slightly',
          'Make circles with ankle',
          'Complete for 15 seconds each ankle'
        ]
      },
      {
        id: 'ex-052-3',
        name: 'Heel-to-Toe Rocks',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Rock forward onto toes',
          'Rock back onto heels',
          'Continue for 30 seconds'
        ]
      },
      {
        id: 'ex-052-4',
        name: 'Lateral Foot Rocks',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Rock weight to outside of feet',
          'Rock weight to inside of feet',
          'Continue for 30 seconds'
        ]
      },
      {
        id: 'ex-052-5',
        name: 'Knee Circles',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Place hands on knees',
          'Make circles with knees',
          'Complete for 30 seconds'
        ]
      },
      {
        id: 'ex-052-6',
        name: 'Soleus Stretch',
        duration: 60,
        steps: [
          'Stand facing wall',
          'Place one foot forward',
          'Bend both knees',
          'Hold for 30 seconds each leg'
        ]
      },
      {
        id: 'ex-052-7',
        name: 'Standing Quad',
        duration: 60,
        steps: [
          'Stand on one leg',
          'Bend other knee',
          'Hold foot behind you',
          'Hold for 30 seconds each leg'
        ]
      }
    ]
  },
  {
    id: 'ex-053',
    name: 'Feet & Ankles 2',
    categoryId: 'feet-ankles',
    durationMin: 9, // 30+30+30+30+30+60+60+60+60+60+30+30 = 510s = 8.5min, rounded to 9min
    difficulty: 'Inter',
    impact: 'Medium',
    icon: 'footsteps',
    shortDescription: 'Inter foot and ankle flexibility routine.',
    benefits: ['Enhanced foot mobility', 'Better ankle flexibility', 'Improved stability'],
    targetMuscles: ['Calves', 'Ankles', 'Feet', 'Quads', 'Toes'],
    equipment: ['Wall', 'Floor'],
    steps: [
      'Complete all 12 exercises in sequence',
      'Focus on deep breathing during stretches',
      'Hold each position for the full duration',
      'Rest 3 seconds between exercises'
    ],
    subExercises: [
      {
        id: 'ex-053-1',
        name: 'Single Leg Stand',
        duration: 30,
        steps: [
          'Stand on one leg',
          'Keep other leg slightly bent',
          'Maintain balance',
          'Hold for 15 seconds each leg'
        ]
      },
      {
        id: 'ex-053-2',
        name: 'Ankle Circles',
        duration: 30,
        steps: [
          'Stand on one leg',
          'Lift other foot slightly',
          'Make circles with ankle',
          'Complete for 15 seconds each ankle'
        ]
      },
      {
        id: 'ex-053-3',
        name: 'Heel-to-Toe Rocks',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Rock forward onto toes',
          'Rock back onto heels',
          'Continue for 30 seconds'
        ]
      },
      {
        id: 'ex-053-4',
        name: 'Lateral Foot Rocks',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Rock weight to outside of feet',
          'Rock weight to inside of feet',
          'Continue for 30 seconds'
        ]
      },
      {
        id: 'ex-053-5',
        name: 'Knee Circles',
        duration: 30,
        steps: [
          'Stand with feet hip-width apart',
          'Place hands on knees',
          'Make circles with knees',
          'Complete for 30 seconds'
        ]
      },
      {
        id: 'ex-053-6',
        name: 'Soleus Stretch',
        duration: 60,
        steps: [
          'Stand facing wall',
          'Place one foot forward',
          'Bend both knees',
          'Hold for 30 seconds each leg'
        ]
      },
      {
        id: 'ex-053-7',
        name: 'Leaning Calf',
        duration: 60,
        steps: [
          'Stand facing wall',
          'Place one foot forward',
          'Keep back leg straight',
          'Hold for 30 seconds each leg'
        ]
      },
      {
        id: 'ex-053-8',
        name: 'Toe-to-Wall',
        duration: 60,
        steps: [
          'Stand facing wall',
          'Place toes against wall',
          'Lean forward gently',
          'Hold for 30 seconds each foot'
        ]
      },
      {
        id: 'ex-053-9',
        name: 'Standing Quad',
        duration: 60,
        steps: [
          'Stand on one leg',
          'Bend other knee',
          'Hold foot behind you',
          'Hold for 30 seconds each leg'
        ]
      },
      {
        id: 'ex-053-10',
        name: 'Toe Stretch',
        duration: 60,
        steps: [
          'Kneel on floor',
          'Sit back on heels',
          'Stretch toes and feet',
          'Hold for 60 seconds'
        ]
      },
      {
        id: 'ex-053-11',
        name: 'Thunderbolt',
        duration: 30,
        steps: [
          'Kneel on floor',
          'Sit back on heels',
          'Keep spine straight',
          'Hold for 30 seconds'
        ]
      },
      {
        id: 'ex-053-12',
        name: 'Toe Squat',
        duration: 30,
        steps: [
          'Squat down on toes',
          'Keep heels off ground',
          'Maintain balance',
          'Hold for 30 seconds'
        ]
      }
    ]
  },
];

// Nutrition data for supplements and other categories
export const NUTRITION_CATEGORIES = [
  { id: 'supplements', name: 'Supplements', icon: 'medical' },
  { id: 'growth-foods', name: 'Growth Foods', icon: 'leaf' },
  { id: 'protein-sources', name: 'Protein Sources', icon: 'fish' },
  { id: 'calcium-rich', name: 'Calcium Rich', icon: 'water' }
];

export default { CATEGORIES, EXERCISES, NUTRITION_CATEGORIES };
