"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitLoanApplication(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const type = formData.get("type") as string;
    const loanAmount = formData.get("loanAmount") ? Number(formData.get("loanAmount")) : null;
    const income = formData.get("income") ? Number(formData.get("income")) : null;
    const landSize = formData.get("landSize") as string;
    const emi = formData.get("emi") ? Number(formData.get("emi")) : null;
    const userId = formData.get("userId") as string;

    await prisma.loanApplication.create({
      data: {
        name,
        phone,
        email,
        type,
        loanAmount: loanAmount || undefined,
        income: income || undefined,
        landSize,
        emi: emi || undefined,
        userId: userId || undefined,
        status: "NEW",
        isRead: false,
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Error submitting loan application:", error);
    return { success: false, error: "Failed to submit application" };
  }
}

export async function submitSpecialistConsultation(data: {
  name: string;
  phone: string;
  cropType?: string;
}) {
  try {
    await prisma.specialistConsultation.create({
      data: {
        name: data.name,
        phone: data.phone,
        cropType: data.cropType,
        status: "NEW",
        isRead: false,
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Error submitting specialist consultation:", error);
    return { success: false, error: "Failed to submit request" };
  }
}

export async function getAdminNotificationCounts() {
  try {
    const [loanCount, specialistCount, productCount, roleCount] = await Promise.all([
      prisma.loanApplication.count({
        where: { isRead: false },
      }),
      prisma.specialistConsultation.count({
        where: { isRead: false },
      }),
      prisma.product.count({
        where: { status: "PENDING" },
      }),
      prisma.userRole.count({
        where: {
          status: "PENDING",
          role: { in: ["FARMER", "RETAILER"] },
        },
      }),
    ]);

    return {
      loans: loanCount,
      specialists: specialistCount,
      products: productCount,
      roles: roleCount,
      total: loanCount + specialistCount + productCount + roleCount,
    };
  } catch (error) {
    console.error("Error fetching notification counts:", error);
    return { loans: 0, specialists: 0, products: 0, roles: 0, total: 0 };
  }
}

export async function updateLoanStatus(id: string, status: any) {
  await prisma.loanApplication.update({
    where: { id },
    data: { status, isRead: true },
  });
  revalidatePath("/dashboard/admin/loans");
}

export async function updateSpecialistStatus(id: string, status: any) {
  await prisma.specialistConsultation.update({
    where: { id },
    data: { status, isRead: true },
  });
  revalidatePath("/dashboard/admin/specialists");
}

export async function markLoanAsRead(id: string) {
  await prisma.loanApplication.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath("/dashboard/admin");
}

export async function markSpecialistAsRead(id: string) {
  await prisma.specialistConsultation.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath("/dashboard/admin");
}
