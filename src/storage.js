// On-device history. Everything lives in this browser's localStorage under one
// key; nothing is sent to a server. Backups are plain JSON files the user
// exports and imports themselves.

import { SCHEDULE } from "./data";
import { addDays, isISODate, parseISO, startOfWeek, todayISO, toISO, weekdayIndex } from "./dates";

const STORAGE_KEY = "semaj_fit_v2";
const LEGACY_SESSIONS_KEY = "hcpa_fitness";
const LEGACY_NOTES_KEY = "hcpa_notes";
export const DATA_VERSION = 2;

// Shape:
// {
//   version: 2,
//   programStart: "YYYY-MM-DD" (a Monday; program week 1),
//   log: { "YYYY-MM-DD": { spin?: bool, ex?: { [exerciseName]: true }, done?: bool } },
//   notes: [{ id, date: "YYYY-MM-DD", text, createdAt }],
//   goal: string,
//   lastBackup: ISO timestamp | null,
// }
export function emptyState() {
  return {
    version: DATA_VERSION,
    programStart: startOfWeek(todayISO()),
    log: {},
    notes: [],
    goal: "",
    lastBackup: null,
  };
}

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function loadState() {
  const saved = readJSON(STORAGE_KEY);
  if (saved && saved.version === DATA_VERSION) return normalize(saved);
  const legacy = migrateLegacy(readJSON(LEGACY_SESSIONS_KEY), readJSON(LEGACY_NOTES_KEY));
  return legacy || emptyState();
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

// Ask the browser not to evict our storage under pressure (best effort).
export async function requestPersistentStorage() {
  try {
    if (navigator.storage && navigator.storage.persist) {
      if (await navigator.storage.persisted()) return true;
      return await navigator.storage.persist();
    }
  } catch {
    // Unsupported or blocked; history still saves, just without the guarantee.
  }
  return false;
}

let noteCounter = 0;
export function newNoteId() {
  noteCounter += 1;
  return `${Date.now().toString(36)}-${noteCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

// The old app keyed sessions by a manual week counter (session_w{N}_d{day}),
// not by date, and notes by toLocaleDateString(). Map them onto real dates:
// the highest legacy week becomes the current calendar week and earlier
// weeks count back from it, so nothing lands in the future.
export function migrateLegacy(sessions, notes) {
  const hasSessions = sessions && typeof sessions === "object" && Object.keys(sessions).length > 0;
  const hasNotes = notes && typeof notes === "object" && Object.keys(notes).length > 0;
  if (!hasSessions && !hasNotes) return null;

  const state = emptyState();
  const thisWeek = startOfWeek(todayISO());

  if (hasSessions) {
    const parsed = [];
    Object.entries(sessions).forEach(([key, value]) => {
      const m = /^session_w(\d+)_d(\d)(?:_(spin|ex(\d+)))?$/.exec(key);
      if (!m || !value) return;
      parsed.push({ week: Number(m[1]), day: Number(m[2]), part: m[3], exIdx: m[4] != null ? Number(m[4]) : null });
    });
    const maxWeek = parsed.reduce((max, p) => Math.max(max, p.week), 0);
    const anchor = addDays(thisWeek, -7 * maxWeek);
    state.programStart = anchor;
    parsed.forEach(({ week, day, part, exIdx }) => {
      const plan = SCHEDULE[day];
      if (!plan) return;
      const iso = addDays(anchor, week * 7 + day);
      const entry = state.log[iso] || (state.log[iso] = {});
      if (!part) entry.done = true;
      else if (part === "spin") entry.spin = true;
      else if (plan.bands[exIdx]) entry.ex = { ...(entry.ex || {}), [plan.bands[exIdx]]: true };
    });
  }

  if (hasNotes) {
    Object.entries(notes).forEach(([dateLabel, entries]) => {
      if (!Array.isArray(entries)) return;
      const parsedDate = new Date(dateLabel);
      const iso = Number.isNaN(parsedDate.getTime()) ? todayISO() : toISO(parsedDate);
      entries.forEach((text) => {
        if (typeof text === "string" && text.trim()) {
          state.notes.push({ id: newNoteId(), date: iso, text: text.trim(), createdAt: parseISO(iso).toISOString() });
        }
      });
    });
    if (state.notes.length) {
      const earliest = state.notes.reduce((min, n) => (n.date < min ? n.date : min), state.programStart);
      state.programStart = startOfWeek(earliest);
    }
  }

  return state;
}

function normalize(raw) {
  const base = emptyState();
  const state = {
    version: DATA_VERSION,
    programStart: isISODate(raw.programStart) ? startOfWeek(raw.programStart) : base.programStart,
    log: {},
    notes: [],
    goal: typeof raw.goal === "string" ? raw.goal : "",
    lastBackup: typeof raw.lastBackup === "string" ? raw.lastBackup : null,
  };
  if (raw.log && typeof raw.log === "object") {
    Object.entries(raw.log).forEach(([iso, entry]) => {
      if (!isISODate(iso) || !entry || typeof entry !== "object") return;
      const clean = {};
      if (entry.done === true) clean.done = true;
      if (entry.spin === true) clean.spin = true;
      if (entry.ex && typeof entry.ex === "object") {
        const ex = {};
        Object.entries(entry.ex).forEach(([name, v]) => { if (v === true) ex[name] = true; });
        if (Object.keys(ex).length) clean.ex = ex;
      }
      if (Object.keys(clean).length) state.log[iso] = clean;
    });
  }
  if (Array.isArray(raw.notes)) {
    raw.notes.forEach((n) => {
      if (!n || typeof n.text !== "string" || !n.text.trim() || !isISODate(n.date)) return;
      state.notes.push({
        id: typeof n.id === "string" ? n.id : newNoteId(),
        date: n.date,
        text: n.text.trim(),
        createdAt: typeof n.createdAt === "string" ? n.createdAt : parseISO(n.date).toISOString(),
      });
    });
  }
  return state;
}

// ---- Session completion -------------------------------------------------

export function planFor(iso) {
  return SCHEDULE[weekdayIndex(iso)];
}

// A training day counts once when logged directly, or when spin and every
// band exercise for that day are checked off.
export function isSessionComplete(log, iso) {
  const plan = planFor(iso);
  if (plan.type === "rest") return false;
  const entry = log[iso];
  if (!entry) return false;
  if (entry.done) return true;
  return (!plan.spin || entry.spin === true) && plan.bands.every((name) => entry.ex && entry.ex[name]);
}

export function sessionProgress(log, iso) {
  const plan = planFor(iso);
  const entry = log[iso] || {};
  const total = plan.bands.length + (plan.spin ? 1 : 0);
  const done = plan.bands.filter((n) => entry.ex && entry.ex[n]).length + (plan.spin && entry.spin ? 1 : 0);
  return { done, total };
}

export function completedDates(log) {
  return Object.keys(log).filter((iso) => isSessionComplete(log, iso)).sort();
}

// ---- Backup -------------------------------------------------------------

export function exportBackup(state) {
  const payload = { app: "semaj-fit", exportedAt: new Date().toISOString(), ...state };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `semaj-fit-backup-${todayISO()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Merge a backup into current state: logged items are unioned, notes are
// de-duplicated by id. Nothing already on this device is removed.
export function mergeBackup(current, text) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("That file isn't a valid backup (could not read JSON).");
  }
  if (!raw || typeof raw !== "object" || (raw.version !== DATA_VERSION && raw.app !== "semaj-fit")) {
    throw new Error("That file isn't a SEMAJ Fit backup.");
  }
  const incoming = normalize(raw);
  const log = { ...current.log };
  Object.entries(incoming.log).forEach(([iso, entry]) => {
    const prev = log[iso] || {};
    log[iso] = { ...prev, ...entry, ex: { ...(prev.ex || {}), ...(entry.ex || {}) } };
    if (!Object.keys(log[iso].ex).length) delete log[iso].ex;
  });
  const seen = new Set(current.notes.map((n) => n.id));
  const notes = [...current.notes, ...incoming.notes.filter((n) => !seen.has(n.id))];
  const programStart = incoming.programStart < current.programStart ? incoming.programStart : current.programStart;
  return {
    state: { ...current, programStart, log, notes, goal: current.goal || incoming.goal },
    added: { days: Object.keys(incoming.log).length, notes: notes.length - current.notes.length },
  };
}
