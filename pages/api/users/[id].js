import { prisma } from "../../../lib/prisma";

function findUserById(id) {
  return prisma.user
    .findFirst({
      where: { id },
      include: {
        employee: true,
      },
    })
    .then((found) => found)
    .catch((e) => e);
}

async function dangerouslyDeleteUserById(id) {
  const employeeDelete = prisma.employee.deleteMany({ where: { userId: id } });
  const userDelete = prisma.user.delete({ where: { id } });
  return await prisma
    .$transaction([employeeDelete, userDelete])
    .then((d) => d)
    .catch((e) => e);
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const foundUser = await findUserById(req.query.id).catch((e) => e);

    if (foundUser instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while finding user!",
        data: null,
        error: foundUser,
      });

    return res.status(200).json({
      success: true,
      message: "User found!",
      data: foundUser,
      error: null,
    });
  } else if (req.method === "DELETE") {
    const deleteUser = await dangerouslyDeleteUserById(req.query.id).catch(
      (e) => e
    );

    if (deleteUser instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while deleting user!",
        data: null,
        error: deleteUser,
      });

    return res.status(200).json({
      success: true,
      message: "User deleted!",
      data: deleteUser,
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
