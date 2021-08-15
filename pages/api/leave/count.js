import { prisma } from "../../../lib/prisma";

async function countUnApprovedLeaveForms() {
  return await prisma.leaveForm
    .count({
      where: { isApproved: false },
    })
    .then((d) => d)
    .catch((e) => e);
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const leaveFormsCount = await countUnApprovedLeaveForms().catch((e) => e);

    if (leaveFormsCount instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while counting leave forms!",
        data: null,
        error: leaveFormsCount,
      });

    return res.status(200).json({
      success: true,
      message: "UnApproved leave form count!",
      data: leaveFormsCount,
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
