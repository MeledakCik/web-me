"use client";

import { useEffect, useState } from "react";
import { Folder, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FileItem {
    name: string;
    type: "file" | "folder";
}

export default function Page() {
    // Format tampilan nama folder: script_ig -> Script Ig
    const formatFolderName = (name: string) => {
        return name
            .replace(/_/g, " ")
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const [folders, setFolders] = useState<string[]>([]);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

    // Ambil daftar folder utama
    useEffect(() => {
        fetch("/api/files")
            .then(res => res.json())
            .then(data => setFolders(data.folders));
    }, []);

    // Ambil isi folder (PAKAI NAMA ASLI, BUKAN YANG SUDAH DI FORMAT)
    const openFolder = (folder: string) => {
        setSelectedFolder(folder);
        fetch(`/api/files?folder=${folder}`)
            .then(res => res.json())
            .then(data => setFiles(data.files));
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="bg-gray-800/60 backdrop-blur border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <h1 className="text-2xl font-semibold text-gray-100">Penyimpanan</h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6 p-6">
                <Card className="bg-gray-800 text-white border border-gray-700">
                    <CardHeader>
                        <CardTitle>📁 Penyimpanan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        {folders.map(folder => (
                            <button
                                key={folder}
                                onClick={() => openFolder(folder)}
                                className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm hover:bg-gray-600 ${
                                    selectedFolder === folder ? "bg-gray-600" : ""
                                }`}
                            >
                                <Folder size={16} className="text-yellow-500" />
                                {formatFolderName(folder)}
                            </button>
                        ))}
                    </CardContent>
                </Card>

                {/* File List */}
                <Card className="col-span-2 bg-gray-800 text-white border border-gray-700">
                    <CardHeader>
                        <CardTitle>
                            {selectedFolder
                                ? `📂 ${formatFolderName(selectedFolder)}`
                                : "Pilih Folder"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        {files.map(file => (
                            <div
                                key={file.name}
                                className="flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-gray-600"
                            >
                                {file.type === "folder" ? (
                                    <Folder size={14} className="text-yellow-500" />
                                ) : (
                                    <FileText size={14} className="text-blue-500" />
                                )}
                                {file.name}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
