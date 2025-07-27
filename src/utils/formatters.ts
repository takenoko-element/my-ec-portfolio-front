// src/utils/formatters.ts

/**
 * 数値を日本円の形式（カンマ区切り、小数点なし）にフォーマットします。
 * @param value フォーマットする数値
 * @returns フォーマットされた文字列
 */

export const formatPriceJpy = (value: number): string => {
  // NaNやInfinityの場合のエラーハンドリング
  if (isNaN(value) || !isFinite(value)) {
    return 'N/A';
  }
  return new Intl.NumberFormat('ja-JP', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * 米ドルの表示形式（小数点以下2桁、カンマ区切り）にフォーマットします。
 * 必要であれば、style: 'currency', currency: 'USD' に変更することも可能。
 * @param value フォーマットする数値
 * @returns フォーマットされた文字列
 */

export const formatPriceUsd = (value: number): string => {
  if (isNaN(value) || !isFinite(value)) {
    return 'N/A';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2, // 常に小数点以下2桁を表示
    maximumFractionDigits: 2, // 小数点以下2桁に制限
  }).format(value);
};
