import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HomeHeader } from "./HomeHeader";

export async function HomeHeaderServer() {
  const session = await getSession();

  let isAdmin = false;
  let pendingRoleRequests = 0;
  let cartCount = 0;
  let wishlistCount = 0;

  if (session?.roles?.length) {
    isAdmin = session.roles.some(
      (r) => r.role === "ADMIN" && r.status === "APPROVED"
    );
  }

  if (isAdmin) {
    pendingRoleRequests = await prisma.userRole.count({
      where: {
        status: "PENDING",
        role: { in: ["FARMER", "RETAILER"] },
      },
    });
  }

  if (session) {
    const sum = await prisma.cartItem.aggregate({
      where: { userId: session.userId },
      _sum: { quantity: true },
    });
    cartCount = sum._sum.quantity ?? 0;

    wishlistCount = await prisma.wishlistItem.count({
      where: { userId: session.userId },
    });
  }

  const sessionInfo = session
    ? {
        email: session.email,
        name: session.name ?? null,
        isAdmin,
        pendingRoleRequests,
        cartCount,
        wishlistCount,
      }
    : null;

  return <HomeHeader session={sessionInfo} />;
}

