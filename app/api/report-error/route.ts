import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const reportDir = path.join(process.cwd(), "public", "report-error");
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filePath = path.join(reportDir, `report-${timestamp}.json`);

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return NextResponse.json({
            success: true,
            message: "✅ Laporan bug berhasil disimpan!",
            file: `/report-error/report-${timestamp}.json`
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "❌ Gagal menyimpan report"
        }, { status: 500 });
    }
}
