

import DTR, { IDTR } from "@/model/dtrModel";
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, Table, TableFooter } from "./ui/table";


const List = async () => {

  const dtrList: IDTR[] = await DTR.find();

  return (
    <div className="pt-4 relative overflow-auto">
      <Table className="w-full">
        <TableCaption>A list of your DTR.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time in</TableHead>
            <TableHead>Time out</TableHead>
            <TableHead>Hours worked</TableHead>
            <TableHead>Overtime</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dtrList.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">No DTR data available</TableCell>
            </TableRow>
          )}
          {dtrList.map(({ timeIn, timeOut, timeInOutDate, overtime, hoursWorked, undertime }, index) => {
            const formatOvertime = `${overtime.split('.')[0]} hours ${overtime.split('.')[1]} minutes`;
            const formatHoursWorked = `${hoursWorked.split('.')[0]} hours ${hoursWorked.split('.')[1]} minutes`;
            const formatUndertime = `${undertime.split('.')[0]} hours ${undertime.split('.')[1]} minutes`;
            return (
              <TableRow key={index}>
                <TableCell>{new Date(timeInOutDate).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{new Date(timeIn).toLocaleTimeString()}</TableCell>
                <TableCell className="font-medium">{new Date(timeOut).toLocaleTimeString()}</TableCell>
                <TableCell className="font-medium">{formatHoursWorked}</TableCell>
                <TableCell className="font-medium">{formatOvertime}</TableCell>
                <TableCell className="font-medium">{formatUndertime}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="font-medium">Total</TableCell>
            <TableCell className="font-medium">
              {(dtrList.reduce((total, { hoursWorked }) => (total + parseFloat(hoursWorked)), 0)).toFixed(2)} hours
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default List;