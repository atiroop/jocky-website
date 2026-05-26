import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/admin-auth";

function normalizeSlug(slug: string) {
  return slug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return null;
  }

  const payload = verifyAdminToken(token);

  if (!payload) {
    return null;
  }

  const admin = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      role: true,
    },
  });

  if (!admin || admin.role !== "ADMIN") {
    return null;
  }

  return admin;
}

function parsePostId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(req);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const postId = parsePostId(id);

  if (!postId) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(req);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const postId = parsePostId(id);

  if (!postId) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, publishedAt: true },
  });

  if (!existingPost) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

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

  const duplicateSlug = await prisma.post.findFirst({
    where: {
      slug,
      id: { not: postId },
    },
    select: { id: true },
  });

  if (duplicateSlug) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  const nextPublishedAt =
    status === "PUBLISHED" && !existingPost.publishedAt ? new Date() : existingPost.publishedAt;

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      slug,
      excerpt,
      content,
      status,
      seoTitle,
      seoDesc,
      publishedAt: nextPublishedAt,
    },
  });

  return NextResponse.json(updatedPost);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(req);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const postId = parsePostId(id);

  if (!postId) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const existingPost = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });

  if (!existingPost) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await prisma.post.delete({ where: { id: postId } });

  return NextResponse.json({ success: true });
}
