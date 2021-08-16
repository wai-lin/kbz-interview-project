import { format } from "date-fns";
import papaparse from "papaparse";

import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const foundUsers = await prisma.user
    .findMany({
      where: { email: { not: "admin@gmail.com" } },
      include: {
        employee: true,
      },
    })
    .then((u) => u)
    .catch((e) => e);

  if (foundUsers instanceof Error)
    return res.status(500).send("CSV Export Error!.");

  const csv = papaparse.unparse(
    foundUsers.map((user) => ({
      UserId: user.id,
      EmployeeId: user.employee.id,
      Email: user.email,
      Name: user.employee.name,
      DateOfBirth: user.employee.dob,
      NRC: user.employee.nrc,
    }))
  );

  const now = format(new Date(), "yyyy-MM-dd_hh-mm-ss-a");
  res.setHeader(
    "Content-disposition",
    `attachment; filename=employees-list_${now}.csv`
  );
  res.setHeader("Content-Type", "text/csv");
  return res.status(200).send(csv);
}
