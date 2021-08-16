import { prisma } from "../../../lib/prisma";
import { endOfMonth } from "date-fns";

async function findHolidaysByYearAndMonth({ year, month }) {
  const compareMonthStartDate = new Date(year, month, 1, 0, 0, 0, 0);
  const compareMonthEndDate = endOfMonth(compareMonthStartDate);

  return await prisma.publicHoliday
    .findMany({
      where: {
        startDate: {
          gte: compareMonthStartDate,
          lte: compareMonthEndDate,
        },
      },
    })
    .then((d) => d)
    .catch((e) => e);
}

async function createHoliday(holiday) {
  return await prisma.publicHoliday
    .create({
      data: {
        name: holiday.name,
        startDate: new Date(holiday.startDate),
        endDate: new Date(holiday.endDate),
      },
    })
    .then((d) => d)
    .catch((e) => e);
}

async function updateHoliday(holiday) {
  return await prisma.publicHoliday
    .update({
      where: { id: holiday.id },
      data: {
        name: holiday.name ? holiday.name : undefined,
        startDate: holiday.startDate ? holiday.startDate : undefined,
        endDate: holiday.endDate ? holiday.endDate : undefined,
        updatedAt: new Date(),
      },
    })
    .then((d) => d)
    .catch((e) => e);
}

async function dangerouslyDeleteHoliday(id) {
  return await prisma.publicHoliday
    .delete({
      where: { id },
    })
    .then((d) => d)
    .catch((e) => d);
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const foundHolidays = await findHolidaysByYearAndMonth(req.query).catch(
      (e) => e
    );

    if (foundHolidays instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while finding holidays!",
        data: null,
        error: foundHolidays,
      });

    return res.status(200).json({
      success: true,
      message: "Public Holidays found!",
      data: foundHolidays,
      error: null,
    });
  } else if (req.method === "POST") {
    const createdHoliday = await createHoliday(JSON.parse(req.body)).catch(
      (e) => e
    );

    if (createdHoliday instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while creating holiday!",
        data: null,
        error: createdHoliday,
      });

    return res.status(200).json({
      success: true,
      message: "Public Holidays created!",
      data: createdHoliday,
      error: null,
    });
  } else if (req.method === "PUT") {
    const updatedHoliday = await updateHoliday(JSON.parse(req.body)).catch(
      (e) => e
    );

    if (updatedHoliday instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while updating holiday!",
        data: null,
        error: updatedHoliday,
      });

    return res.status(200).json({
      success: true,
      message: "Public Holidays updated!",
      data: updatedHoliday,
      error: null,
    });
  } else if (req.method === "DELETE") {
    const deletedHoliday = await dangerouslyDeleteHoliday(req.query.id).catch(
      (e) => e
    );

    if (deletedHoliday instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while updating holiday!",
        data: null,
        error: deletedHoliday,
      });

    return res.status(200).json({
      success: true,
      message: "Public Holidays updated!",
      data: deletedHoliday,
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
