import { afterEach } from "bun:test";
import { Window } from "happy-dom";

const window = new Window();
const document = window.document;

// グローバルオブジェクトに設定
Object.assign(global, {
  window,
  document,
  navigator: window.navigator,
  HTMLElement: window.HTMLElement,
  DocumentFragment: window.DocumentFragment,
  MutationObserver: window.MutationObserver,
  ResizeObserver: window.ResizeObserver,
  IntersectionObserver: window.IntersectionObserver,
});

// テスト間のDOM自動クリーンアップ
afterEach(async () => {
  const { cleanup } = await import("@testing-library/react");
  cleanup();
});
