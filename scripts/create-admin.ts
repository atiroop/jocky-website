import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function createOrUpdateAdmin() {
  const name = process.env.ADMIN_NAME?.trim() || null;
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email) {
    throw new Error("Missing required environment variable: ADMIN_EMAIL");
  }

  if (!password) {
    throw new Error("Missing required environment variable: ADMIN_PASSWORD");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    await prisma.user.update({
      where: { email },
      data: {
        name,
        passwordHash,
        role: "ADMIN",
      },
    });
  } else {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "ADMIN",
      },
    });
  }

  console.log("Admin user seeded successfully.");
}

createOrUpdateAdmin()
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Failed to seed admin user.");
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
