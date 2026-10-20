import { addDays, programWeek, startOfWeek, todayISO, weekdayIndex } from "./dates";
import { completedDates, emptyState, isSessionComplete, loadState, mergeBackup, migrateLegacy, saveState } from "./storage";

const MONDAY = "2026-10-12";

describe("dates", () => {
  test("weeks start on Monday", () => {
    expect(weekdayIndex(MONDAY)).toBe(0);
    expect(startOfWeek("2026-10-18")).toBe(MONDAY); // Sunday
    expect(startOfWeek("2026-10-19")).toBe("2026-10-19");
  });

  test("program week is calendar based", () => {
    expect(programWeek(MONDAY, MONDAY)).toBe(1);
    expect(programWeek(MONDAY, "2026-10-18")).toBe(1);
    expect(programWeek(MONDAY, "2026-10-19")).toBe(2);
    expect(programWeek(MONDAY, "2026-10-05")).toBe(0);
    // Across the US DST change (Nov 1, 2026)
    expect(programWeek(MONDAY, "2026-11-09")).toBe(5);
  });
});

describe("session completion", () => {
  test("rest days never count", () => {
    expect(isSessionComplete({ "2026-10-13": { done: true } }, "2026-10-13")).toBe(false);
  });

  test("a day counts when logged directly or when every item is checked", () => {
    const allItems = {
      spin: true,
      ex: { "Banded Chest Press": true, "Banded Chest Fly": true, "Banded Row": true, "Banded Pull-Aparts": true, "Modified Push-Ups": true },
    };
    expect(isSessionComplete({ [MONDAY]: { done: true } }, MONDAY)).toBe(true);
    expect(isSessionComplete({ [MONDAY]: allItems }, MONDAY)).toBe(true);
    expect(isSessionComplete({ [MONDAY]: { ...allItems, spin: false } }, MONDAY)).toBe(false);
  });

  test("checked items count as one session, not one per item", () => {
    const log = { [MONDAY]: { done: true, spin: true, ex: { "Banded Row": true } }, "2026-10-14": { done: true } };
    expect(completedDates(log)).toEqual([MONDAY, "2026-10-14"]);
  });
});

describe("legacy migration", () => {
  test("returns null when there is nothing to migrate", () => {
    expect(migrateLegacy(null, null)).toBeNull();
    expect(migrateLegacy({}, {})).toBeNull();
  });

  test("maps week counters onto calendar weeks ending this week", () => {
    const thisWeek = startOfWeek(todayISO());
    const state = migrateLegacy(
      { session_w0_d0: true, session_w1_d2_spin: true, session_w1_d2_ex1: true, session_w1_d4: false },
      null
    );
    expect(state.programStart).toBe(addDays(thisWeek, -7));
    expect(state.log[addDays(thisWeek, -7)]).toEqual({ done: true });
    expect(state.log[addDays(thisWeek, 2)]).toEqual({ spin: true, ex: { "Banded Tricep Pressdowns": true } });
    expect(state.log[addDays(thisWeek, 4)]).toBeUndefined();
  });

  test("converts locale-dated notes", () => {
    const state = migrateLegacy(null, { "10/1/2026": ["Felt strong", "  "] });
    expect(state.notes).toHaveLength(1);
    expect(state.notes[0]).toMatchObject({ date: "2026-10-01", text: "Felt strong" });
  });
});

describe("persistence", () => {
  beforeEach(() => localStorage.clear());

  test("saves and reloads", () => {
    const state = { ...emptyState(), log: { [MONDAY]: { done: true } }, goal: "Stay consistent" };
    saveState(state);
    const loaded = loadState();
    expect(loaded.log).toEqual(state.log);
    expect(loaded.goal).toBe("Stay consistent");
  });

  test("migrates legacy keys on first load", () => {
    localStorage.setItem("hcpa_fitness", JSON.stringify({ session_w0_d0: true }));
    const loaded = loadState();
    expect(loaded.log[startOfWeek(todayISO())]).toEqual({ done: true });
  });
});

describe("backup merge", () => {
  test("unions history and de-duplicates notes", () => {
    const current = { ...emptyState(), programStart: MONDAY, log: { [MONDAY]: { spin: true } }, notes: [{ id: "a", date: MONDAY, text: "one", createdAt: "x" }] };
    const backup = JSON.stringify({
      app: "semaj-fit",
      version: 2,
      programStart: "2026-10-05",
      log: { [MONDAY]: { ex: { "Banded Row": true } }, "2026-10-07": { done: true } },
      notes: [{ id: "a", date: MONDAY, text: "one" }, { id: "b", date: "2026-10-07", text: "two" }],
    });
    const { state, added } = mergeBackup(current, backup);
    expect(state.programStart).toBe("2026-10-05");
    expect(state.log[MONDAY]).toEqual({ spin: true, ex: { "Banded Row": true } });
    expect(state.log["2026-10-07"]).toEqual({ done: true });
    expect(state.notes.map((n) => n.id)).toEqual(["a", "b"]);
    expect(added.notes).toBe(1);
  });

  test("rejects files that aren't backups", () => {
    expect(() => mergeBackup(emptyState(), "not json")).toThrow(/valid backup/);
    expect(() => mergeBackup(emptyState(), "{\"foo\":1}")).toThrow(/SEMAJ Fit backup/);
  });
});
