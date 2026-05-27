import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { uploadToR2 } from "@/lib/r2";
import { randomUUID } from "crypto";
import { extname } from "path";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const contentType = file.type;
  const ext = ALLOWED_TYPES[contentType];

  if (!ext) {
    return NextResponse.json(
      { error: `File type not allowed: ${contentType}` },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large (max 20 MB)" },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Folder by type: uploads/images/ or uploads/videos/
  const folder = contentType.startsWith("video/") ? "uploads/videos" : "uploads/images";
  const key = `${folder}/${randomUUID()}${ext}`;

  const url = await uploadToR2(buffer, key, contentType);

  return NextResponse.json({ url });
}
