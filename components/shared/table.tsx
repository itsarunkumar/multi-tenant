"use client";

import React from "react";

// Define column types
type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
};

// Define props for the Table component
type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  className?: string;
};

function Table<T>({ columns, data, onRowClick, className }: TableProps<T>) {
  return (
    <div className={`overflow-x-auto shadow-md sm:rounded-lg ${className}`}>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        {/* Table Header */}
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${
                rowIndex % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : ""
              } ${
                onRowClick
                  ? "hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  : ""
              }`}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 ${col.className || ""}`}
                >
                  {col.render
                    ? col.render(row[col.accessor], row)
                    : String(row[col.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
