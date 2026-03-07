import "dotenv/config";
import { PrismaClient, Role, VerificationStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@agribridge.local";
  const existingAdmin = await prisma.userRole.findFirst({
    where: { role: Role.ADMIN, status: VerificationStatus.APPROVED },
    include: { user: true },
  });
  if (existingAdmin) {
    console.log("Admin user already exists:", existingAdmin.user.email);
    return;
  }

  let user = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!user) {
    const hashed = await hash(process.env.ADMIN_SEED_PASSWORD ?? "Admin@123", 12);
    user = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashed,
        name: "Platform Admin",
      },
    });
    console.log("Created admin user:", user.email);
  }

  await prisma.userRole.upsert({
    where: {
      userId_role: { userId: user.id, role: Role.ADMIN },
    },
    create: {
      userId: user.id,
      role: Role.ADMIN,
      status: VerificationStatus.APPROVED,
    },
    update: { status: VerificationStatus.APPROVED },
  });
  console.log("Admin role assigned. Login with", adminEmail, "and your ADMIN_SEED_PASSWORD (default: Admin@123)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
