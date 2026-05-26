import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminAuthCookie, signAdminToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatched = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatched) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signAdminToken({
      userId: user.id,
      email: user.email,
      role: "ADMIN",
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: adminAuthCookie.name,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: adminAuthCookie.maxAge,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Unable to login" }, { status: 500 });
  }
}
