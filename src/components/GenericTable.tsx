import {
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { colors } from "../constans/colors";

type Column<T = any> = {
  key: string;
  title: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T = any> = {
  columns: Column<T>[];
  data: T[];
  page: number;
  totalPages: number;
  totalElements: number;
  rowsPerPage: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  onRowClick?: (row: T) => void;
};

export function GenericTable<T>({ columns, data, page, totalPages, totalElements, rowsPerPage, onPageChange, onRowsPerPageChange, onRowClick }: Props<T>) {
  return (
    <TableContainer
      component={Paper}
      className="rounded-xl shadow-md border border-orange-200"
    >
      <Table size="small">
        <TableHead className="bg-white">
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                sx={{
                  py: 1.5,
                  px: 1.5,
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                {col.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row: any, idx: number) => (
            <TableRow
              key={idx}
              onClick={() => onRowClick && onRowClick(row)}
              className="cursor-pointer hover:bg-orange-50 transition-colors"
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{
                    border: "none",
                    justifyItems: "center",
                    textAlign: "center",
                  }}
                >
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length} align="center">
              <div className="flex items-center justify-center gap-4">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => onPageChange && onPageChange(value)}
                color="primary"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  "& .MuiPaginationItem-root": {
                    color: "#ffffff",
                    backgroundColor: colors.secondary,
                    borderRadius: "8px",
                    border: `1px solid ${colors.secondary}`,
                    "&:hover": {
                      backgroundColor: colors.secondary,
                      borderColor: colors.secondary,
                      opacity: 0.5
                    },
                    "&.Mui-selected": {
                      backgroundColor: colors.selected,
                      borderColor: colors.selected,
                      color: colors.primary,
                      "&:hover": {
                        backgroundColor: colors.selected,
                        borderColor: colors.selected,
                        opacity: 1, 
                      },
                    },
                  },
                }}
              />
              <div className="flex items-center gap-2">
                <select
                  value={rowsPerPage}
                  onChange={(e) => onRowsPerPageChange && onRowsPerPageChange(Number(e.target.value))}
                  className="border px-2 py-1 text-sm"
                  style={{
                    borderRadius: "8px",
                    height: 36,
                    lineHeight: "36px",
                    backgroundColor: "#f97316",
                    color: "#ffffff",
                    borderColor: "#f97316",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {[10, 20, 30, 40, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span
                  className="text-sm font-medium text-gray-700"
                  style={{ lineHeight: "36px" }}
                >
                  de {totalElements}
                </span>
              </div>
              
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default GenericTable;
