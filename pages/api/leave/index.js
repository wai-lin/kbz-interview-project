import { prisma } from "../../../lib/prisma";

async function findLeaveForms({ limit, skip, search }) {
  return await prisma.leaveForm
    .findMany({
      skip: skip ? Number(skip) : 0,
      take: limit ? Number(limit) : 10,
      orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
      where: search
        ? {
            OR: [
              { code: { contains: search } },
              { reason: { contains: search } },
              {
                employee: {
                  name: { contains: search },
                },
              },
              {
                employee: {
                  nrc: { contains: search },
                },
              },
              {
                employee: {
                  user: { email: { contains: search } },
                },
              },
            ],
          }
        : undefined,
      include: {
        employee: true,
      },
    })
    .then((d) => d)
    .catch((e) => e);
}

async function createLeave(leaveForm) {
  return await prisma.leaveForm
    .create({
      data: {
        employeeId: leaveForm.employeeId,
        leaveStartDate: new Date(leaveForm.leaveStartDate),
        leaveEndDate: new Date(leaveForm.leaveEndDate),
        reason: leaveForm.reason,
      },
    })
    .then((d) => d)
    .catch((e) => e);
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const foundLeaveForms = await findLeaveForms(req.query).catch((e) => e);

    if (foundLeaveForms instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while searching leave form!",
        data: null,
        error: foundLeaveForms,
      });

    return res.status(200).json({
      success: true,
      message: "Found leave forms!",
      data: foundLeaveForms,
      error: null,
    });
  } else if (req.method === "POST") {
    const createdLeave = await createLeave(JSON.parse(req.body)).catch(
      (e) => e
    );

    if (createdLeave instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while applying leave form!",
        data: null,
        error: createdLeave,
      });

    return res.status(200).json({
      success: true,
      message: "Leave form applied!",
      data: createdLeave,
      error: null,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Request method not supported!",
      data: null,
      error: null,
    });
  }
}
