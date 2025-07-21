import { Pagination } from "react-bootstrap";
import "./style.css";
import { useEffect, useCallback } from "react";

const CustomPagination = ({ pagination, setFilters }) => {
  const { perPage, totalRecords, currentPage, totalPages } = pagination;

  // Ensure perPage is a number and not a string
  const itemsPerPage = parseInt(perPage, 10) || 10;
  const active = currentPage;
  let items = [];

  const handlePageChange = useCallback(
    (pageNumber) => {
      setFilters((prev) => ({ ...prev, page: pageNumber }));
    },
    [setFilters]
  );

  const handleFirstPage = () => handlePageChange(1);
  const handlePrevPage = () => active > 1 && handlePageChange(active - 1);
  const handleNextPage = () =>
    active < totalPages && handlePageChange(active + 1);
  const handleLastPage = () => handlePageChange(totalPages);

  if (totalPages <= 7) {
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === active}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
  } else {
    if (active > 4) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      items.push(<Pagination.Ellipsis key="start-ellipsis" />);
    }

    const startPage = Math.max(active - 2, 1);
    const endPage = Math.min(active + 2, totalPages);

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === active}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    if (active < totalPages - 3) {
      items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
  }

  // Calculate the range of items being displayed
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalRecords);

  // Effect to handle page change when perPage is updated
  // useEffect(() => {
  //   if (itemsPerPage >= totalRecords) {
  //     handlePageChange(1);
  //   }
  // }, [itemsPerPage, totalRecords, handlePageChange]);

  return (
    <div className="customPagination">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center flex-wrap gap-2">
        <div className="">
          <p className="paginationText">
            Showing {totalRecords > 0 ? startItem : 0} to {endItem} Out Of{" "}
            {totalRecords} Entries
          </p>
        </div>
        <div className="">
          <Pagination>
            {/* <Pagination.First onClick={handleFirstPage} /> */}
            <Pagination.Prev onClick={handlePrevPage}>Previous</Pagination.Prev>
            {items}
            <Pagination.Next onClick={handleNextPage}>Next</Pagination.Next>
            {/* <Pagination.Last onClick={handleLastPage} /> */}
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default CustomPagination;
