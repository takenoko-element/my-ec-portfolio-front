/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';

// Vitest環境でjest-domのマッチャーをより完全に利用したい場合、
// Vitest用の拡張をインポートすることもできますが、多くの場合上記だけで機能します。
// import '@testing-library/jest-dom/vitest';
// または、以下のように個別にマッチャーをインポートして拡張することも可能です。
// import { expect } from 'vitest';
// import * as matchers from '@testing-library/jest-dom/matchers';
// expect.extend(matchers);

// 他にテスト全体で必要な共通セットアップがあればここに追加できます。
// 例えば、特定のモックを全テストで使いたい場合など。

import { server } from './mocks/server'; // 作成したMSWサーバーをインポート
import '@testing-library/jest-dom'; // 既存のjest-domのセットアップもここ

// すべてのテストの前にサーバーを起動
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' })); // 未処理のリクエストは警告を出す

// 各テストの後にハンドラをリセット (テスト間の影響を防ぐ)
afterEach(() => server.resetHandlers());

// すべてのテストの後にサーバーを停止
afterAll(() => server.close());