import { prisma } from "../../lib/prisma";

async function findUsers(query) {
  const { cursor, limit, search } = query;

  return await prisma.user
    .findMany({
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        email: { not: "admin@gmail.com" },
        employee: {
          name: search ? { contains: search } : undefined,
        },
      },
      orderBy: [{ createdAt: "desc" }, { email: "asc" }],
      include: {
        employee: true,
      },
      take: limit ? Number(limit) : 10,
    })
    .then((found) => found)
    .catch((e) => e);
}

async function createUser(user) {
  const { email, password } = user;

  const foundUser = await prisma.user
    .findFirst({
      where: { email, password },
    })
    .then((found) => found)
    .catch((err) => err);

  if (foundUser instanceof Error) return foundUser;
  if (foundUser !== null) return foundUser;

  return prisma.user.create({
    data: user,
  });
}

async function updateUser(user) {
  return prisma.user.update({
    where: { id: user.id },
    data: {
      email: user.email || undefined,
      password: user.password || undefined,
      updatedAt: new Date(),
    },
  });
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const users = await findUsers(req.query);

    if (users instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error in while finding users!",
        data: null,
        error: users,
      });

    return res.status(200).json({
      success: true,
      message: "Found users!",
      data: users,
      error: null,
    });
  } else if (req.method === "POST") {
    const user = await createUser(req.body).catch((e) => e);
    if (user instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error in user creation!",
        data: null,
        error: user,
      });

    return res.status(200).json({
      success: true,
      message: "User created!",
      data: user,
      error: null,
    });
  } else if (req.method === "PUT") {
    const user = await updateUser(req.body).catch((e) => e);

    if (user instanceof Error)
      return res.status(500).json({
        success: false,
        message: "Error in while updating user!",
        data: null,
        error: user,
      });

    return res.status(200).json({
      success: true,
      message: "User updated!",
      data: user,
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
