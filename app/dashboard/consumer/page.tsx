import { redirect } from "next/navigation";
import { getSession, hasRole } from "@/lib/auth";

// Consumer view should look exactly like the public site.
// This route simply validates access and redirects home.

export default async function ConsumerDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasRole(session, "CONSUMER")) redirect("/dashboard");

  redirect("/");
}

