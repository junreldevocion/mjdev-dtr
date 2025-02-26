import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, Table, TableFooter } from "./ui/table"

const List = () => {
  return (<div className="pt-4">
    <Table>
      <TableCaption>A list of your DTR.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time in</TableHead>
          <TableHead>Time out</TableHead>
          <TableHead>OT</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Feb. 24, 2025</TableCell>
          <TableCell className="font-medium">07:02AM</TableCell>
          <TableCell className="font-medium">05:05PM</TableCell>
          <TableCell className="font-medium">0</TableCell>
          <TableCell className="font-medium">8 hours and 30 mins</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="font-medium">Total</TableCell>
          <TableCell className="font-medium">8 hours and 12 mins</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  </div>
  )
}

export default List