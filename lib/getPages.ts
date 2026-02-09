import fs from "fs";
import path from "path";

export const getPages = () => {
    const files: string[] = [];

    // path asli folder class
    const baseDir = path.resolve(process.cwd(), "app/(dashboard)");

    if (!fs.existsSync(baseDir)) {
        console.warn("Folder halaman tidak ditemukan:", baseDir);
        return files;
    }

    const walk = (currentDir: string) => {
        const items = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(currentDir, item.name);

            if (item.isDirectory()) {
                files.push(
                    path
                        .relative(baseDir, fullPath) // path relatif dari class
                        .replace(/\\/g, "/") + "/"   // normalisasi path windows
                );
                walk(fullPath);
            } else if (item.isFile() && /\.(ts|tsx|js|jsx)$/.test(item.name)) {
                files.push(
                    path
                        .relative(baseDir, fullPath)
                        .replace(/\\/g, "/")
                );
            }
        }
    };

    walk(baseDir);

    return files.map(f => "/" + f);
};
