import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

type AdminTokenPayload = {
  userId: number;
  email: string;
};

async function getAdminFromToken(req: NextRequest) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("Missing JWT_SECRET");
    }

    const token = req.cookies.get("admin_token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, secret) as AdminTokenPayload;
    const userId = Number(decoded.userId);

    if (!userId || !decoded.email) {
      return null;
    }

    const admin = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!admin || admin.role !== "ADMIN") {
      return null;
    }

    return admin;
  } catch {
    return null;
  }
}

function normalizeSlug(slug: string) {
  return slug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(req: NextRequest) {
  const admin = await getAdminFromToken(req);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/admin/posts error:", error);

    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromToken(req);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const title = String(body.title || "").trim();
    const rawSlug = String(body.slug || "").trim();
    const excerpt = body.excerpt ? String(body.excerpt).trim() : null;
    const content = String(body.content || "").trim();
    const status = body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
    const seoTitle = body.seoTitle ? String(body.seoTitle).trim() : title;
    const seoDesc = body.seoDesc ? String(body.seoDesc).trim() : excerpt;

    const slug = normalizeSlug(rawSlug);

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    const existingPost = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const publishedAt = status === "PUBLISHED" ? new Date() : null;

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        status,
        seoTitle,
        seoDesc,
        publishedAt,
        authorId: admin.id,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/posts error:", error);

    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
