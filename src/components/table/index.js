import React, { useState, useMemo, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import "./Table.css";
import Loader from "../loader";
import { useLocation } from "react-router-dom";

const Table = ({ dataSource, columns, resize, hideshow }) => {
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [searchTerms, setSearchTerms] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [columnWidths, setColumnWidths] = useState({});
  const [visibleColumns, setVisibleColumns] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation();
  const tableRef = useRef(null);

  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      setCurrentPage(Number(savedPage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    const pathname = window.location.pathname.replace(/\//g, "-") || "default";
    const savedWidths =
      JSON.parse(localStorage.getItem(`columnWidths-${pathname}`)) || {};
    setColumnWidths(savedWidths);

    const savedVisibility =
      JSON.parse(localStorage.getItem(`columnVisibility-${pathname}`)) || {};
    setVisibleColumns(savedVisibility);
  }, [columns]);

  useEffect(() => {
    const pathname = window.location.pathname.replace(/\//g, "-") || "default";
    localStorage.setItem(
      `columnWidths-${pathname}`,
      JSON.stringify(columnWidths)
    );
    localStorage.setItem(
      `columnVisibility-${pathname}`,
      JSON.stringify(visibleColumns)
    );
  }, [columnWidths, visibleColumns]);

  useEffect(() => {
    localStorage.setItem("columnWidths", JSON.stringify(columnWidths));
    localStorage.setItem("columnVisibility", JSON.stringify(visibleColumns));
  }, [columnWidths, visibleColumns]);

  const handleSort = (column) => {
    const newDirection =
      sortedColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    setSortedColumn(column);
  };

  const handleSearchChange = (e, column) => {
    setSearchTerms({
      ...searchTerms,
      [column.dataIndex]: e.target.value,
    });
  };

  const handleGlobalSearchChange = (e) => {
    setGlobalSearchTerm(e.target.value);
  };

  const handleMouseDown = (e, index) => {
    const startX = e.clientX;
    const thElement = tableRef.current.querySelectorAll("th")[index];
    const startWidth = thElement.offsetWidth;

    const handleMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      setColumnWidths((prevWidths) => ({
        ...prevWidths,
        [index]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const newVisibility = {};
    columns?.forEach((column) => {
      newVisibility[column.dataIndex] = checked;
    });

    if (!checked) {
      const firstColumn = columns[0].dataIndex;
      newVisibility[firstColumn] = true;
    }

    setVisibleColumns(newVisibility);
  };

  const handleColumnVisibilityChange = (e, dataIndex) => {
    const checked = e.target.checked;
    const visibleColumnCount =
      Object.values(visibleColumns)?.filter(Boolean)?.length;

    if (!checked && visibleColumnCount === 1) {
      alert("At least one column must be visible.");
      return;
    }

    setVisibleColumns((prevVisibility) => ({
      ...prevVisibility,
      [dataIndex]: checked,
    }));
  };

  const filteredData = useMemo(() => {
    if (dataSource && dataSource?.length)
      return dataSource?.filter((row) => {
        const rowValues = columns?.map(
          (column) => row[column.dataIndex]?.toString().toLowerCase() || ""
        );
        const globalMatch = rowValues.some((value) =>
          value.includes(globalSearchTerm.toLowerCase())
        );
        const columnMatch = columns.every(
          (column) =>
            !column.search ||
            !searchTerms[column.dataIndex] ||
            row[column.dataIndex]
              ?.toString()
              .toLowerCase()
              .includes(searchTerms[column.dataIndex].toLowerCase())
        );
        return globalMatch && columnMatch;
      });
  }, [dataSource, columns, globalSearchTerm, searchTerms]);

  const sortedData = useMemo(() => {
    if (filteredData && filteredData?.length)
      return [...filteredData].sort((a, b) => {
        if (sortedColumn) {
          const aValue = a[sortedColumn];
          const bValue = b[sortedColumn];
          if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
          if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
  }, [filteredData, sortedColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData?.slice(start, end);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math?.ceil(sortedData?.length / pageSize);

  const exportToExcel = () => {
    if (dataSource && dataSource?.length) {
      const worksheet = XLSX.utils.json_to_sheet(dataSource);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const pathname =
        window.location.pathname.replace(/\//g, "-") || "default";
      XLSX.writeFile(workbook, `table-data-${pathname}.xlsx`);
    }
  };

  const columnMatches = useMemo(() => {
    const matchCount = {};
    filteredData?.forEach((row) => {
      columns?.forEach((column) => {
        const cellValue = row[column.dataIndex]?.toString().toLowerCase() || "";
        if (cellValue.includes(globalSearchTerm.toLowerCase())) {
          matchCount[column.dataIndex] =
            (matchCount[column.dataIndex] || 0) + 1;
        }
      });
    });
    return matchCount;
  }, [filteredData, columns, globalSearchTerm]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 100);
  }, [location?.pathname]);
  return (
    <div className="table-container">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search all columns..."
          value={globalSearchTerm}
          onChange={handleGlobalSearchChange}
          className="global-search-input"
        />

        <button onClick={exportToExcel} className="export-button">
          Export to Excel
        </button>
        {hideshow ? (
          <div className="relativePath">
            <button
              onClick={handleDropdownToggle}
              className="visibility-button"
            >
              Columns
            </button>
            {dropdownVisible && (
              <div className="multi-select-dropdown">
                <label className="dropdown-label">
                  <input
                    type="checkbox"
                    id="select-all"
                    onChange={handleSelectAll}
                  />
                  Select All
                </label>
                {columns?.map((column) => (
                  <label key={column.dataIndex} className="dropdown-label">
                    <input
                      type="checkbox"
                      checked={visibleColumns[column.dataIndex] !== false}
                      onChange={(e) =>
                        handleColumnVisibilityChange(e, column.dataIndex)
                      }
                    />
                    {column.title}
                  </label>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
      {console.log(dataSource)}
      <div className="antSimulate-container" ref={tableRef}>
        {!dataSource ? (
          <Loader />
        ) : (
          <table className="antSimulate-table">
            <thead>
              <tr>
                {columns?.map(
                  (column, index) =>
                    visibleColumns[column.dataIndex] !== false && (
                      <th
                        key={column.key}
                        onClick={() => handleSort(column.dataIndex)}
                        className="antSimulate-table-header"
                        style={{ width: columnWidths[index] || "auto" }}
                      >
                        <div className="table-header-content">
                          <div>
                            <span> {column.title}</span>
                            <span className="column-count">
                              ({columnMatches[column.dataIndex] || 0})
                            </span>
                            <span>
                              {" "}
                              {sortedColumn === column.dataIndex &&
                                (sortDirection === "asc" ? " 🔼" : " 🔽")}
                              {resize ? (
                                <div
                                  className="resize-handle"
                                  onMouseDown={(e) => handleMouseDown(e, index)}
                                />
                              ) : null}
                            </span>
                          </div>
                          {column.search && (
                            <input
                              type="text"
                              placeholder={`Search ${column.title}`}
                              value={searchTerms[column.dataIndex] || ""}
                              onChange={(e) => handleSearchChange(e, column)}
                              className="column-search-input"
                            />
                          )}
                        </div>
                      </th>
                    )
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData?.length > 0 ? (
                paginatedData?.map((row) => (
                  <tr key={row.key} className="antSimulate-table-row">
                    {columns?.map(
                      (column) =>
                        visibleColumns[column.dataIndex] !== false && (
                          <td
                            key={column.key}
                            className="antSimulate-table-cell"
                          >
                            {column.render
                              ? column.render(row[column.dataIndex], row)
                              : row[column.dataIndex]}
                          </td>
                        )
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns?.length}
                    className="antSimulate-table-cell"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div
        className="tableFooter"
        style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}
      >
        {" "}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>{" "}
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="page-size-selector"
        >
          {[10, 100, 150, 500, 1000, 2000, 4000, 100000]?.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Table;
