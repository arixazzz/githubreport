import type { ColumnMeta } from "./wherever/ColumnMeta";

declare module "@tanstack/react-table" {
  // extend ColumnMeta default
  interface ColumnMeta {
    headerClassName?: ColumnMeta["headerClassName"];
    cellClassName?: ColumnMeta["cellClassName"];
  }
}
