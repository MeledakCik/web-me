import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const fromHex = (hex: string) => Buffer.from(hex, "hex").toString();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const p = searchParams.get("p");
    if (!p) throw new Error("Missing path");

    const filePath = path.resolve(fromHex(p));
    if (!filePath.startsWith(ROOT_DIR)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const content = fs.readFileSync(filePath, "utf8");
    return NextResponse.json({ content });
  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}