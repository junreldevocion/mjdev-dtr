

import DTR, { IDTR } from "@/model/dtrModel";
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, Table, TableFooter } from "./ui/table";
import DeleteDTR from "./DeleteDTR";


const List = async () => {

  const dtrList: IDTR[] = await DTR.find();

  return (
    <div className="pt-4 relative overflow-auto">
      <Table className="w-full">
        <TableCaption>A list of your DTR.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Date</TableHead>
            <TableHead className="whitespace-nowrap">Time in</TableHead>
            <TableHead className="whitespace-nowrap">Time out</TableHead>
            <TableHead className="whitespace-nowrap">Hours worked</TableHead>
            <TableHead className="whitespace-nowrap">Overtime</TableHead>
            <TableHead className="whitespace-nowrap">Undertime</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dtrList.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">No DTR data available</TableCell>
            </TableRow>
          )}
          {dtrList.map(({ timeIn, timeOut, timeInOutDate, overtime, hoursWorked, undertime, _id: id }, index) => {
            const formatOvertime = `${overtime.split('.')[0]} hours ${overtime.split('.')[1]} minutes`;
            const formatHoursWorked = `${hoursWorked.split('.')[0]} hours ${hoursWorked.split('.')[1]} minutes`;
            const formatUndertime = `${undertime.split('.')[0]} hours ${undertime.split('.')[1]} minutes`;
            return (
              <TableRow key={index}>
                <TableCell className="whitespace-nowrap">{new Date(timeInOutDate).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium whitespace-nowrap">{new Date(timeIn).toLocaleTimeString()}</TableCell>
                <TableCell className="font-medium whitespace-nowrap">{new Date(timeOut).toLocaleTimeString()}</TableCell>
                <TableCell className="font-medium whitespace-nowrap">{formatHoursWorked}</TableCell>
                <TableCell className="font-medium whitespace-nowrap">{formatOvertime}</TableCell>
                <TableCell className="font-medium whitespace-nowrap">{formatUndertime}</TableCell>
                <TableCell><DeleteDTR id={id} /></TableCell>
              </TableRow>
            )
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="font-medium">Total</TableCell>
            <TableCell className="font-medium whitespace-nowrap">
              {(dtrList.reduce((total, { hoursWorked }) => (total + parseFloat(hoursWorked)), 0)).toFixed(2)} hours
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default List;