import { prisma } from "../../../lib/prisma";

async function findHolidayById(id) {
  return await prisma.publicHoliday
    .findFirst({
      where: { id },
    })
    .then((d) => d)
    .catch((e) => e);
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const foundHoliday = await findHolidayById(req.query.id).catch((e) => e);

    if (foundHoliday instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while searching public holiday!",
        data: null,
        error: foundHoliday,
      });

    return res.status(200).json({
      success: true,
      message: "Public holiday found!",
      data: foundHoliday,
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
