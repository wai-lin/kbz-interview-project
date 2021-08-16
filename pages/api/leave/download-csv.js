import { prisma } from "../../../lib/prisma";
import { format } from "date-fns";
import papaparse from "papaparse";

export default async function handler(req, res) {
  const foundLeaveForms = await prisma.leaveForm
    .findMany({
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            nrc: true,
            dob: true,
          },
        },
      },
    })
    .then((u) => u)
    .catch((e) => e);

  if (foundLeaveForms instanceof Error)
    return res.status(500).send("CSV Export Error!.");

  const csv = papaparse.unparse(
    foundLeaveForms.map((leaveForm) => ({
      Id: leaveForm.id,
      LeaveCode: leaveForm.code,
      LeaveReason: leaveForm.reason,
      LeaveStartDate: leaveForm.leaveStartDate,
      LeaveEndDate: leaveForm.leaveEndDate,
      EmployeeId: leaveForm.employee.id,
      EmployeeName: leaveForm.employee.name,
      DateOfBirth: leaveForm.employee.dob,
      NRC: leaveForm.employee.nrc,
    }))
  );

  const now = format(new Date(), "yyyy-MM-dd_hh,mm,ss,a");
  res.setHeader(
    "Content-disposition",
    `attachment; filename=leaves-report_${now}.csv`
  );
  res.setHeader("Content-Type", "text/csv");
  return res.status(200).send(csv);
}
