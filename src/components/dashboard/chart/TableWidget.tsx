import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  title: string;
  data: any[];
}

function TableWidget({ title, data }: Props) {
  const hasData = Array.isArray(data) && data.length > 0;

  if (!hasData) {
    return (
      <div className="p-4 rounded-lg border bg-white">
        <h3 className="text-sm font-semibold mb-2">{title}</h3>
        <div className="text-sm text-muted-foreground italic">No data available</div>
      </div>
    );
  }

  const firstItem = data[0];
  const isSimple = typeof firstItem === "string" || typeof firstItem === "number";

  return (
    <div className="p-4 rounded-lg border bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>

      {isSimple ? (
        <ul className="space-y-1 text-sm">
          {data.map((item, i) => (
            <li key={i} className="px-3 py-2 border rounded-md bg-muted">
              {String(item)}
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60">
                {Object.keys(firstItem).map((key) => (
                  <TableHead
                    key={key}
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {key.replace(/_/g, " ")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  {Object.values(row).map((value, j) => (
                    <TableCell key={j}>{value != null ? String(value) : "-"}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default TableWidget;
