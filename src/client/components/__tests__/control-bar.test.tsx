import { describe, expect, it, mock } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Preset } from "@/client/lib/types/preset";
import { TECHNICAL_ARTICLE_PRESET } from "@/client/lib/types/preset";
import { ControlBar } from "../control-bar";

const defaultPresets: Preset[] = [TECHNICAL_ARTICLE_PRESET];

function renderControlBar(
  overrides: Partial<Parameters<typeof ControlBar>[0]> = {},
) {
  const defaultProps = {
    isLinting: false,
    isAutoLintEnabled: true,
    fixableCount: 0,
    currentPresetId: "technical-article",
    presets: defaultPresets,
    onManualLint: mock(() => {}),
    onToggleAutoLint: mock((_enabled: boolean) => {}),
    onAutoFix: mock(() => {}),
    onPresetChange: mock((_presetId: string) => {}),
    onClearDraft: mock(() => {}),
    ...overrides,
  };

  const result = render(<ControlBar {...defaultProps} />);
  return { ...result, props: defaultProps };
}

// タスク9.1: Lint実行コントロール
describe("ControlBar - Lint実行コントロール", () => {
  it("手動Lint実行ボタンを表示する", () => {
    renderControlBar();

    const lintButton = screen.getByRole("button", { name: /Lint実行/ });
    expect(lintButton).not.toBeNull();
  });

  it("手動Lint実行ボタンをクリックしたらonManualLintが呼ばれる", () => {
    const { props } = renderControlBar();

    const lintButton = screen.getByRole("button", { name: /Lint実行/ });
    fireEvent.click(lintButton);

    expect(props.onManualLint).toHaveBeenCalledTimes(1);
  });

  it("Lint実行中は手動Lint実行ボタンが無効化される", () => {
    renderControlBar({ isLinting: true });

    const lintButton = screen.getByRole("button", { name: /Lint実行/ });
    expect(lintButton.hasAttribute("disabled")).toBe(true);
  });

  it("自動Lint ON/OFFトグルを表示する", () => {
    renderControlBar();

    const toggle = screen.getByRole("switch", { name: /自動Lint/ });
    expect(toggle).not.toBeNull();
  });

  it("自動LintがONの場合はトグルがチェック済みである", () => {
    renderControlBar({ isAutoLintEnabled: true });

    const toggle = screen.getByRole("switch", { name: /自動Lint/ });
    expect(toggle.getAttribute("data-state")).toBe("checked");
  });

  it("自動LintがOFFの場合はトグルが未チェックである", () => {
    renderControlBar({ isAutoLintEnabled: false });

    const toggle = screen.getByRole("switch", { name: /自動Lint/ });
    expect(toggle.getAttribute("data-state")).toBe("unchecked");
  });

  it("トグルを切り替えたらonToggleAutoLintが呼ばれる", () => {
    const { props } = renderControlBar({ isAutoLintEnabled: false });

    const toggle = screen.getByRole("switch", { name: /自動Lint/ });
    fireEvent.click(toggle);

    expect(props.onToggleAutoLint).toHaveBeenCalledTimes(1);
    expect(props.onToggleAutoLint).toHaveBeenCalledWith(true);
  });

  it("Lint実行中にローディング表示がある", () => {
    renderControlBar({ isLinting: true });

    expect(screen.getByText(/実行中/)).not.toBeNull();
  });

  it("Lint未実行時にはローディング表示がない", () => {
    renderControlBar({ isLinting: false });

    expect(screen.queryByText(/実行中/)).toBeNull();
  });
});

// タスク9.2: 自動修正ボタン
describe("ControlBar - 自動修正ボタン", () => {
  it("自動修正ボタンを表示する", () => {
    renderControlBar();

    const fixButton = screen.getByRole("button", { name: /自動修正/ });
    expect(fixButton).not.toBeNull();
  });

  it("fixableCountが0件の場合はボタンが無効化される", () => {
    renderControlBar({ fixableCount: 0 });

    const fixButton = screen.getByRole("button", { name: /自動修正/ });
    expect(fixButton.hasAttribute("disabled")).toBe(true);
  });

  it("fixableCountが1件以上の場合はボタンが有効化される", () => {
    renderControlBar({ fixableCount: 3 });

    const fixButton = screen.getByRole("button", { name: /自動修正/ });
    expect(fixButton.hasAttribute("disabled")).toBe(false);
  });

  it("自動修正ボタンにfixableCountを表示する", () => {
    renderControlBar({ fixableCount: 5 });

    const fixButton = screen.getByRole("button", { name: /自動修正/ });
    expect(fixButton.textContent).toContain("5");
  });

  it("自動修正ボタンをクリックしたらonAutoFixが呼ばれる", () => {
    const { props } = renderControlBar({ fixableCount: 2 });

    const fixButton = screen.getByRole("button", { name: /自動修正/ });
    fireEvent.click(fixButton);

    expect(props.onAutoFix).toHaveBeenCalledTimes(1);
  });

  it("Lint実行中は自動修正ボタンが無効化される", () => {
    renderControlBar({ isLinting: true, fixableCount: 3 });

    const fixButton = screen.getByRole("button", { name: /自動修正/ });
    expect(fixButton.hasAttribute("disabled")).toBe(true);
  });
});

// タスク9.3: プリセット選択とドラフトクリア
describe("ControlBar - プリセット選択とドラフトクリア", () => {
  it("プリセット選択UIを表示する", () => {
    renderControlBar();

    expect(screen.getByText(/技術記事/)).not.toBeNull();
  });

  it("ドラフトクリアボタンを表示する", () => {
    renderControlBar();

    const clearButton = screen.getByRole("button", { name: /クリア/ });
    expect(clearButton).not.toBeNull();
  });

  it("ドラフトクリアボタンをクリックしたらonClearDraftが呼ばれる", () => {
    const { props } = renderControlBar();

    const clearButton = screen.getByRole("button", { name: /クリア/ });
    fireEvent.click(clearButton);

    expect(props.onClearDraft).toHaveBeenCalledTimes(1);
  });
});
