import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ListPaginationProps {
  page: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const PaginationTable: React.FC<ListPaginationProps> = ({
  page,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalItems);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink
            onClick={() => onPageChange(1)}
            className="h-8 sm:h-10 w-8 sm:w-10 text-xs sm:text-sm cursor-pointer hover:bg-gray-200"
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis className="h-8 sm:h-10 w-8 sm:w-10" />
          </PaginationItem>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={page === i}
            className={`h-8 sm:h-10 w-8 sm:w-10 text-xs sm:text-sm cursor-pointer ${
              page === i ? "bg-primary text-primary-foreground" : "hover:bg-gray-200"
            }`}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis className="h-8 sm:h-10 w-8 sm:w-10" />
          </PaginationItem>,
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            className="h-8 sm:h-10 w-8 sm:w-10 text-xs sm:text-sm cursor-pointer hover:bg-gray-200"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 p-3 sm:p-4 border-t bg-gray-50 rounded-b-2xl">
      <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
        <span className="hidden sm:inline">
          Showing {startIndex}-{endIndex} of {totalItems}
        </span>
        <span className="sm:hidden">
          {startIndex}-{endIndex} of {totalItems}
        </span>
      </div>

      <div className="order-1 sm:order-2">
        <Pagination>
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(page - 1)}
                className={`h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm ${
                  page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gray-200"
                }`}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(page + 1)}
                className={`h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm ${
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-gray-200"
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationTable;
