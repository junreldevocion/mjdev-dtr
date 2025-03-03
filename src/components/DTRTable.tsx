

import { IDTR } from "@/model/dtrModel";
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, Table, TableFooter } from "./ui/table";
import DeleteDTR from "./DeleteDTR";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import { calculateExactTime, formatTime } from "@/lib/utils";
import Link from "next/link";


interface DTRTableProps {
  dtrList: IDTR[];
}

const DTRTable: React.FC<DTRTableProps> = ({ dtrList }) => {

  const { hours: hoursWorked, minutes: minutesWorked } = calculateExactTime(dtrList, 'hoursWorked')
  const formattedTimeForHoursWorked = formatTime(hoursWorked.toString(), minutesWorked.toString());


  const { hours: hoursOvertime, minutes: minutesOvertime } = calculateExactTime(dtrList, 'overtime')
  const formattedTimeForOvertime = formatTime(hoursOvertime.toString(), minutesOvertime.toString());

  const { hours: hoursUndertime, minutes: minutesUndertime } = calculateExactTime(dtrList, 'undertime')
  const formattedTimeForUndertime = formatTime(hoursUndertime.toString(), minutesUndertime.toString());

  return (
    <div className="pt-4 relative overflow-auto">
      <Table className="w-full">
        <TableCaption>A list of your DTR.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Date</TableHead>
            <TableHead className="whitespace-nowrap">Time in</TableHead>
            <TableHead className="whitespace-nowrap">Time out</TableHead>
            <TableHead className="whitespace-nowrap text-center">Hours worked</TableHead>
            <TableHead className="whitespace-nowrap text-center">Overtime</TableHead>
            <TableHead className="whitespace-nowrap text-center">Undertime</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dtrList.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">No DTR data available</TableCell>
            </TableRow>
          )}
          {dtrList.map(({ timeIn, timeOut, timeInOutDate, overtime, hoursWorked, undertime, _id: id }, index) => {

            const formattedTimeInOutDate = format(new Date(timeInOutDate), 'dd/MM/yyyy');
            const formattedTimeIn = format(new Date(timeIn), 'hh:mm a');
            const formattedTimeOut = format(new Date(timeOut), 'hh:mm a');

            return (
              <TableRow key={index}>
                <TableCell className="font-medium whitespace-nowrap">{formattedTimeInOutDate}</TableCell>
                <TableCell className="font-medium whitespace-nowrap">{formattedTimeIn}</TableCell>
                <TableCell className="font-medium whitespace-nowrap">{formattedTimeOut}</TableCell>
                <TableCell className="font-medium whitespace-nowrap text-center">{hoursWorked}</TableCell>
                <TableCell className="font-medium whitespace-nowrap text-center">{overtime}</TableCell>
                <TableCell className="font-medium whitespace-nowrap text-center">{undertime}</TableCell>
                <TableCell className="flex gap-2  justify-center">
                  <DeleteDTR id={id as string} />
                  <Link href={`/${id}`}><Button variant="default"><Pencil /></Button></Link>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="font-medium">Total</TableCell>
            <TableCell className="font-medium whitespace-nowrap text-center">{formattedTimeForHoursWorked}</TableCell>
            <TableCell className="font-medium whitespace-nowrap text-center">{formattedTimeForOvertime}</TableCell>
            <TableCell className="font-medium whitespace-nowrap text-center ">{formattedTimeForUndertime}</TableCell>
            <TableCell className="font-medium whitespace-normal text-center"></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default DTRTable;