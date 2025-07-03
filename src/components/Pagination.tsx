import { usePagination, DOTS } from './Hooks/usePagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  siblingCount = 1,
  onPageChange,
}: PaginationProps) => {
  const paginationRange = usePagination({
    totalPages,
    siblingCount,
    currentPage,
  });
  if (totalPages <= 1 || !paginationRange) return null;

  const onNext = () => {
    onPageChange(currentPage + 1);
  };
  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };
  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul className="flex list-none items-center justify-center space-x-1">
      <li>
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
        >
          前へ
        </button>
      </li>
      {paginationRange.map((pageNumber, index) => {
        const key =
          pageNumber === DOTS ? `DOTS-${index}` : `page-${pageNumber}`;
        if (pageNumber === DOTS) {
          return (
            <li key={key} className="px-3 py-2 text-gray-400">
              &#8230;
            </li>
          );
        }
        return (
          <li key={key}>
            <button
              type="button"
              onClick={() => onPageChange(pageNumber as number)}
              className={`px-3 py-2 leading-tight border ${
                currentPage === pageNumber
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {pageNumber}
            </button>
          </li>
        );
      })}
      <li>
        <button
          type="button"
          onClick={onNext}
          disabled={currentPage === lastPage}
          className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
        >
          次へ
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
