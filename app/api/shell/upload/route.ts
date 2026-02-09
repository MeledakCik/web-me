import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    const dir = form.get("dir") as string;

    const targetDir = path.resolve(dir);
    if (!targetDir.startsWith(ROOT_DIR)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(targetDir, file.name), bytes);

    return NextResponse.json({ ok: true });
  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}