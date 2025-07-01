import { useMemo } from "react";

export const DOTS = '...';

interface UsePaginationProps {
    totalPages: number;
    siblingCount?: number;  // 現在のページの前後に表示するページ個数
    currentPage: number;
}

const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({length}, (_, index) => index + start);
}

export const usePagination = ({totalPages, siblingCount = 1, currentPage}: UsePaginationProps) => {
    const paginationRange = useMemo(() => {
        // ページネーション枠の個数（例: 1(先頭) + 1(末尾) + 1(現在) + 2*siblingCount + 2(DOTS) = 7）
        const totalPageNumbers = siblingCount + 5;
        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        // 表示するページ番号の数より総ページ数が少ない場合
        if(totalPageNumbers >= totalPages) {
            return range(firstPageIndex, lastPageIndex);
        }

        // それ以外の場合の準備処理
        // 兄弟ページの先頭/末尾の番号を計算
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
        // DOTSが必要かの判断
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowrightDots = rightSiblingIndex < totalPages -2;


        // 右側のDOTSだけ表示する場合
        if(!shouldShowLeftDots && shouldShowrightDots) {
            // DOTSより左側の個数
            const leftItemCount = 3 + siblingCount * 2;
            const leftRange = range(firstPageIndex, leftItemCount);
            return [...leftRange, DOTS, lastPageIndex];
        }

        // 左側のDOTSだけ表示する場合
        if(shouldShowLeftDots && !shouldShowrightDots) {
            // DOTSより右側の個数
            const rightItemCount = 3 + siblingCount * 2;
            const rightRange = range(lastPageIndex - rightItemCount +1, lastPageIndex);
            return [firstPageIndex, DOTS, ...rightRange];
        }

        // 左右にDOTSを表示する場合
        if(shouldShowLeftDots && shouldShowrightDots) {
            const middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }
    },[totalPages, siblingCount, currentPage]);

    return paginationRange;
}