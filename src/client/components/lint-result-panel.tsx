"use client";

import { useMemo } from "react";
import { Button } from "@/client/components/ui/button";
import type { LintResult } from "@/client/lib/types/lint-worker";

/**
 * LintResultPanelコンポーネントのプロパティ
 */
type LintResultPanelProps = {
  /** Lint結果配列 */
  lintResults: LintResult[];
  /** 選択中の指摘ID */
  selectedIssueId: string | null;
  /** 指摘選択時のコールバック */
  onIssueSelect: (issueId: string) => void;
  /** 指摘無視時のコールバック */
  onIssueIgnore: (issueId: string) => void;
  /** 無視された指摘のID集合 */
  ignoredIssueIds: Set<string>;
};

/**
 * Lint結果パネルコンポーネント
 * - Lint指摘リストと選択中の指摘詳細を表示
 * - 無視機能を提供
 *
 * @param lintResults - Lint結果配列
 * @param selectedIssueId - 選択中の指摘ID
 * @param onIssueSelect - 指摘選択時のコールバック
 * @param onIssueIgnore - 指摘無視時のコールバック
 * @param ignoredIssueIds - 無視された指摘のID集合
 */
export function LintResultPanel({
  lintResults,
  selectedIssueId,
  onIssueSelect,
  onIssueIgnore,
  ignoredIssueIds,
}: LintResultPanelProps) {
  // 無視された指摘を除外してフィルタリング
  const filteredResults = useMemo(
    () => lintResults.filter((result) => !ignoredIssueIds.has(result.id)),
    [lintResults, ignoredIssueIds],
  );

  // 選択中の指摘を抽出
  const selectedIssue = useMemo(
    () => lintResults.find((result) => result.id === selectedIssueId) ?? null,
    [lintResults, selectedIssueId],
  );

  return (
    <div className="flex h-full flex-col" data-testid="lint-result-panel">
      {/* 指摘リスト */}
      <div className="flex-1 overflow-auto">
        {filteredResults.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            指摘はありません
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filteredResults.map((result) => (
              <li
                key={result.id}
                data-issue-id={result.id}
                data-severity={result.severity}
                className={`flex items-start gap-2 p-3 transition-colors hover:bg-accent ${
                  selectedIssueId === result.id ? "bg-accent" : ""
                }`}
              >
                {/* 選択領域 */}
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-start gap-2 text-left"
                  onClick={() => onIssueSelect(result.id)}
                >
                  <SeverityIcon severity={result.severity} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium">
                        行{result.line}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {result.ruleId}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground">
                      {result.message}
                    </p>
                  </div>
                </button>

                {/* 無視ボタン */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-xs text-muted-foreground"
                  onClick={() => onIssueIgnore(result.id)}
                >
                  無視
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 選択中の指摘詳細 */}
      {selectedIssue !== null && (
        <div className="border-t border-border p-4" data-testid="issue-detail">
          <h3 className="mb-2 text-sm font-medium">選択中の指摘詳細</h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">行</dt>
              <dd>{selectedIssue.line}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">ルール</dt>
              <dd>{selectedIssue.ruleId}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">メッセージ</dt>
              <dd>{selectedIssue.message}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">対象文</dt>
              <dd className="rounded bg-muted p-2 font-mono text-xs">
                {selectedIssue.snippet}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

/**
 * 重大度アイコンコンポーネント
 *
 * @param severity - 重大度("error" または "warning")
 */
function SeverityIcon({ severity }: { severity: "error" | "warning" }) {
  if (severity === "error") {
    return (
      <div className="mt-1 shrink-0 text-destructive">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <title>エラー</title>
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="mt-1 shrink-0 text-orange-500">
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <title>警告</title>
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
