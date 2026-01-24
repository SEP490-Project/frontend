import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export type BadgeVariant = "campaignStatus" | "contractStatus" | "contractType" | "productType";

export type TableCellValue =
  | string
  | number
  | null
  | undefined
  | {
      type: "badge";
      value: string;
      variant: BadgeVariant;
    }
  | {
      type: "action";
      label: string;
      href: string;
    };

export interface TableWidgetProps {
  title?: string;
  data: Record<string, TableCellValue>[];
  hiddenColumns?: string[];
  tooltip?: string;
  navigate?: (url: string) => void;
}

const BADGE_STYLES: Record<BadgeVariant, Record<string, string>> = {
  contractStatus: {
    DRAFT: "bg-gray-100 text-gray-800 border-gray-300",
    ACTIVE: "bg-green-100 text-green-800 border-green-300",
    EXPIRED: "bg-red-100 text-red-800 border-red-300",
    TERMINATED: "bg-orange-100 text-orange-800 border-orange-300",
  },
  contractType: {
    BRAND_AMBASSADOR: "bg-purple-100 text-purple-800 border-purple-300",
    ADVERTISING: "bg-blue-100 text-blue-800 border-blue-300",
    CO_PRODUCING: "bg-indigo-100 text-indigo-800 border-indigo-300",
    AFFILIATE: "bg-pink-100 text-pink-800 border-pink-300",
  },
  campaignStatus: {
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    CANCELED: "bg-red-100 text-red-800 border-red-200",
    RUNNING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
    PAUSED: "bg-orange-100 text-orange-800 border-orange-200",
  },
  productType: {
    STANDARD: "bg-blue-100 text-blue-800 border-blue-300",
    LIMITED: "bg-amber-100 text-amber-800 border-amber-300",
  },
};

const renderCell = (cell: TableCellValue, navigate?: (url: string) => void) => {
  if (cell === null || cell === undefined) return "-";

  if (typeof cell === "string" || typeof cell === "number") {
    return String(cell);
  }

  if (cell.type === "badge") {
    const className =
      BADGE_STYLES[cell.variant]?.[cell.value] ?? "bg-gray-100 text-gray-800 border-gray-300";

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${className}`}
      >
        {cell.value}
      </span>
    );
  }

  if (cell.type === "action") {
    const commonClasses = `
        inline-flex items-center justify-center
        px-3 py-1.5
        text-xs font-medium
        rounded-md
        border border-primary
        text-primary
        hover:bg-primary hover:text-white
        transition
        cursor-pointer
      `;

    if (navigate) {
      return (
        <a
          href={cell.href}
          onClick={(e) => {
            e.preventDefault();
            navigate(cell.href);
          }}
          className={commonClasses}
        >
          {cell.label}
        </a>
      );
    }

    return (
      <a href={cell.href} className={commonClasses}>
        {cell.label}
      </a>
    );
  }

  return "-";
};

function TableWidget({ title, data, hiddenColumns = [], tooltip, navigate }: TableWidgetProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="py-6 text-center text-sm text-muted-foreground">No data available</div>;
  }

  const firstRow = data[0];

  const columns = Object.keys(firstRow).filter(
    (key) => key !== "id" && !hiddenColumns.includes(key),
  );

  return (
    <div className="rounded-md border bg-white overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{title}</h3>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60">
            {columns.map((col) => (
              <TableHead
                key={col}
                className="text-xs uppercase tracking-wide text-muted-foreground"
              >
                {col.replace(/_/g, " ")}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={(row as any).id ?? rowIndex}>
              {columns.map((col) => (
                <TableCell key={col}>{renderCell(row[col], navigate)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TableWidget;
