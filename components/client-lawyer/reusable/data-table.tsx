import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DataTable({
  columns,
  children,
}: {
  columns: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="border border-secondary overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-secondary">
            {columns.map((column) => (
              <TableHead
                key={column}
                className="px-5 py-3 uppercase text-primary/40 text-xs"
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}
