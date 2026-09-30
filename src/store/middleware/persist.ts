import type { Middleware } from "@reduxjs/toolkit";

type PersistCfg<S> = {
  key: string;
  select: (root: any) => S;
  matches: Array<(action: unknown) => boolean>;
  storage?: Storage;
  serialize?: (v: S) => string;
  deserialize?: (raw: string) => S;
};

export function loadPersisted<S>(
  key: string,
  opts?: { storage?: Storage; deserialize?: (raw: string) => S }
): S | undefined {
  const storage = opts?.storage ?? (typeof localStorage !== "undefined" ? localStorage : undefined);
  if (!storage) return undefined;
  try {
    const raw = storage.getItem(key);
    if (!raw) return undefined;
    return (opts?.deserialize ?? JSON.parse)(raw) as S;
  } catch {
    return undefined;
  }
}

export function createPersistMiddleware<S>({
  key,
  select,
  matches,
  storage,
  serialize,
}: PersistCfg<S>): Middleware {
  const storeApi = storage ?? (typeof localStorage !== "undefined" ? localStorage : undefined);
  const toString = serialize ?? ((v: S) => JSON.stringify(v));

  return (store) => (next) => (action) => {
    const result = next(action);
    if (!storeApi) return result;

    if (matches.some((m) => m(action))) {
      try {
        const slice = select(store.getState());
        storeApi.setItem(key, toString(slice));
      } catch {
        // no-op
      }
    }
    return result;
  };
}