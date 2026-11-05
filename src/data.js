// Program content: exercises, weekly schedule, spin protocol and phases.

export const EXERCISES = {
  "Banded Chest Press": {
    muscle: "Chest",
    sets: "3 × 12–15",
    setup: "Anchor band at mid-back height behind you or loop around a sturdy post.",
    steps: [
      "Stand with feet shoulder-width apart, slight bend in knees.",
      "Hold handles at chest level, elbows out at roughly 45°.",
      "Press forward until arms are nearly straight — don't lock elbows.",
      "Slowly return to start. Control the band on the way back.",
    ],
    cues: ["Keep chest up, don't hunch forward", "Squeeze chest at full extension", "Breathe out on the press"],
    shoulderNote: "Keep elbows at 45° — not flared wide. Protects the shoulder joint.",
  },
  "Banded Chest Fly": {
    muscle: "Chest / Inner Chest",
    sets: "3 × 12–15",
    setup: "Anchor band behind you at shoulder height. One handle in each hand.",
    steps: [
      "Stand tall, arms extended out to sides, slight bend in elbows.",
      "Bring hands together in front of your chest in a hugging arc.",
      "Squeeze chest hard at the center.",
      "Slowly open arms back to start position.",
    ],
    cues: ["Think 'hugging a big tree'", "Keep a soft bend in elbows throughout", "Don't let arms go behind your body line"],
    shoulderNote: "Stop if you feel pulling in front of shoulder. Reduce range of motion if needed.",
  },
  "Banded Row": {
    muscle: "Upper Back / Posture",
    sets: "3 × 12–15",
    setup: "Anchor band in front of you at waist height. Stand or sit facing anchor.",
    steps: [
      "Hold handles, arms extended, slight lean back.",
      "Pull handles to your waist, driving elbows back behind you.",
      "Squeeze shoulder blades together at the end.",
      "Slowly extend arms back to start.",
    ],
    cues: ["Lead with elbows, not hands", "Keep back straight — don't round forward", "Shoulders stay down, away from ears"],
    shoulderNote: "Great for shoulder health. Keep movement controlled — no jerking.",
  },
  "Banded Pull-Aparts": {
    muscle: "Rear Deltoids / Posture",
    sets: "3 × 15",
    setup: "Hold band with both hands in front of you at chest height, hands shoulder-width apart.",
    steps: [
      "Stand tall, arms straight at chest level holding band.",
      "Pull band apart horizontally, spreading arms wide.",
      "Bring shoulder blades together at full stretch.",
      "Slowly return hands to center.",
    ],
    cues: ["Keep arms at chest height — not drifting up or down", "Full stretch = hands past your sides", "Light band — this is a posture move, not a power move"],
    shoulderNote: "One of the safest shoulder exercises. Great for fixing posture and reducing chest fat appearance.",
  },
  "Modified Push-Ups": {
    muscle: "Chest / Triceps / Core",
    sets: "3 × 8–12",
    setup: "No equipment. Find a clear floor space.",
    steps: [
      "Start on hands and knees. Walk hands forward until body is at an angle.",
      "Lower chest toward floor, elbows at 45° angle from body.",
      "Push back up to start without locking elbows.",
      "Build toward full push-up over 4–6 weeks.",
    ],
    cues: ["Don't let hips sag or pike up", "Look slightly ahead, not straight down", "Full range: chest nearly touches floor"],
    shoulderNote: "Knee version keeps shoulder load manageable. Progress to full push-up when ready.",
  },
  "Banded Bicep Curls": {
    muscle: "Biceps",
    sets: "3 × 12–15",
    setup: "Stand on center of band, one handle in each hand, palms facing forward.",
    steps: [
      "Start with arms at sides, palms facing up.",
      "Curl hands toward shoulders, keeping elbows pinned to sides.",
      "Squeeze biceps at the top.",
      "Slowly lower back to start.",
    ],
    cues: ["Elbows stay still — only forearms move", "Don't swing or lean back", "Full extension at the bottom"],
    shoulderNote: "Safe for both shoulder and elbow. Keep it controlled.",
  },
  "Banded Tricep Pressdowns": {
    muscle: "Triceps",
    sets: "3 × 12–15",
    setup: "Anchor band above head height (door, pull-up bar). Hold handle with both hands.",
    steps: [
      "Stand facing anchor, elbows bent at sides at 90°.",
      "Press handles down until arms are straight.",
      "Squeeze triceps at the bottom.",
      "Slowly return to 90°.",
    ],
    cues: ["Keep elbows pinned to your sides — they don't move", "Don't lean forward excessively", "Controlled tempo — 2 sec down, 2 sec up"],
    shoulderNote: "Elbow stays stable. Very low shoulder stress.",
  },
  "Banded Lateral Raises": {
    muscle: "Side Deltoids",
    sets: "3 × 12",
    setup: "Stand on center of band, handle in each hand at sides.",
    steps: [
      "Start with hands at sides, slight bend in elbows.",
      "Raise arms out to the sides up to shoulder height — no higher.",
      "Hold briefly at the top.",
      "Slowly lower back to sides.",
    ],
    cues: ["Lead with elbows, not hands", "Stop at shoulder height — going higher stresses the joint", "Use lightest band available"],
    shoulderNote: "Stop immediately if right shoulder aches. Reduce range of motion to pain-free zone only.",
  },
  "Banded Front Raises": {
    muscle: "Front Deltoids",
    sets: "3 × 12",
    setup: "Stand on center of band, both hands holding one handle or handles together.",
    steps: [
      "Start with hands in front of thighs, palms facing down.",
      "Raise arms forward to shoulder height.",
      "Hold briefly.",
      "Slowly lower back down.",
    ],
    cues: ["Keep core tight — don't arch your lower back", "Stop at shoulder height", "Slight bend in elbows throughout"],
    shoulderNote: "Same caution as lateral raises. Pain-free range only for right shoulder.",
  },
  "Plank Hold (3 × 30s)": {
    muscle: "Core / Posture",
    sets: "3 × 20–30 sec",
    setup: "No equipment. Floor space.",
    steps: [
      "Start on forearms and toes (or knees to modify).",
      "Body forms a straight line from head to heels.",
      "Hold position, breathing steadily.",
      "Don't let hips sag or rise.",
    ],
    cues: ["Squeeze glutes and abs the whole time", "Look down at the floor — neutral neck", "Breathe. Don't hold your breath."],
    shoulderNote: "Keep forearms on floor — takes pressure off shoulder vs. straight-arm plank.",
  },
};

const FULL_BANDS = ["Banded Chest Press", "Banded Chest Fly", "Banded Row", "Banded Pull-Aparts", "Modified Push-Ups"];
const LIGHT_BANDS = ["Banded Bicep Curls", "Banded Tricep Pressdowns", "Banded Lateral Raises", "Banded Front Raises", "Plank Hold (3 × 30s)"];

export const ROUTINES = [
  {
    id: "mon-fri",
    label: "Monday & Friday",
    tag: "Full session",
    desc: "Chest, back, and posture. Primary fat-burning and toning session.",
    spin: { time: "20–45 min" },
    exercises: FULL_BANDS,
    rest: "60–90 sec between sets",
    notes: "Rest 2–3 min between spin and bands. Hydrate.",
  },
  {
    id: "wed",
    label: "Wednesday",
    tag: "Light session",
    desc: "Arms, shoulders, and core. Active recovery — lighter load.",
    spin: { time: "20–45 min" },
    exercises: LIGHT_BANDS,
    rest: "60 sec between sets",
    notes: "Lighter resistance on shoulders. Stop if anything hurts.",
  },
  {
    id: "rest",
    label: "Tue / Thu / Sat / Sun",
    tag: "Rest day",
    desc: "Full rest or light walk. Let the body repair and grow.",
    spin: null,
    exercises: [],
    rest: null,
    notes: "Light 15–20 min walk is fine. No bands. No spin.",
  },
];

// Index 0 = Monday, matching weekdayIndex() in dates.js.
export const SCHEDULE = [
  { day: "Mon", label: "Monday", type: "full", focus: "Spin + Chest/Back", spin: true, bands: FULL_BANDS },
  { day: "Tue", label: "Tuesday", type: "rest", focus: "Rest / Light Walk", spin: false, bands: [] },
  { day: "Wed", label: "Wednesday", type: "light", focus: "Spin + Active Recovery", spin: true, bands: LIGHT_BANDS },
  { day: "Thu", label: "Thursday", type: "rest", focus: "Rest / Light Walk", spin: false, bands: [] },
  { day: "Fri", label: "Friday", type: "full", focus: "Spin + Chest/Back", spin: true, bands: FULL_BANDS },
  { day: "Sat", label: "Saturday", type: "rest", focus: "Rest / Light Walk", spin: false, bands: [] },
  { day: "Sun", label: "Sunday", type: "rest", focus: "Full Rest", spin: false, bands: [] },
];

export const SESSIONS_PER_WEEK = SCHEDULE.filter((d) => d.type !== "rest").length;

// Program phases by program week (1-based, inclusive).
export const PHASES = [
  { label: "Weeks 1–2", desc: "Base building", from: 1, to: 2 },
  { label: "Weeks 3–4", desc: "Add intervals", from: 3, to: 4 },
  { label: "Weeks 5–8", desc: "Build strength", from: 5, to: 8 },
  { label: "Weeks 9–12", desc: "Peak progress", from: 9, to: 12 },
];

export const SPIN_PHASES = [
  { weeks: "Weeks 1–2", from: 1, intervals: false, desc: "5 min warm-up → 10 min moderate → 5 min cool down", total: "20 min" },
  { weeks: "Weeks 3–4", from: 3, intervals: true, desc: "5 min warm-up → 6 rounds (1 min hard / 2 min easy) → 5 min cool down", total: "~26 min" },
  { weeks: "Weeks 5+", from: 5, intervals: true, desc: "Build to 30–45 min. Increase intensity or add steady-state time.", total: "30–45 min" },
];

export function spinPhaseForWeek(programWeek) {
  let idx = 0;
  SPIN_PHASES.forEach((p, i) => { if (programWeek >= p.from) idx = i; });
  return idx;
}

export const FORM_GROUPS = [
  { label: "Chest & Back", keys: FULL_BANDS },
  { label: "Arms & Shoulders", keys: LIGHT_BANDS.slice(0, 4) },
  { label: "Core", keys: ["Plank Hold (3 × 30s)"] },
];
