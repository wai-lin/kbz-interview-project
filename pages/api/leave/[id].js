import { prisma } from "../../../lib/prisma";

async function findLeaveById(id) {
  return await prisma.leaveForm
    .findFirst({
      where: { id },
    })
    .then((found) => found)
    .catch((e) => e);
}

async function updateLeave(id, leaveForm) {
  return await prisma.leaveForm
    .update({
      where: { id },
      data: {
        isApproved: leaveForm.isApproved ? leaveForm.isApproved : false,
        leaveStartDate: leaveForm.leaveStartDate
          ? new Date(leaveForm.leaveStartDate)
          : undefined,
        leaveEndDate: leaveForm.leaveEndDate
          ? new Date(leaveForm.leaveEndDate)
          : undefined,
      },
    })
    .then((d) => d)
    .catch((e) => e);
}

async function dangerouslyDeleteLeave(id) {
  return await prisma.leaveForm
    .delete({
      where: { id },
    })
    .then((d) => d)
    .catch((e) => e);
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const foundLeave = await findLeaveById(req.query.id).catch((e) => e);

    if (foundLeave instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while finding leave form!",
        data: null,
        error: foundLeave,
      });

    return res.status(200).json({
      success: true,
      message: "Leave form found!",
      data: foundLeave,
      error: null,
    });
  } else if (req.method === "PUT") {
    const updatedLeave = await updateLeave(
      req.query.id,
      JSON.parse(req.body)
    ).catch((e) => e);

    if (updateLeave instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while updating leave form!",
        data: null,
        error: updatedLeave,
      });

    return res.status(200).json({
      success: true,
      message: "Leave form updated!",
      data: updatedLeave,
      error: null,
    });
  } else if (req.method === "DELETE") {
    const deletedLeave = await dangerouslyDeleteLeave(req.query.id).catch(
      (e) => e
    );

    if (deletedLeave instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while deleting leave form!",
        data: null,
        error: deletedLeave,
      });

    return res.status(200).json({
      success: true,
      message: "Leave form deleted!",
      data: deletedLeave,
      error: null,
    });
  } else
    return res.status(500).json({
      success: false,
      message: "Request method not supported!",
      data: null,
      error: null,
    });
}
