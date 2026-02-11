"use client";

import { Button } from "@/client/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { Switch } from "@/client/components/ui/switch";
import type { Preset } from "@/client/lib/types/preset";

/**
 * ControlBarコンポーネントのプロパティ
 */
type ControlBarProps = {
  /** Lint実行中フラグ */
  isLinting: boolean;
  /** 自動Lint有効フラグ */
  isAutoLintEnabled: boolean;
  /** 修正可能な指摘数 */
  fixableCount: number;
  /** 選択中のプリセットID */
  currentPresetId: string;
  /** 利用可能なプリセット一覧 */
  presets: Preset[];
  /** 手動Lint実行コールバック */
  onManualLint: () => void;
  /** 自動Lint切り替えコールバック */
  onToggleAutoLint: (enabled: boolean) => void;
  /** 自動修正コールバック */
  onAutoFix: () => void;
  /** プリセット変更コールバック */
  onPresetChange: (presetId: string) => void;
  /** ドラフトクリアコールバック */
  onClearDraft: () => void;
};

/**
 * コントロールバーコンポーネント
 *
 * Lint実行・自動修正・プリセット選択・ドラフトクリアのコントロールを提供する。
 *
 * @param isLinting - Lint実行中フラグ
 * @param isAutoLintEnabled - 自動Lint有効フラグ
 * @param fixableCount - 修正可能な指摘数
 * @param currentPresetId - 選択中のプリセットID
 * @param presets - 利用可能なプリセット一覧
 * @param onManualLint - 手動Lint実行コールバック
 * @param onToggleAutoLint - 自動Lint切り替えコールバック
 * @param onAutoFix - 自動修正コールバック
 * @param onPresetChange - プリセット変更コールバック
 * @param onClearDraft - ドラフトクリアコールバック
 */
export function ControlBar({
  isLinting,
  isAutoLintEnabled,
  fixableCount,
  currentPresetId,
  presets,
  onManualLint,
  onToggleAutoLint,
  onAutoFix,
  onPresetChange,
  onClearDraft,
}: ControlBarProps) {
  return (
    <div
      className="flex items-center gap-4 border-b border-border px-4 py-2"
      data-testid="control-bar"
    >
      {/* プリセット選択 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">プリセット:</span>
        <Select value={currentPresetId} onValueChange={onPresetChange}>
          <SelectTrigger size="sm" aria-label="プリセット選択">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {presets.map((preset) => (
              <SelectItem key={preset.id} value={preset.id}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lint実行コントロール */}
      <Button
        variant="default"
        size="sm"
        disabled={isLinting}
        onClick={onManualLint}
      >
        Lint実行
      </Button>

      {/* 自動Lint ON/OFFトグル */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="auto-lint-toggle"
          className="text-sm text-muted-foreground"
        >
          自動Lint
        </label>
        <Switch
          id="auto-lint-toggle"
          checked={isAutoLintEnabled}
          onCheckedChange={onToggleAutoLint}
          aria-label="自動Lint"
        />
      </div>

      {/* ローディング表示 */}
      {isLinting && (
        <span className="text-sm text-muted-foreground">実行中...</span>
      )}

      {/* 自動修正ボタン */}
      <Button
        variant="secondary"
        size="sm"
        disabled={fixableCount === 0 || isLinting}
        onClick={onAutoFix}
      >
        自動修正 ({fixableCount})
      </Button>

      {/* ドラフトクリアボタン */}
      <Button variant="outline" size="sm" onClick={onClearDraft}>
        クリア
      </Button>
    </div>
  );
}
