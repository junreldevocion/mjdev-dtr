

import DTR, { IDTR } from "@/model/dtrModel";
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, Table, TableFooter } from "./ui/table";
import DeleteDTR from "./DeleteDTR";
import { format } from "date-fns";


const DTRTable = async () => {

  const dtrList: IDTR[] = await DTR.find();

  const totalHours = (dtrList.reduce((total, { hoursWorked }) => (total + parseFloat(hoursWorked)), 0)).toFixed(2);

  const formattedHours = `${totalHours.split('.')[0]} hours ${totalHours.split('.')[1]} minutes`;

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

            const formattedTimeInOutDate = format(new Date(timeInOutDate), 'dd/MM/yyyy');
            const formattedTimeIn = format(new Date(timeIn), 'hh:mm a');
            const formattedTimeOut = format(new Date(timeOut), 'hh:mm a');

            return (
              <TableRow key={index}>
                <TableCell className="whitespace-nowrap">{formattedTimeInOutDate}</TableCell>
                <TableCell className="font-medium whitespace-nowrap">{formattedTimeIn}</TableCell>
                <TableCell className="font-medium whitespace-nowrap">{formattedTimeOut}</TableCell>
                <TableCell className="font-medium whitespace-nowrap">{formatHoursWorked}</TableCell>
                <TableCell className="font-medium whitespace-nowrap">{formatOvertime}</TableCell>
                <TableCell className="font-medium whitespace-nowrap">{formatUndertime}</TableCell>
                <TableCell><DeleteDTR id={id as string} /></TableCell>
              </TableRow>
            )
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="font-medium">Total</TableCell>
            <TableCell className="font-medium whitespace-nowrap">
              {formattedHours}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default DTRTable;