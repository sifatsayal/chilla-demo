"use client";

import { useCallback, useSyncExternalStore } from "react";

// Tiny localStorage-backed state shared across components.
// usePersistentState("profile", defaultProfile) works like useState, but
// survives reloads and stays in sync everywhere it's used.
// `fallback` must be a stable reference (e.g. a module-level constant).

const PREFIX = "chilla-demo:v1:";
const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function read<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(PREFIX + key);
  } catch {
    /* storage blocked: fall back to defaults */
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw && (raw !== null || hit.value === fallback)) return hit.value as T;
  let value: T = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

function write<T>(key: string, value: T) {
  const raw = JSON.stringify(value);
  cache.set(key, { raw, value });
  try {
    window.localStorage.setItem(PREFIX + key, raw);
  } catch {
    /* ignore quota / private mode errors; state still lives in memory */
  }
  listeners.get(key)?.forEach((l) => l());
}

function subscribe(key: string, cb: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(cb);
  const onStorage = (e: StorageEvent) => e.key === PREFIX + key && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.get(key)!.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function usePersistentState<T>(key: string, fallback: T) {
  const value = useSyncExternalStore(
    useCallback((cb) => subscribe(key, cb), [key]),
    () => read(key, fallback),
    () => fallback,
  );
  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = read(key, fallback);
      write(key, typeof next === "function" ? (next as (p: T) => T)(prev) : next);
    },
    [key, fallback],
  );
  return [value, setValue] as const;
}

/** Update stored state from outside React (e.g. a timer). */
export function updateStored<T>(key: string, fallback: T, fn: (prev: T) => T) {
  write(key, fn(read(key, fallback)));
}

/** Wipe all demo data and reload, for the "Reset demo" button. */
export function resetDemoData() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
  window.location.reload();
}
