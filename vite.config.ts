/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // describe, it, expect などをグローバルに利用可能にする
    environment: 'jsdom', // テスト環境としてjsdomを使用する
    setupFiles: './src/setupTests.ts', // (推奨) テストのグローバルセットアップファイル
    css: true, // CSSの処理を有効にする (CSS Modulesなどを使っている場合に便利)
  },
})
