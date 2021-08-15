import { prisma } from "../../../../lib/prisma";

async function findLeaveFormsByEmployee({ id, year }) {
  return await prisma.employee
    .findFirst({
      where: {
        id,
        leaveForms: {
          every: {
            leaveStartDate: {
              gte: new Date(year, 0, 1, 0, 0, 0, 0),
              lte: new Date(year, 11, 31, 0, 0, 0, 0),
            },
          },
        },
      },
      select: {
        id: true,
        leaveForms: true,
      },
    })
    .then((d) => d)
    .catch((e) => e);
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id, year } = req.query;
    const foundLeaveForms = await findLeaveFormsByEmployee({
      id,
      year: Number(year),
    }).catch((e) => e);

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
  } else {
    return res.status(500).json({
      success: false,
      message: "Response method not supported!",
      data: null,
      error: null,
    });
  }
}
