"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "simple-todo-items";

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random();
}

function parseItems(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x) =>
        x &&
        typeof x.id === "string" &&
        typeof x.text === "string" &&
        typeof x.done === "boolean"
    );
  } catch {
    return [];
  }
}

function readFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    return parseItems(localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

function writeToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

/** In-memory cache + listeners so useSyncExternalStore sees updates after writes. */
function createTodoStore() {
  let items = null;
  const listeners = new Set();

  function getSnapshot() {
    if (items === null) items = readFromStorage();
    return items;
  }

  function setSnapshot(next) {
    items = next;
    writeToStorage(next);
    listeners.forEach((l) => l());
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function resetFromStorage() {
    items = readFromStorage();
    listeners.forEach((l) => l());
  }

  return { getSnapshot, setSnapshot, subscribe, resetFromStorage };
}

const store = createTodoStore();

/** Stable reference for SSR / hydration (React requires getServerSnapshot to be cached). */
const EMPTY_SERVER_ITEMS = [];

function subscribeTodoStore(onChange) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY || e.key === null) store.resetFromStorage();
    onChange();
  };
  const unsubLocal = store.subscribe(onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    unsubLocal();
    window.removeEventListener("storage", onStorage);
  };
}

function getServerSnapshot() {
  return EMPTY_SERVER_ITEMS;
}

function getClientSnapshot() {
  return store.getSnapshot();
}

export default function TodoApp() {
  const items = useSyncExternalStore(
    subscribeTodoStore,
    getClientSnapshot,
    getServerSnapshot
  );

  const persist = useCallback((next) => {
    store.setSnapshot(next);
  }, []);

  const leftCount = useMemo(
    () => items.filter((i) => !i.done).length,
    [items]
  );

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("task");
    const text = (input?.value ?? "").trim();
    if (!text) return;
    persist([...items, { id: uid(), text, done: false }]);
    form.reset();
    input?.focus();
  }

  function toggleDone(id, done) {
    persist(items.map((i) => (i.id === id ? { ...i, done } : i)));
  }

  function removeItem(id) {
    persist(items.filter((i) => i.id !== id));
  }

  function clearDone() {
    persist(items.filter((i) => !i.done));
  }

  return (
    <div className="container py-4" style={{ maxWidth: "36rem" }}>
      <h1 className="h3 mb-4">やることリスト</h1>

      <form onSubmit={handleSubmit} className="mb-3" autoComplete="off">
        <label htmlFor="task" className="visually-hidden">
          新しいタスク
        </label>
        <div className="input-group">
          <input
            id="task"
            name="task"
            type="text"
            className="form-control"
            placeholder="タスクを入力…"
            maxLength={200}
            aria-label="新しいタスク"
          />
          <button type="submit" className="btn btn-primary">
            追加
          </button>
        </div>
      </form>

      <div className="d-flex justify-content-between align-items-center mb-2 small text-secondary">
        <span aria-live="polite">残り {leftCount} 件</span>
        <button
          type="button"
          className="btn btn-link btn-sm text-secondary p-0 text-decoration-none"
          onClick={clearDone}
        >
          完了を削除
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-secondary text-center py-4 border rounded bg-white">
          タスクがありません。上の欄から追加してください。
        </p>
      ) : (
        <ul className="list-group shadow-sm">
          {items.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex align-items-center gap-2 flex-wrap"
            >
              <div className="form-check m-0 flex-grow-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={item.done}
                  onChange={(e) => toggleDone(item.id, e.target.checked)}
                  id={`todo-${item.id}`}
                />
                <label
                  className={`form-check-label ${item.done ? "text-decoration-line-through text-secondary" : ""}`}
                  htmlFor={`todo-${item.id}`}
                >
                  {item.text}
                </label>
              </div>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm ms-auto"
                onClick={() => removeItem(item.id)}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
