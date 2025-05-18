import { render, screen } from '@testing-library/react';
import App from './App';

// Vitest の describe, it, expect を使う (globals: true なら不要な場合もある)
import { describe, it, expect } from 'vitest'; 

describe('App Component', () => {
  it.skip('renders Vite + React heading (or some known text)', () => {
    render(<App />);
    
    // App.tsx が実際に表示するテキストに合わせて調整してください。
    // Vite + React のデフォルトテンプレートなら "Vite + React" という見出しがあります。
    const headingElement = screen.getByRole('heading', { name: /vite \+ react/i });
    expect(headingElement).toBeInTheDocument();
  });

  // Vitestが動作しているかを確認するための非常に基本的なテスト
  it.skip('should pass a simple arithmetic test', () => {
    expect(1 + 1).toBe(2);
  });

  it.skip("my test",() => {
    render(<App />);
    expect(screen.getByText('Click on the Vite and React logos to learn more')).toBeInTheDocument();
  });
});