import { useState, useEffect } from "react";

const BRAND = {
  dark: "#1A1A1A",
  charcoal: "#2E2E2E",
  gold: "#C4A84A",
  white: "#FFFFFF",
  goldLight: "#D4B85A",
  goldDim: "#8A7030",
  success: "#4CAF82",
  warn: "#E07840",
};

const WEEKS = [
  { label: "Weeks 1–2", desc: "Base Building" },
  { label: "Weeks 3–4", desc: "Add Intervals" },
  { label: "Weeks 5–8", desc: "Build Strength" },
  { label: "Weeks 8–12", desc: "Peak Progress" },
];

const EXERCISES = {
  "Banded Chest Press": {
    emoji: "🏋️",
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
    emoji: "🦅",
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
    emoji: "🚣",
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
    emoji: "↔️",
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
    emoji: "💪",
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
    emoji: "🦾",
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
    emoji: "⬇️",
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
    emoji: "🙌",
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
    shoulderNote: "⚠️ Stop immediately if right shoulder aches. Reduce range of motion to pain-free zone only.",
  },
  "Banded Front Raises": {
    emoji: "⬆️",
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
    shoulderNote: "⚠️ Same caution as lateral raises. Pain-free range only for right shoulder.",
  },
  "Plank Hold (3 × 30s)": {
    emoji: "🧱",
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

const ROUTINES = [
  {
    id: "mon-fri",
    label: "Monday & Friday",
    tag: "Full Session",
    tagColor: BRAND.gold,
    tagTextColor: "#1A1A1A",
    icon: "🔥",
    desc: "Chest, back, and posture. Primary fat-burning and toning session.",
    spin: { time: "20–45 min" },
    exercises: [
      { name: "Banded Chest Press", sets: "3 × 12–15" },
      { name: "Banded Chest Fly", sets: "3 × 12–15" },
      { name: "Banded Row", sets: "3 × 12–15" },
      { name: "Banded Pull-Aparts", sets: "3 × 15" },
      { name: "Modified Push-Ups", sets: "3 × 8–12" },
    ],
    rest: "60–90 sec between sets",
    notes: "Rest 2–3 min between spin and bands. Hydrate.",
  },
  {
    id: "wed",
    label: "Wednesday",
    tag: "Light Session",
    tagColor: BRAND.goldDim,
    tagTextColor: "#fff",
    icon: "⚡",
    desc: "Arms, shoulders, and core. Active recovery — lighter load.",
    spin: { time: "20–45 min" },
    exercises: [
      { name: "Banded Bicep Curls", sets: "3 × 12–15" },
      { name: "Banded Tricep Pressdowns", sets: "3 × 12–15" },
      { name: "Banded Lateral Raises", sets: "3 × 12" },
      { name: "Banded Front Raises", sets: "3 × 12" },
      { name: "Plank Hold (3 × 30s)", sets: "3 × 20–30 sec" },
    ],
    rest: "60 sec between sets",
    notes: "Lighter resistance on shoulders. Stop if anything hurts.",
  },
  {
    id: "rest",
    label: "Tue / Thu / Sat / Sun",
    tag: "Rest Day",
    tagColor: "#444",
    tagTextColor: "#bbb",
    icon: "🚶",
    desc: "Full rest or light walk. Let the body repair and grow.",
    spin: null,
    exercises: [],
    rest: null,
    notes: "Light 15–20 min walk is fine. No bands. No spin.",
  },
];

const SCHEDULE = [
  { day: "MON", label: "Monday", type: "full", focus: "Spin + Chest/Back", spin: true, bands: ["Banded Chest Press","Banded Chest Fly","Banded Row","Banded Pull-Aparts","Modified Push-Ups"], color: BRAND.gold },
  { day: "TUE", label: "Tuesday", type: "rest", focus: "Rest / Light Walk", spin: false, bands: [], color: "#444" },
  { day: "WED", label: "Wednesday", type: "light", focus: "Spin + Active Recovery", spin: true, bands: ["Banded Bicep Curls","Banded Tricep Pressdowns","Banded Lateral Raises","Banded Front Raises","Plank Hold (3 × 30s)"], color: BRAND.goldDim },
  { day: "THU", label: "Thursday", type: "rest", focus: "Rest / Light Walk", spin: false, bands: [], color: "#444" },
  { day: "FRI", label: "Friday", type: "full", focus: "Spin + Chest/Back", spin: true, bands: ["Banded Chest Press","Banded Chest Fly","Banded Row","Banded Pull-Aparts","Modified Push-Ups"], color: BRAND.gold },
  { day: "SAT", label: "Saturday", type: "rest", focus: "Rest / Light Walk", spin: false, bands: [], color: "#444" },
  { day: "SUN", label: "Sunday", type: "rest", focus: "Full Rest", spin: false, bands: [], color: "#333" },
];

const SPIN_PHASES = [
  { weeks: "Wks 1–2", intervals: false, desc: "5 min warm-up → 10 min moderate → 5 min cool down", total: "20 min" },
  { weeks: "Wks 3–4", intervals: true, desc: "5 min warm-up → 6 rounds (1 min hard / 2 min easy) → 5 min cool down", total: "~26 min" },
  { weeks: "Wks 5+", intervals: true, desc: "Build to 30–45 min. Increase intensity or add steady-state time.", total: "30–45 min" },
];

const todayIndex = new Date().getDay();
const dayMap = [6, 0, 1, 2, 3, 4, 5];
function getKey(wo, di) { return `session_w${wo}_d${di}`; }

const TABS = [["today","Today"],["week","Week"],["routines","Routines"],["form","Form"],["spin","Spin"],["notes","Notes"]];

const s = { fontSize: 13, color: "#bbb", lineHeight: 1.7 };

function FormDetail({ exName, onBack }) {
  const ex = EXERCISES[exName];
  return (
    <div style={{ minHeight: "100vh", background: BRAND.dark, color: BRAND.white, fontFamily: "'Georgia', serif", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ background: BRAND.charcoal, padding: "16px 20px", borderBottom: `2px solid ${BRAND.gold}`, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: BRAND.gold, fontSize: 22, cursor: "pointer", padding: 0 }}>←</button>
        <div>
          <div style={{ fontSize: 10, color: "#888", letterSpacing: 2, textTransform: "uppercase" }}>Form Guide</div>
          <div style={{ fontSize: 17, fontWeight: "bold" }}>{ex.emoji} {exName}</div>
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ padding: "4px 12px", background: BRAND.goldDim, borderRadius: 20, fontSize: 11, letterSpacing: 1 }}>{ex.muscle}</span>
          <span style={{ padding: "4px 12px", background: "#333", borderRadius: 20, fontSize: 11, color: "#bbb" }}>{ex.sets}</span>
        </div>
        <div style={{ background: BRAND.charcoal, borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: BRAND.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Setup</div>
          <div style={s}>{ex.setup}</div>
        </div>
        <div style={{ background: BRAND.charcoal, borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: BRAND.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Steps</div>
          {ex.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: BRAND.goldDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: "bold", flexShrink: 0, color: BRAND.dark }}>{i + 1}</div>
              <div style={s}>{step}</div>
            </div>
          ))}
        </div>
        <div style={{ background: BRAND.charcoal, borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: BRAND.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Coaching Cues</div>
          {ex.cues.map((cue, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ color: BRAND.gold, flexShrink: 0 }}>›</span>
              <div style={s}>{cue}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px", background: "#2a1a0a", border: `1px solid ${BRAND.warn}`, borderRadius: 10, fontSize: 12, color: BRAND.warn }}>
          ⚠️ Shoulder Note: {ex.shoulderNote}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("today");
  const [weekOffset, setWeekOffset] = useState(0);
  const [completed, setCompleted] = useState(() => { try { return JSON.parse(localStorage.getItem("hcpa_fitness") || "{}"); } catch { return {}; } });
  const [spinPhase, setSpinPhase] = useState(0);
  const [notes, setNotes] = useState(() => { try { return JSON.parse(localStorage.getItem("hcpa_notes") || "{}"); } catch { return {}; } });
  const [noteInput, setNoteInput] = useState("");
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerVal, setTimerVal] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => { localStorage.setItem("hcpa_fitness", JSON.stringify(completed)); }, [completed]);
  useEffect(() => { localStorage.setItem("hcpa_notes", JSON.stringify(notes)); }, [notes]);
  useEffect(() => {
    let interval;
    if (timerRunning) interval = setInterval(() => setTimerVal(v => v + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const toggleComplete = (key) => setCompleted(prev => ({ ...prev, [key]: !prev[key] }));
  const weekSessions = SCHEDULE.filter(d => d.type !== "rest");
  const totalPossible = weekSessions.length;
  const weekCompleted = weekSessions.filter((_, i) => completed[getKey(weekOffset, SCHEDULE.indexOf(weekSessions[i]))]).length;
  const fmt = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  const todaySchedule = SCHEDULE[dayMap[todayIndex]];
  const totalSessions = Object.values(completed).filter(Boolean).length;
  const pct = Math.round((weekCompleted / totalPossible) * 100);
  const saveNote = () => {
    if (!noteInput.trim()) return;
    const key = new Date().toLocaleDateString();
    setNotes(prev => ({ ...prev, [key]: [...(prev[key] || []), noteInput.trim()] }));
    setNoteInput("");
  };

  if (selectedExercise) return <FormDetail exName={selectedExercise} onBack={() => setSelectedExercise(null)} />;

  const FormBtn = ({ name }) => (
    <button onClick={() => setSelectedExercise(name)} style={{ padding: "3px 10px", background: "none", border: `1px solid ${BRAND.goldDim}`, borderRadius: 20, color: BRAND.gold, fontSize: 10, cursor: "pointer", letterSpacing: 1, flexShrink: 0 }}>FORM</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: BRAND.dark, color: BRAND.white, fontFamily: "'Georgia', serif", maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: BRAND.charcoal, padding: "16px 20px 0", borderBottom: `2px solid ${BRAND.gold}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 8, height: 28, background: BRAND.gold, borderRadius: 2 }} />
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: BRAND.gold, textTransform: "uppercase" }}>Heyward CPA</div>
            <div style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 1 }}>Upper Body Tracker</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#888" }}>Sessions</div>
            <div style={{ fontSize: 22, color: BRAND.gold, fontWeight: "bold" }}>{totalSessions}</div>
          </div>
        </div>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none", marginTop: 10 }}>
          {TABS.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ flexShrink: 0, padding: "10px 14px", border: "none", background: "transparent", color: tab === id ? BRAND.gold : "#666", fontFamily: "inherit", fontSize: 11, letterSpacing: 1, cursor: "pointer", borderBottom: tab === id ? `2px solid ${BRAND.gold}` : "2px solid transparent", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: 20 }}>

        {/* TODAY */}
        {tab === "today" && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase" }}>Today</div>
              <div style={{ fontSize: 22, fontWeight: "bold", color: BRAND.gold }}>{todaySchedule.focus}</div>
              <span style={{ display: "inline-block", marginTop: 6, padding: "3px 10px", background: todaySchedule.type === "rest" ? "#333" : BRAND.goldDim, borderRadius: 20, fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>
                {todaySchedule.type === "rest" ? "Rest Day" : todaySchedule.type === "full" ? "Full Session" : "Light Session"}
              </span>
            </div>
            {todaySchedule.type !== "rest" ? (
              <>
                <div style={{ background: BRAND.charcoal, borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${BRAND.goldDim}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: BRAND.gold }}>🚴 Spin Bike</div>
                    <button onClick={() => toggleComplete(getKey(weekOffset, dayMap[todayIndex]) + "_spin")} style={{ padding: "5px 14px", borderRadius: 20, border: "none", background: completed[getKey(weekOffset, dayMap[todayIndex]) + "_spin"] ? BRAND.success : "#444", color: BRAND.white, fontSize: 11, cursor: "pointer" }}>
                      {completed[getKey(weekOffset, dayMap[todayIndex]) + "_spin"] ? "✓ Done" : "Mark Done"}
                    </button>
                  </div>
                  <div style={s}>{SPIN_PHASES[spinPhase].desc}</div>
                  <div style={{ marginTop: 6, fontSize: 11, color: BRAND.gold }}>{SPIN_PHASES[spinPhase].total}</div>
                </div>
                <div style={{ background: BRAND.charcoal, borderRadius: 12, padding: 16, border: "1px solid #3a3a3a" }}>
                  <div style={{ fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: BRAND.gold, marginBottom: 12 }}>💪 Resistance Bands — 3 × 12–15</div>
                  {todaySchedule.bands.map((ex, i) => {
                    const key = getKey(weekOffset, dayMap[todayIndex]) + `_ex${i}`;
                    return (
                      <div key={ex} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < todaySchedule.bands.length - 1 ? "1px solid #3a3a3a" : "none" }}>
                        <div onClick={() => toggleComplete(key)} style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${completed[key] ? BRAND.success : BRAND.goldDim}`, background: completed[key] ? BRAND.success : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "all 0.2s" }}>
                          {completed[key] && <span style={{ fontSize: 11 }}>✓</span>}
                        </div>
                        <div onClick={() => toggleComplete(key)} style={{ flex: 1, fontSize: 14, color: completed[key] ? "#666" : BRAND.white, textDecoration: completed[key] ? "line-through" : "none", cursor: "pointer" }}>{ex}</div>
                        <FormBtn name={ex} />
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 12, padding: "10px 14px", background: "#2a1a0a", border: `1px solid ${BRAND.warn}`, borderRadius: 8, fontSize: 12, color: BRAND.warn }}>
                  ⚠️ Stop immediately if right shoulder hurts. Pain ≠ progress.
                </div>
              </>
            ) : (
              <div style={{ background: BRAND.charcoal, borderRadius: 12, padding: 30, textAlign: "center", border: "1px solid #333" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>😴</div>
                <div style={{ fontSize: 16, color: "#888" }}>Rest & recover today.</div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 6 }}>Light walk optional.</div>
              </div>
            )}
          </div>
        )}

        {/* WEEK */}
        {tab === "week" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <button onClick={() => setWeekOffset(w => Math.max(0, w - 1))} style={{ background: "#333", border: "none", color: BRAND.white, padding: "6px 14px", borderRadius: 20, cursor: "pointer" }}>← Prev</button>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, color: BRAND.gold }}>Week {weekOffset + 1}</div>
                <div style={{ fontSize: 11, color: "#666" }}>{weekCompleted}/{totalPossible} sessions</div>
              </div>
              <button onClick={() => setWeekOffset(w => w + 1)} style={{ background: "#333", border: "none", color: BRAND.white, padding: "6px 14px", borderRadius: 20, cursor: "pointer" }}>Next →</button>
            </div>
            <div style={{ height: 6, background: "#333", borderRadius: 3, marginBottom: 18, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: BRAND.gold, borderRadius: 3, transition: "width 0.4s" }} />
            </div>
            {SCHEDULE.map((day, idx) => {
              const key = getKey(weekOffset, idx);
              const isDone = completed[key];
              const isToday = idx === dayMap[todayIndex] && weekOffset === 0;
              return (
                <div key={day.day} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", marginBottom: 8, background: isToday ? "#2a2510" : BRAND.charcoal, borderRadius: 10, border: `1px solid ${isToday ? BRAND.gold : "#333"}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: day.type === "rest" ? "#333" : isDone ? BRAND.success : day.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: "bold", flexShrink: 0, color: BRAND.dark }}>
                    {isDone ? "✓" : day.day}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: "bold" }}>{day.label}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{day.focus}</div>
                  </div>
                  {day.type !== "rest" && (
                    <button onClick={() => toggleComplete(key)} style={{ padding: "4px 12px", borderRadius: 20, border: "none", background: isDone ? BRAND.success : "#444", color: BRAND.white, fontSize: 11, cursor: "pointer" }}>
                      {isDone ? "✓" : "Log"}
                    </button>
                  )}
                </div>
              );
            })}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: "#666", textTransform: "uppercase", marginBottom: 10 }}>Progress Phases</div>
              {WEEKS.map((w, i) => (
                <div key={w.label} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #2a2a2a" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: i <= Math.min(weekOffset / 2, 3) ? BRAND.gold : "#444", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: BRAND.gold }}>{w.label}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{w.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROUTINES */}
        {tab === "routines" && (
          <div>
            <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Your Program</div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: BRAND.gold, marginBottom: 20 }}>Weekly Routines</div>
            {ROUTINES.map((routine) => (
              <div key={routine.id} style={{ background: BRAND.charcoal, borderRadius: 14, marginBottom: 16, border: "1px solid #3a3a3a", overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #3a3a3a", background: routine.id === "rest" ? "#282828" : "#2a2510" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, marginRight: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>{routine.icon} {routine.label}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{routine.desc}</div>
                    </div>
                    <span style={{ padding: "3px 10px", background: routine.tagColor, borderRadius: 20, fontSize: 10, color: routine.tagTextColor, letterSpacing: 1, flexShrink: 0 }}>{routine.tag}</span>
                  </div>
                </div>
                {routine.exercises.length > 0 ? (
                  <div style={{ padding: 16 }}>
                    {routine.spin && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #3a3a3a", marginBottom: 4 }}>
                        <div style={{ fontSize: 13 }}>🚴 Spin Bike</div>
                        <div style={{ fontSize: 12, color: BRAND.gold }}>{routine.spin.time}</div>
                      </div>
                    )}
                    {routine.exercises.map((ex, i) => (
                      <div key={ex.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < routine.exercises.length - 1 ? "1px solid #333" : "none" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14 }}>{EXERCISES[ex.name]?.emoji} {ex.name}</div>
                          <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{EXERCISES[ex.name]?.muscle}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ fontSize: 11, color: BRAND.gold }}>{ex.sets}</div>
                          <FormBtn name={ex.name} />
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, padding: "8px 12px", background: "#1e1e1e", borderRadius: 8, fontSize: 11, color: "#777", borderLeft: `3px solid ${BRAND.goldDim}` }}>
                      {routine.rest && <div>⏱ Rest: {routine.rest}</div>}
                      <div style={{ marginTop: routine.rest ? 4 : 0 }}>💡 {routine.notes}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: 16, fontSize: 13, color: "#666" }}>🚶 {routine.notes}</div>
                )}
              </div>
            ))}
            <div style={{ background: BRAND.charcoal, borderRadius: 12, padding: 16, border: "1px solid #3a3a3a" }}>
              <div style={{ fontSize: 11, color: BRAND.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Key Principles</div>
              {[
                ["Progressive Overload", "Increase band resistance every 2–3 weeks as it gets easier."],
                ["Spin First", "Always spin before bands. Fat burning mode first."],
                ["Posture Matters", "Good posture makes chest fat look better immediately."],
                ["Pain vs. Discomfort", "Muscle burn = OK. Joint pain = stop."],
                ["Diet Is 70%", "Chest fat responds most to caloric deficit."],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <span style={{ color: BRAND.gold, flexShrink: 0 }}>›</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: "bold" }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FORM GUIDE */}
        {tab === "form" && (
          <div>
            <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Reference</div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: BRAND.gold, marginBottom: 6 }}>Form Guide</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Tap any exercise for setup, steps, coaching cues, and shoulder safety notes.</div>
            {[
              { label: "Chest & Back", emoji: "🏋️", keys: ["Banded Chest Press","Banded Chest Fly","Banded Row","Banded Pull-Aparts","Modified Push-Ups"] },
              { label: "Arms & Shoulders", emoji: "💪", keys: ["Banded Bicep Curls","Banded Tricep Pressdowns","Banded Lateral Raises","Banded Front Raises"] },
              { label: "Core", emoji: "🧱", keys: ["Plank Hold (3 × 30s)"] },
            ].map(group => (
              <div key={group.label} style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: "#666", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{group.emoji} {group.label}</div>
                {group.keys.map(exName => {
                  const ex = EXERCISES[exName];
                  return (
                    <div key={exName} onClick={() => setSelectedExercise(exName)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", marginBottom: 8, background: BRAND.charcoal, borderRadius: 10, border: "1px solid #333", cursor: "pointer" }}>
                      <div style={{ fontSize: 22, flexShrink: 0 }}>{ex.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: "bold" }}>{exName}</div>
                        <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{ex.muscle} · {ex.sets}</div>
                      </div>
                      <div style={{ color: BRAND.goldDim, fontSize: 20 }}>›</div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div style={{ padding: "12px 16px", background: "#2a1a0a", border: `1px solid ${BRAND.warn}`, borderRadius: 10, fontSize: 12, color: BRAND.warn }}>
              ⚠️ Right shoulder not yet evaluated. Stop any exercise that causes joint pain. Muscle burn is fine — sharp or deep pain is not.
            </div>
          </div>
        )}

        {/* SPIN */}
        {tab === "spin" && (
          <div>
            <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Cardio</div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: BRAND.gold, marginBottom: 20 }}>Spin Bike Protocol</div>
            {SPIN_PHASES.map((phase, i) => (
              <div key={phase.weeks} onClick={() => setSpinPhase(i)} style={{ padding: 16, marginBottom: 10, borderRadius: 12, background: spinPhase === i ? "#2a2510" : BRAND.charcoal, border: `1px solid ${spinPhase === i ? BRAND.gold : "#333"}`, cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 13, color: BRAND.gold, fontWeight: "bold" }}>{phase.weeks}</div>
                  <div style={{ fontSize: 11, background: spinPhase === i ? BRAND.gold : "#444", color: spinPhase === i ? BRAND.dark : "#888", padding: "3px 10px", borderRadius: 20 }}>{phase.total}</div>
                </div>
                <div style={s}>{phase.desc}</div>
                {phase.intervals && <div style={{ marginTop: 8, fontSize: 11, color: BRAND.goldDim }}>↑ Interval training — push hard, recover easy</div>}
              </div>
            ))}
            <div style={{ marginTop: 20, background: BRAND.charcoal, borderRadius: 12, padding: 20, textAlign: "center", border: "1px solid #3a3a3a" }}>
              <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Session Timer</div>
              <div style={{ fontSize: 48, fontFamily: "monospace", color: BRAND.gold, letterSpacing: 4, marginBottom: 16 }}>{fmt(timerVal)}</div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={() => setTimerRunning(r => !r)} style={{ padding: "10px 24px", borderRadius: 24, border: "none", background: timerRunning ? BRAND.warn : BRAND.gold, color: BRAND.dark, fontWeight: "bold", fontSize: 13, cursor: "pointer" }}>
                  {timerRunning ? "Pause" : "Start"}
                </button>
                <button onClick={() => { setTimerRunning(false); setTimerVal(0); }} style={{ padding: "10px 24px", borderRadius: 24, border: "1px solid #555", background: "transparent", color: "#888", fontSize: 13, cursor: "pointer" }}>Reset</button>
              </div>
            </div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#0a1a0f", border: `1px solid ${BRAND.success}`, borderRadius: 8, fontSize: 12, color: BRAND.success }}>
              💡 Sit tall. Don't hunch. Hydrate before, during, and after. Resistance up = more calorie burn.
            </div>
          </div>
        )}

        {/* NOTES */}
        {tab === "notes" && (
          <div>
            <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Journal</div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: BRAND.gold, marginBottom: 16 }}>Session Notes</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input value={noteInput} onChange={e => setNoteInput(e.target.value)} onKeyDown={e => e.key === "Enter" && saveNote()} placeholder="How'd it go today?" style={{ flex: 1, padding: "10px 14px", background: BRAND.charcoal, border: "1px solid #444", borderRadius: 8, color: BRAND.white, fontFamily: "inherit", fontSize: 13, outline: "none" }} />
              <button onClick={saveNote} style={{ padding: "10px 16px", background: BRAND.gold, border: "none", borderRadius: 8, color: BRAND.dark, fontWeight: "bold", cursor: "pointer", fontSize: 16 }}>+</button>
            </div>
            {Object.keys(notes).length === 0 ? (
              <div style={{ textAlign: "center", color: "#555", padding: 30, fontSize: 14 }}>No notes yet. Log your first session!</div>
            ) : (
              Object.entries(notes).reverse().map(([date, entries]) => (
                <div key={date} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: BRAND.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{date}</div>
                  {entries.map((note, i) => (
                    <div key={i} style={{ padding: "10px 14px", background: BRAND.charcoal, borderRadius: 8, marginBottom: 6, fontSize: 13, borderLeft: `3px solid ${BRAND.goldDim}`, color: "#ccc" }}>{note}</div>
                  ))}
                </div>
              ))
            )}
            <div style={{ marginTop: 20, padding: 16, background: BRAND.charcoal, borderRadius: 12, border: "1px solid #3a3a3a" }}>
              <div style={{ fontSize: 13, color: BRAND.gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>⚖️ Weight Goal</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#888" }}>Goal</span>
                <span style={{ fontSize: 13, color: BRAND.gold }}>–30 lbs by August</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#888" }}>Sessions logged</span>
                <span style={{ fontSize: 13, color: BRAND.success }}>{totalSessions} total</span>
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: "#555", fontStyle: "italic" }}>Consistency is the only cheat code. Keep showing up.</div>
            </div>
          </div>
        )}

      </div>
      <div style={{ height: 30 }} />
    </div>
  );
}
