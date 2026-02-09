import { NextResponse } from "next/server";
import { getPages } from "@/lib/getPages";

export async function GET() {
    try {
        const pages = getPages(); // default app/class
        return NextResponse.json({ pages });
    } catch (err) {
        return NextResponse.json({ pages: [], error: String(err) });
    }
}
