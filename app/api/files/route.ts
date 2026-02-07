import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const BASE_PATH = path.join(process.cwd(), "public/penyimpanan");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder");

  // Ambil folder utama
  if (!folder) {
    const folders = fs
      .readdirSync(BASE_PATH, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    return NextResponse.json({ folders });
  }

  // Ambil isi folder
  const targetPath = path.join(BASE_PATH, folder);

  if (!fs.existsSync(targetPath)) {
    return NextResponse.json({ files: [] });
  }

  const files = fs.readdirSync(targetPath, { withFileTypes: true }).map((f) => ({
    name: f.name,
    type: f.isDirectory() ? "folder" : "file",
  }));

  return NextResponse.json({ files });
}