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
import { ArrowIcon } from "../assets/icons/ArrowIcon";

type Column<T = any> = {
  key: string;
  title: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T = any> = {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
};

export function GenericTable<T>({ columns, data, onRowClick }: Props<T>) {
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
                className="py-2 text-sm text-gray-700 items-center flex"
              >
                <Typography
                  fontWeight={700}
                  fontSize="12px"
                  textAlign={"center"}
                >
                  {col.title}
                </Typography>
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
                    alignItems: "center",
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
              <div className="flex items-center justify-center gap-4 text-secondary">
                <button className="p-1 rounded hover:bg-orange-100">
                  <ArrowIcon width={18} height={18} />
                </button>

                <Typography fontWeight={700} fontSize="12px">
                  10 de 10
                </Typography>

                <button className="p-1 rounded hover:bg-orange-100 rotate-180">
                  <ArrowIcon width={18} height={18} />
                </button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default GenericTable;
