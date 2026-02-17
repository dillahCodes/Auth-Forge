import { prisma } from "@/shared/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const users = [
    { email: "admin@example.com", name: "Admin", password: "admin123" },
    { email: "user1@example.com", name: "User One", password: "user1123" },
    { email: "user2@example.com", name: "User Two", password: "user2123" },
  ];

  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, name: u.name, password: hashedPassword },
    });
  }

  console.info("Seeded users successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
