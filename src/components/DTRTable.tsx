import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table, TableFooter } from "./ui/table";
import DeleteDTR from "./DeleteDTR";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Pencil, Clock, Calendar, AlertCircle } from "lucide-react";
import { calculateExactTime, formatTime } from "@/lib/utils";
import Link from "next/link";
import { IDTR } from "@/model/dtr.model";

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

  const { hours: hoursDoubletime, minutes: minutesDoubletime } = calculateExactTime(dtrList, 'doubleTime')
  const formattedTimeForDoubleTime = formatTime(hoursDoubletime.toString(), minutesDoubletime.toString());

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Time Records</h2>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Time in</TableHead>
              <TableHead className="font-semibold">Time out</TableHead>
              <TableHead className="font-semibold text-center">Overtime</TableHead>
              <TableHead className="font-semibold text-center">Double time</TableHead>
              <TableHead className="font-semibold text-center">Hours worked</TableHead>
              <TableHead className="font-semibold text-center">Undertime</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dtrList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>No time records available</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              dtrList.map(({ timeIn, timeOut, timeInOutDate, overtime, hoursWorked, doubleTime, undertime, _id: id }, index) => {
                const formattedTimeInOutDate = format(timeInOutDate, 'MMM dd yyyy');
                const formattedTimeIn = format(timeIn, 'hh:mm a');
                const formattedTimeOut = format(timeOut, 'hh:mm a');

                return (
                  <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {formattedTimeInOutDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        {formattedTimeIn}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-red-500" />
                        {formattedTimeOut}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {overtime}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {doubleTime}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-medium">{hoursWorked}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        {undertime}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <DeleteDTR id={id as string} />
                        <Link href={`/dtr/${id}`}>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          <TableFooter>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="font-semibold">Total</TableCell>
              <TableCell className="text-center font-semibold">{formattedTimeForOvertime}</TableCell>
              <TableCell className="text-center font-semibold">{formattedTimeForDoubleTime}</TableCell>
              <TableCell className="text-center font-semibold">{formattedTimeForHoursWorked}</TableCell>
              <TableCell className="text-center font-semibold">{formattedTimeForUndertime}</TableCell>
              <TableCell className="text-center font-semibold">{dtrList.length} records</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default DTRTable;