import { prisma } from "../../lib/prisma";

function findUser(user) {
  const { email, password } = user;
  return prisma.user.findFirst({
    where: {
      email,
      password,
    },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export default function handler(req, res) {
  if (req.method === "POST") {
    return findUser(req.body)
      .then((user) => {
        if (user === null)
          return res.status(404).json({
            success: false,
            message: "User not found or incorrect password!",
            data: null,
            error: null,
          });
        else
          return res.status(200).json({
            success: true,
            message: "success",
            data: user,
            error: null,
          });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: "Error while searching user!",
          data: null,
          error: err,
        });
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
