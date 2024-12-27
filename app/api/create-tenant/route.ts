// app/api/create-tenant/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name, subdomain } = await request.json();

    if (!name || !subdomain) {
      return NextResponse.json(
        { error: "Name and subdomain are required" },
        { status: 400 }
      );
    }

    const existingTenant = await prisma.tenant.findUnique({
      where: { subdomain },
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: "Subdomain already exists" },
        { status: 409 }
      );
    }

    const newTenant = await prisma.tenant.create({
      data: {
        name,
        subdomain,
        owner: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(newTenant, { status: 201 });
  } catch (error) {
    console.log("Error creating tenant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
