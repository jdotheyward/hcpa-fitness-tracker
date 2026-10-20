import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import { EXERCISES, FORM_GROUPS, PHASES, ROUTINES, SCHEDULE, SESSIONS_PER_WEEK, SPIN_PHASES, spinPhaseForWeek } from "./data";
import { addDays, formatLong, formatShort, formatWeekRange, programWeek, startOfWeek, todayISO } from "./dates";
import {
  completedDates, exportBackup, isSessionComplete, loadState, mergeBackup, newNoteId,
  planFor, requestPersistentStorage, saveState, sessionProgress,
} from "./storage";

const TABS = [["today", "Today"], ["week", "Week"], ["history", "History"], ["routines", "Routines"], ["form", "Form"], ["spin", "Spin"], ["notes", "Notes"]];
const TYPE_LABEL = { full: "Full session", light: "Light session", rest: "Rest day" };
const BACKUP_REMINDER_DAYS = 30;

// Re-evaluate "today" when the app stays open past midnight or returns from the background.
function useToday() {
  const [today, setToday] = useState(todayISO);
  useEffect(() => {
    const refresh = () => setToday(todayISO());
    const interval = setInterval(refresh, 60000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return today;
}

// Timestamp-based so it stays accurate when the phone locks or the tab is throttled.
function useStopwatch() {
  const [state, setState] = useState({ running: false, startedAt: 0, base: 0 });
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!state.running) return undefined;
    const id = setInterval(() => setTick((t) => t + 1), 250);
    return () => clearInterval(id);
  }, [state.running]);
  const elapsed = state.base + (state.running ? Date.now() - state.startedAt : 0);
  const toggle = () => setState((s) => (s.running
    ? { running: false, startedAt: 0, base: s.base + Date.now() - s.startedAt }
    : { running: true, startedAt: Date.now(), base: s.base }));
  const reset = () => setState({ running: false, startedAt: 0, base: 0 });
  return { running: state.running, seconds: Math.floor(elapsed / 1000), toggle, reset };
}

const fmtTimer = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

function weekSessions(log, weekStart) {
  let done = 0;
  for (let i = 0; i < 7; i += 1) if (isSessionComplete(log, addDays(weekStart, i))) done += 1;
  return done;
}

function SectionHead({ eyebrow, title, children }) {
  return (
    <div className="section-head">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1 className="title">{title}</h1>
      {children}
    </div>
  );
}

function FormBtn({ name, onOpen }) {
  return <button type="button" className="tag-btn" onClick={() => onOpen(name)} aria-label={`Form guide: ${name}`}>Form</button>;
}

function Check({ checked, onToggle, label }) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} aria-label={label} className="check" onClick={onToggle}>
      {checked && <Icon name="check" size={14} strokeWidth={3} />}
    </button>
  );
}

function FormDetail({ exName, onBack }) {
  const ex = EXERCISES[exName];
  return (
    <div className="app">
      <div className="header" style={{ paddingBottom: "var(--space-3)" }}>
        <div className="brand">
          <button type="button" className="btn btn-ghost btn-icon" onClick={onBack} aria-label="Back">
            <Icon name="chevronLeft" size={22} />
          </button>
          <div className="brand-text">
            <div className="eyebrow">Form guide</div>
            <div className="brand-title">{exName}</div>
          </div>
        </div>
      </div>
      <div className="page stack">
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          <span className="badge badge-navy">{ex.muscle}</span>
          <span className="badge badge-neutral">{ex.sets}</span>
        </div>
        <div className="card">
          <div className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>Setup</div>
          <p className="body">{ex.setup}</p>
        </div>
        <div className="card">
          <div className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>Steps</div>
          {ex.steps.map((step, i) => (
            <div key={step} style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
              <div className="step-num">{i + 1}</div>
              <p className="body">{step}</p>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>Coaching cues</div>
          {ex.cues.map((cue) => (
            <div key={cue} style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
              <Icon name="chevronRight" size={16} style={{ color: "var(--color-accent-strong)", marginTop: 4 }} />
              <p className="body">{cue}</p>
            </div>
          ))}
        </div>
        <div className="alert alert-warn">
          <Icon name="alert" />
          <div><strong>Shoulder note:</strong> {ex.shoulderNote}</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(loadState);
  const [saveFailed, setSaveFailed] = useState(false);
  const [persisted, setPersisted] = useState(false);
  const [tab, setTab] = useState("today");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [spinView, setSpinView] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [importMsg, setImportMsg] = useState(null);
  const [updateReady, setUpdateReady] = useState(false);
  const fileInput = useRef(null);

  const today = useToday();
  const thisWeek = startOfWeek(today);
  const [weekStart, setWeekStart] = useState(thisWeek);
  const timer = useStopwatch();

  useEffect(() => { setSaveFailed(!saveState(data)); }, [data]);
  useEffect(() => { requestPersistentStorage().then(setPersisted); }, []);
  useEffect(() => {
    const onUpdate = () => setUpdateReady(true);
    window.addEventListener("sw-update-ready", onUpdate);
    return () => window.removeEventListener("sw-update-ready", onUpdate);
  }, []);

  const { log } = data;
  const currentProgramWeek = programWeek(data.programStart, today);
  const currentSpinPhase = spinPhaseForWeek(currentProgramWeek);
  const totalSessions = useMemo(() => completedDates(log).length, [log]);

  const updateEntry = useCallback((iso, fn) => {
    setData((prev) => {
      const next = fn({ ...(prev.log[iso] || {}) });
      const nextLog = { ...prev.log };
      if (next && Object.keys(next).length) nextLog[iso] = next;
      else delete nextLog[iso];
      return { ...prev, log: nextLog };
    });
  }, []);

  const toggleSpin = (iso) => updateEntry(iso, (e) => {
    if (e.spin) delete e.spin; else e.spin = true;
    return e;
  });
  const toggleExercise = (iso, name) => updateEntry(iso, (e) => {
    const ex = { ...(e.ex || {}) };
    if (ex[name]) delete ex[name]; else ex[name] = true;
    if (Object.keys(ex).length) e.ex = ex; else delete e.ex;
    return e;
  });
  // Logging a whole day from the Week tab; un-logging clears that day.
  const toggleDay = (iso) => updateEntry(iso, (e) => (isSessionComplete(log, iso) ? null : { ...e, done: true }));

  const saveNote = () => {
    const text = noteInput.trim();
    if (!text) return;
    setData((prev) => ({ ...prev, notes: [...prev.notes, { id: newNoteId(), date: todayISO(), text, createdAt: new Date().toISOString() }] }));
    setNoteInput("");
  };
  const deleteNote = (id) => {
    if (!window.confirm("Delete this note?")) return;
    setData((prev) => ({ ...prev, notes: prev.notes.filter((n) => n.id !== id) }));
  };

  const handleExport = () => {
    const stamped = { ...data, lastBackup: new Date().toISOString() };
    exportBackup(stamped);
    setData(stamped);
  };
  const handleImport = async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (!file) return;
    try {
      const { state, added } = mergeBackup(data, await file.text());
      setData(state);
      setImportMsg({ ok: true, text: `Backup restored: ${added.days} logged days checked, ${added.notes} new notes added.` });
    } catch (err) {
      setImportMsg({ ok: false, text: err.message });
    }
  };

  if (selectedExercise) return <FormDetail exName={selectedExercise} onBack={() => setSelectedExercise(null)} />;

  const todayPlan = planFor(today);
  const todayEntry = log[today] || {};
  const todayDone = isSessionComplete(log, today);
  const todayProgress = sessionProgress(log, today);

  const viewedWeek = programWeek(data.programStart, weekStart);
  const viewedDone = weekSessions(log, weekStart);
  const pct = Math.round((viewedDone / SESSIONS_PER_WEEK) * 100);

  const earliestLogged = Object.keys(log).sort()[0];
  const historyStart = startOfWeek(earliestLogged && earliestLogged < data.programStart ? earliestLogged : data.programStart);
  const historyWeeks = [];
  for (let w = thisWeek; w >= historyStart; w = addDays(w, -7)) historyWeeks.push(w);
  const fullWeeks = historyWeeks.filter((w) => weekSessions(log, w) >= SESSIONS_PER_WEEK).length;

  const daysSinceBackup = data.lastBackup ? Math.floor((Date.now() - new Date(data.lastBackup).getTime()) / 86400000) : null;
  const hasData = totalSessions > 0 || data.notes.length > 0;
  const backupDue = hasData && (daysSinceBackup === null || daysSinceBackup >= BACKUP_REMINDER_DAYS);

  const notesByDate = data.notes.reduce((acc, n) => {
    (acc[n.date] = acc[n.date] || []).push(n);
    return acc;
  }, {});
  const noteDates = Object.keys(notesByDate).sort().reverse();

  const shownSpin = spinView ?? currentSpinPhase;

  return (
    <div className="app">
      {updateReady && (
        <div className="banner" role="status">
          <Icon name="refresh" />
          <span>A new version is ready.</span>
          <button type="button" className="btn btn-sm" onClick={() => window.location.reload()}>Refresh</button>
        </div>
      )}

      <header className="header">
        <div className="brand">
          <img className="brand-mark" src={`${process.env.PUBLIC_URL}/brand/semaj-mark.png`} alt="" />
          <div className="brand-text">
            <img className="brand-wordmark" src={`${process.env.PUBLIC_URL}/brand/semaj-wordmark.png`} alt="SEMAJ Media" />
            <div className="brand-title">Upper Body Tracker</div>
          </div>
          <div className="brand-stat">
            <div className="eyebrow">Sessions</div>
            <div className="brand-stat-value">{totalSessions}</div>
          </div>
        </div>
        <nav className="tabs" role="tablist" aria-label="Sections">
          {TABS.map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} className="tab" onClick={() => setTab(id)}>{label}</button>
          ))}
        </nav>
      </header>

      <main className="page">
        {saveFailed && (
          <div className="alert alert-warn" style={{ marginBottom: "var(--space-4)" }}>
            <Icon name="alert" />
            <div>This browser is blocking storage, so changes won't be saved. Export a backup from History before closing.</div>
          </div>
        )}

        {/* TODAY */}
        {tab === "today" && (
          <div className="stack">
            <SectionHead eyebrow={formatLong(today)} title={todayPlan.focus}>
              <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)", flexWrap: "wrap" }}>
                <span className={`badge ${todayPlan.type === "rest" ? "badge-neutral" : "badge-navy"}`}>{TYPE_LABEL[todayPlan.type]}</span>
                {currentProgramWeek >= 1 && <span className="badge badge-info">Program week {currentProgramWeek}</span>}
              </div>
            </SectionHead>

            {currentProgramWeek < 1 && (
              <div className="alert alert-info">
                <Icon name="info" />
                <div>Your program starts {formatLong(data.programStart)}. Change the start date in History.</div>
              </div>
            )}

            {todayPlan.type !== "rest" ? (
              <>
                {todayDone && (
                  <div className="alert alert-success" role="status">
                    <Icon name="check" />
                    <div><strong>Session complete.</strong> Saved to your history.</div>
                  </div>
                )}
                <section className="card">
                  <div className="card-head">
                    <div className="card-title"><Icon name="bike" /> Spin bike</div>
                    <button type="button" className={`btn btn-sm ${todayEntry.spin ? "btn-success" : "btn-secondary"}`} onClick={() => toggleSpin(today)} aria-pressed={!!todayEntry.spin}>
                      {todayEntry.spin ? <><Icon name="check" size={14} /> Done</> : "Mark done"}
                    </button>
                  </div>
                  <p className="body">{SPIN_PHASES[currentSpinPhase].desc}</p>
                  <div className="muted" style={{ marginTop: "var(--space-1)" }}>{SPIN_PHASES[currentSpinPhase].weeks} · {SPIN_PHASES[currentSpinPhase].total}</div>
                </section>
                <section className="card">
                  <div className="card-head" style={{ marginBottom: 0 }}>
                    <div className="card-title"><Icon name="dumbbell" /> Resistance bands</div>
                    <span className="muted">{todayProgress.done}/{todayProgress.total} done</span>
                  </div>
                  {todayPlan.bands.map((name) => {
                    const checked = !!(todayEntry.ex && todayEntry.ex[name]);
                    return (
                      <div key={name} className="list-row">
                        <Check checked={checked} onToggle={() => toggleExercise(today, name)} label={name} />
                        <button type="button" className={`check-label ${checked ? "done" : ""}`} onClick={() => toggleExercise(today, name)}>
                          {name}
                          <span className="muted" style={{ display: "block", textDecoration: "none" }}>{EXERCISES[name].sets}</span>
                        </button>
                        <FormBtn name={name} onOpen={setSelectedExercise} />
                      </div>
                    );
                  })}
                </section>
                <div className="alert alert-warn">
                  <Icon name="alert" />
                  <div>Stop immediately if right shoulder hurts. Pain ≠ progress.</div>
                </div>
              </>
            ) : (
              <section className="card" style={{ textAlign: "center", padding: "var(--space-8) var(--space-4)" }}>
                <Icon name="moon" size={36} style={{ color: "var(--color-brand-primary)" }} />
                <div className="subtitle" style={{ marginTop: "var(--space-3)" }}>Rest and recover today.</div>
                <p className="muted" style={{ marginTop: "var(--space-1)" }}>A light 15–20 minute walk is optional.</p>
              </section>
            )}
          </div>
        )}

        {/* WEEK */}
        {tab === "week" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
              <button type="button" className="btn btn-secondary btn-icon" onClick={() => setWeekStart((w) => addDays(w, -7))} aria-label="Previous week">
                <Icon name="chevronLeft" />
              </button>
              <div style={{ textAlign: "center" }}>
                <div className="subtitle">{viewedWeek >= 1 ? `Program week ${viewedWeek}` : "Before program"}</div>
                <div className="muted">{formatWeekRange(weekStart)} · {viewedDone}/{SESSIONS_PER_WEEK} sessions</div>
              </div>
              <button type="button" className="btn btn-secondary btn-icon" onClick={() => setWeekStart((w) => addDays(w, 7))} disabled={weekStart >= thisWeek} aria-label="Next week">
                <Icon name="chevronRight" />
              </button>
            </div>
            {weekStart !== thisWeek && (
              <div style={{ textAlign: "center", marginBottom: "var(--space-3)" }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setWeekStart(thisWeek)}>Back to this week</button>
              </div>
            )}
            <div className="progress" style={{ marginBottom: "var(--space-4)" }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Sessions this week">
              <div style={{ width: `${pct}%` }} />
            </div>
            <div className="stack">
              {SCHEDULE.map((day, idx) => {
                const iso = addDays(weekStart, idx);
                const isDone = isSessionComplete(log, iso);
                const isToday = iso === today;
                const isFuture = iso > today;
                const prog = sessionProgress(log, iso);
                return (
                  <div key={day.day} className={`card ${isToday ? "highlight" : ""}`} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: isToday ? undefined : "var(--space-3) var(--space-4)" }}>
                    <div className={`day-dot ${day.type === "rest" ? "" : isDone ? "done" : "train"}`}>
                      {isDone ? <Icon name="check" size={18} strokeWidth={3} /> : day.day}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600 }}>{day.label} <span className="muted" style={{ fontWeight: 400 }}>· {formatShort(iso)}{isToday ? " · Today" : ""}</span></div>
                      <div className="muted">
                        {day.focus}
                        {day.type !== "rest" && !isDone && prog.done > 0 && ` · ${prog.done}/${prog.total} items`}
                      </div>
                    </div>
                    {day.type !== "rest" && (
                      <button type="button" className={`btn btn-sm ${isDone ? "btn-success" : "btn-secondary"}`} onClick={() => toggleDay(iso)} disabled={isFuture} aria-pressed={isDone}>
                        {isDone ? "Logged" : "Log"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: "var(--space-6)" }}>
              <div className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>Progress phases</div>
              <div className="card" style={{ padding: "0 var(--space-4)" }}>
                {PHASES.map((p) => {
                  const reached = viewedWeek >= p.from;
                  const current = viewedWeek >= p.from && viewedWeek <= p.to;
                  return (
                    <div key={p.label} className="list-row">
                      <span className="mini-dot" style={{ background: reached ? "var(--color-accent)" : undefined }} />
                      <div className="grow">
                        <span style={{ fontWeight: 600 }}>{p.label}</span> <span className="muted">{p.desc}</span>
                      </div>
                      {current && <span className="badge badge-info">Current</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* HISTORY */}
        {tab === "history" && (
          <div className="stack">
            <SectionHead eyebrow="Your record" title="History" />
            <div className="stat-grid">
              <div className="stat"><div className="stat-value">{totalSessions}</div><div className="muted">Sessions</div></div>
              <div className="stat"><div className="stat-value">{fullWeeks}</div><div className="muted">Full weeks</div></div>
              <div className="stat"><div className="stat-value">{Math.max(currentProgramWeek, 0)}</div><div className="muted">Program week</div></div>
            </div>

            {backupDue && (
              <div className="alert alert-gold">
                <Icon name="info" />
                <div>{daysSinceBackup === null ? "You haven't backed up yet." : `Last backup was ${daysSinceBackup} days ago.`} History lives only on this device — export a copy so it's safe if you clear your browser or switch phones.</div>
              </div>
            )}

            <section className="card" style={{ padding: "0 var(--space-4)" }}>
              {historyWeeks.map((w) => {
                const n = programWeek(data.programStart, w);
                const done = weekSessions(log, w);
                return (
                  <button key={w} type="button" className="list-row" style={{ width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--line-100)", cursor: "pointer", textAlign: "left" }}
                    onClick={() => { setWeekStart(w); setTab("week"); }}>
                    <div className="grow">
                      <div style={{ fontWeight: 600 }}>{n >= 1 ? `Week ${n}` : "Before program"}{w === thisWeek ? " · This week" : ""}</div>
                      <div className="muted">{formatWeekRange(w)}</div>
                    </div>
                    <div className="mini-dots" aria-label={`${done} of ${SESSIONS_PER_WEEK} sessions`}>
                      {SCHEDULE.map((d, i) => d.type !== "rest" && (
                        <span key={d.day} className={`mini-dot ${isSessionComplete(log, addDays(w, i)) ? "done" : ""}`} title={d.label} />
                      ))}
                    </div>
                    <span className="muted" style={{ width: 28, textAlign: "right" }}>{done}/{SESSIONS_PER_WEEK}</span>
                    <Icon name="chevronRight" size={16} style={{ color: "var(--color-text-muted)" }} />
                  </button>
                );
              })}
            </section>

            <section className="card">
              <div className="card-title" style={{ marginBottom: "var(--space-2)" }}>Backup &amp; restore</div>
              <p className="body">Your sessions and notes are saved on this device only — nothing is sent to a server. Export a backup file to keep a copy, then import it on a new phone or after clearing your browser.</p>
              <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)", flexWrap: "wrap" }}>
                <button type="button" className="btn btn-primary" onClick={handleExport}><Icon name="download" /> Export backup</button>
                <button type="button" className="btn btn-secondary" onClick={() => fileInput.current && fileInput.current.click()}><Icon name="upload" /> Import backup</button>
                <input ref={fileInput} type="file" accept="application/json,.json" onChange={handleImport} className="sr-only" tabIndex={-1} aria-hidden="true" />
              </div>
              {importMsg && (
                <div className={`alert ${importMsg.ok ? "alert-success" : "alert-warn"}`} style={{ marginTop: "var(--space-3)" }} role="status">
                  <Icon name={importMsg.ok ? "check" : "alert"} />
                  <div>{importMsg.text}</div>
                </div>
              )}
              <div className="muted" style={{ marginTop: "var(--space-3)" }}>
                {data.lastBackup ? `Last backup: ${formatLong(data.lastBackup.slice(0, 10))}` : "No backup yet."}
                {" · "}
                {persisted ? "Storage protected from automatic clearing." : "Browser may clear storage if space runs low."}
              </div>
            </section>

            <section className="card">
              <label className="field-label" htmlFor="program-start">Program start (week 1)</label>
              <input id="program-start" type="date" className="input" value={data.programStart} max={today}
                onChange={(e) => { if (e.target.value) setData((prev) => ({ ...prev, programStart: startOfWeek(e.target.value) })); }} />
              <p className="muted" style={{ marginTop: "var(--space-2)" }}>Weeks run Monday to Sunday. Changing this renumbers program weeks and the spin phase; logged sessions keep their dates.</p>
            </section>
          </div>
        )}

        {/* ROUTINES */}
        {tab === "routines" && (
          <div className="stack">
            <SectionHead eyebrow="Your program" title="Weekly routines" />
            {ROUTINES.map((routine) => (
              <section key={routine.id} className="card">
                <div className="card-head" style={{ alignItems: "flex-start" }}>
                  <div>
                    <div className="subtitle">{routine.label}</div>
                    <p className="muted" style={{ marginTop: 2 }}>{routine.desc}</p>
                  </div>
                  <span className={`badge ${routine.id === "rest" ? "badge-neutral" : routine.id === "wed" ? "badge-info" : "badge-navy"}`}>{routine.tag}</span>
                </div>
                {routine.exercises.length > 0 ? (
                  <>
                    {routine.spin && (
                      <div className="list-row">
                        <Icon name="bike" style={{ color: "var(--color-brand-primary)" }} />
                        <div className="grow">Spin bike</div>
                        <span className="muted">{routine.spin.time}</span>
                      </div>
                    )}
                    {routine.exercises.map((name) => (
                      <div key={name} className="list-row">
                        <div className="grow">
                          <div>{name}</div>
                          <div className="muted">{EXERCISES[name].muscle} · {EXERCISES[name].sets}</div>
                        </div>
                        <FormBtn name={name} onOpen={setSelectedExercise} />
                      </div>
                    ))}
                    <div className="alert alert-info" style={{ marginTop: "var(--space-3)", display: "block" }}>
                      {routine.rest && <div><strong>Rest:</strong> {routine.rest}</div>}
                      <div>{routine.notes}</div>
                    </div>
                  </>
                ) : (
                  <p className="body">{routine.notes}</p>
                )}
              </section>
            ))}
            <section className="card">
              <div className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>Key principles</div>
              {[
                ["Progressive overload", "Increase band resistance every 2–3 weeks as it gets easier."],
                ["Spin first", "Always spin before bands. Fat burning mode first."],
                ["Posture matters", "Good posture makes chest fat look better immediately."],
                ["Pain vs. discomfort", "Muscle burn = OK. Joint pain = stop."],
                ["Diet is 70%", "Chest fat responds most to caloric deficit."],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                  <Icon name="chevronRight" size={16} style={{ color: "var(--color-accent-strong)", marginTop: 3 }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{title}</div>
                    <p className="muted">{desc}</p>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* FORM GUIDE */}
        {tab === "form" && (
          <div>
            <SectionHead eyebrow="Reference" title="Form guide">
              <p className="muted" style={{ marginTop: "var(--space-1)" }}>Tap any exercise for setup, steps, coaching cues, and shoulder safety notes.</p>
            </SectionHead>
            {FORM_GROUPS.map((group) => (
              <div key={group.label} style={{ marginBottom: "var(--space-6)" }}>
                <div className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>{group.label}</div>
                <div className="stack">
                  {group.keys.map((exName) => (
                    <button key={exName} type="button" className="card selectable" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }} onClick={() => setSelectedExercise(exName)}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{exName}</div>
                        <div className="muted">{EXERCISES[exName].muscle} · {EXERCISES[exName].sets}</div>
                      </div>
                      <Icon name="chevronRight" style={{ color: "var(--color-text-muted)" }} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="alert alert-warn">
              <Icon name="alert" />
              <div>Right shoulder not yet evaluated. Stop any exercise that causes joint pain. Muscle burn is fine — sharp or deep pain is not.</div>
            </div>
          </div>
        )}

        {/* SPIN */}
        {tab === "spin" && (
          <div className="stack">
            <SectionHead eyebrow="Cardio" title="Spin bike protocol" />
            {SPIN_PHASES.map((phase, i) => (
              <button key={phase.weeks} type="button" className={`card selectable ${shownSpin === i ? "selected" : ""}`} onClick={() => setSpinView(i)} aria-pressed={shownSpin === i}>
                <div className="card-head" style={{ marginBottom: "var(--space-2)" }}>
                  <div className="card-title">{phase.weeks}</div>
                  <div style={{ display: "flex", gap: "var(--space-2)" }}>
                    {i === currentSpinPhase && <span className="badge badge-info">Your phase</span>}
                    <span className="badge badge-neutral">{phase.total}</span>
                  </div>
                </div>
                <p className="body">{phase.desc}</p>
                {phase.intervals && <p className="muted" style={{ marginTop: "var(--space-1)" }}>Interval training — push hard, recover easy.</p>}
              </button>
            ))}
            <section className="card" style={{ textAlign: "center", padding: "var(--space-6) var(--space-4)" }}>
              <div className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>Session timer</div>
              <div className="timer" aria-live="off">{fmtTimer(timer.seconds)}</div>
              <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "center", marginTop: "var(--space-4)" }}>
                <button type="button" className={`btn ${timer.running ? "btn-accent" : "btn-primary"}`} style={{ minWidth: 110 }} onClick={timer.toggle}>
                  {timer.running ? "Pause" : "Start"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={timer.reset}>Reset</button>
              </div>
            </section>
            <div className="alert alert-success">
              <Icon name="info" />
              <div>Sit tall. Don't hunch. Hydrate before, during, and after. Resistance up = more calorie burn.</div>
            </div>
          </div>
        )}

        {/* NOTES */}
        {tab === "notes" && (
          <div className="stack">
            <SectionHead eyebrow="Journal" title="Session notes" />
            <form style={{ display: "flex", gap: "var(--space-2)" }} onSubmit={(e) => { e.preventDefault(); saveNote(); }}>
              <label htmlFor="note-input" className="sr-only">New note</label>
              <input id="note-input" className="input" value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="How'd it go today?" />
              <button type="submit" className="btn btn-primary btn-icon" style={{ minHeight: 40, width: 44 }} aria-label="Add note"><Icon name="plus" /></button>
            </form>
            {noteDates.length === 0 ? (
              <p className="muted" style={{ textAlign: "center", padding: "var(--space-6) 0" }}>No notes yet. Log your first session.</p>
            ) : (
              noteDates.map((date) => (
                <div key={date}>
                  <div className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>{formatLong(date)}{date === today ? " · Today" : ""}</div>
                  <div className="stack">
                    {notesByDate[date].map((note) => (
                      <div key={note.id} className="card" style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-start", padding: "var(--space-3) var(--space-4)" }}>
                        <p className="body" style={{ flex: 1, color: "var(--color-text-primary)" }}>{note.text}</p>
                        <button type="button" className="btn btn-ghost btn-icon" style={{ minHeight: 28, width: 28 }} onClick={() => deleteNote(note.id)} aria-label="Delete note">
                          <Icon name="x" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
            <section className="card" style={{ marginTop: "var(--space-5)" }}>
              <label className="field-label" htmlFor="goal-input">Goal</label>
              <input id="goal-input" className="input" value={data.goal} maxLength={80} placeholder="Set a goal (saved on this device only)"
                onChange={(e) => { const goal = e.target.value; setData((prev) => ({ ...prev, goal })); }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-3)" }}>
                <span className="muted">Sessions logged</span>
                <span style={{ fontWeight: 600, color: "var(--color-success)" }}>{totalSessions} total</span>
              </div>
              <p className="editorial" style={{ marginTop: "var(--space-3)" }}>Consistency is the only cheat code. Keep showing up.</p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
