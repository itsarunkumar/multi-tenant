import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function SubdomainPage({
  params,
}: {
  params: { site: string };
}) {
  const { site } = await params;
  console.log("SubdomainPage: Rendering page for subdomain:", site);

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain: site },
      include: { users: true, owner: true },
    });
    console.log("SubdomainPage: Tenant retrieved:", tenant);

    if (!tenant) {
      console.log("SubdomainPage: Tenant not found, redirecting to 404");
      notFound();
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold">Welcome to {tenant.name}</h1>
        <p>This is a multitenant site for {site}</p>
        <pre>{JSON.stringify(tenant, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    console.error("SubdomainPage: Error fetching tenant:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold text-red-500">Error</h1>
        <p>There was an error loading the tenant information.</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }
}
