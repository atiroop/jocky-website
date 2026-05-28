import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json()) as {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    status?: string;
    coverImage?: string | null;
    seoTitle?: string | null;
    seoDesc?: string | null;
  };

  const { title, slug, content, excerpt, status, coverImage, seoTitle, seoDesc } = body;

  if (!title?.trim() || !slug?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: "Title, slug, and content are required" },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.post.findUnique({ where: { id: Number(id) } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title: title.trim(),
        slug: slug.trim(),
        content,
        excerpt: excerpt?.trim() || null,
        status: status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        publishedAt:
          status === "PUBLISHED" && !existing.publishedAt
            ? new Date()
            : existing.publishedAt,
        coverImage: coverImage ?? null,
        seoTitle: seoTitle ?? null,
        seoDesc: seoDesc ?? null,
      },
    });

    return NextResponse.json(post);
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.post.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
