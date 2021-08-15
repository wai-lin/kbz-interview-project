import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const count = await prisma.employee
      .count()
      .then((c) => c)
      .catch((e) => e);

    if (count instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while counting employees!",
        data: null,
        error: count,
      });

    return res.status(200).json({
      success: true,
      message: "Employees counted!",
      data: count,
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
