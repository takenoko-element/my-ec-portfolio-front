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