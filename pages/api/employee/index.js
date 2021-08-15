import { prisma } from "../../../lib/prisma";

async function createEmployee(employee) {
  const { name, nrc, dob, userId } = employee;

  const foundEmployee = await prisma.employee
    .findFirst({
      where: { userId },
    })
    .then((emp) => emp)
    .catch((err) => err);

  if (foundEmployee instanceof Error) return foundEmployee;
  if (foundEmployee !== null) return foundEmployee;

  return prisma.employee.create({
    data: {
      name,
      userId,
      nrc: nrc || undefined,
      dob: dob ? new Date(dob) : undefined,
    },
  });
}

async function updateEmployee(employee) {
  return prisma.employee.update({
    where: { id: employee.id },
    data: {
      name: employee.name || undefined,
      nrc: employee.nrc || undefined,
      dob: employee.dob ? new Date(employee.dob) : undefined,
      updatedAt: new Date(),
    },
  });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const employee = await createEmployee(req.body).catch((e) => e);

    if (employee instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while creating new employee!",
        data: null,
        error: employee,
      });

    return res.status(200).json({
      success: true,
      message: "Employee created!",
      data: employee,
      error: null,
    });
  } else if (req.method === "PUT") {
    const employee = await updateEmployee(req.body).catch((e) => e);

    if (employee instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error while updating employee!",
        data: null,
        error: employee,
      });

    return res.status(200).json({
      success: true,
      message: "Employee updated!",
      data: employee,
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
