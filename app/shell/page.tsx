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

type Notif = {
    type: "success" | "error";
    message: string;
};

export default function CikawanShell() {
    const [items, setItems] = useState<FileItem[]>([]);
    const [path, setPath] = useState<string>("/");
    const [loading, setLoading] = useState<boolean>(false);
    const [history, setHistory] = useState<string[]>([]);
    const [openEditor, setOpenEditor] = useState(false);
    const [currentFileHex, setCurrentFileHex] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [notif, setNotif] = useState<Notif | null>(null);

    const showNotif = (type: "success" | "error", message: string) => {
        setNotif({ type, message });
        setTimeout(() => setNotif(null), 3000);
    };

    const fetchFiles = async (hexPath = "", pushHistory = false) => {
        setLoading(true);
        try {
            if (pushHistory) {
                setHistory(prev => [...prev, path]);
            }

            const res = await fetch(`/api/shell?p=${hexPath}`);

            if (!res.ok) {
                const text = await res.text();
                console.error("API error:", res.status, text);
                return;
            }

            const text = await res.text();
            if (!text) {
                console.error("Empty response from API");
                return;
            }

            const data = JSON.parse(text);

            const sortedItems = (data.items || []).sort((a: FileItem, b: FileItem) => {
                if (a.type !== b.type) {
                    return a.type === "d" ? -1 : 1;
                }
                return a.name.localeCompare(b.name);
            });

            setItems(sortedItems);
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

    const openFile = async (hex: string) => {
        const res = await fetch(`/api/shell/read?p=${hex}`);
        const data = await res.json();
        setCurrentFileHex(hex);
        setContent(data.content || "");
        setOpenEditor(true);
    };

    const saveFile = async () => {
        try {
            const res = await fetch("/api/shell", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ p: currentFileHex, content }),
            });

            if (!res.ok) throw new Error("Gagal menyimpan file");

            showNotif("success", "File berhasil disimpan");
            setOpenEditor(false);
            fetchFiles();
        } catch (err: any) {
            showNotif("error", err.message);
        }
    };

    const createFile = async () => {
        const name = prompt("Nama file baru:");
        if (!name) return;

        try {
            const res = await fetch("/api/shell", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dir: path, name }),
            });

            if (!res.ok) throw new Error("Gagal membuat file");

            showNotif("success", "File baru berhasil dibuat");
            fetchFiles();
        } catch (err: any) {
            showNotif("error", err.message);
        }
    };

    const uploadFile = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const file = (form.elements.namedItem("file") as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("dir", path);

            const res = await fetch("/api/shell/upload", {
                method: "POST",
                body: fd,
            });

            if (!res.ok) throw new Error("Upload gagal");

            showNotif("success", "File berhasil diupload");
            fetchFiles();
            form.reset();
        } catch (err: any) {
            showNotif("error", err.message);
        }
    };
    const goBack = () => {
        if (history.length === 0) return;

        const prev = history[history.length - 1];
        setHistory(h => h.slice(0, -1));
        fetchFiles(prev);
    };

    return (<>
        {notif && (
            <div
                className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50
                ${notif.type === "success"
                        ? "bg-green-700 text-white"
                        : "bg-red-700 text-white"
                    }`}
            >
                {notif.message}
            </div>
        )}


        <div className="min-h-screen bg-gray-900 text-gray-100 font-mono p-6">
            <div className="mb-6 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold tracking-widest text-green-400 text-center">
                    CIKAWAN – SHELL
                </h1>
                <p className="text-sm text-gray-400 mt-1 text-center">
                    ini adalah file manager admin web kasyaf cv
                </p>
                <br></br>

                <div className="mt-2 text-xs text-gray-500">
                    📂 Current Path: <span className="text-gray-300">{path}</span>
                </div>
            </div>
            <header className="mb-4 flex flex-wrap gap-2 items-center">
                {history.length > 0 && (
                    <button
                        onClick={goBack}
                        className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
                    >
                        ⬅ Back
                    </button>
                )}

                <button
                    onClick={createFile}
                    className="px-3 py-1 bg-purple-700 rounded hover:bg-purple-600 transition"
                >
                    + New File
                </button>

                <form onSubmit={uploadFile} className="flex items-center gap-2">
                    <input
                        type="file"
                        name="file"
                        className="text-xs bg-gray-800 rounded px-2 py-1"
                    />
                    <button className="px-3 py-1 bg-green-700 rounded hover:bg-green-600 transition">
                        Upload
                    </button>
                </form>
            </header>

            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-700 text-gray-300 text-sm">
                    <tr>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2 w-32">Size</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr
                            key={item.path}
                            onClick={() => {
                                if (item.type === "d") {
                                    fetchFiles(item.path, true);
                                } else {
                                    openFile(item.path);
                                }
                            }}
                            className="hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-none"
                        >
                            <td className="p-2">
                                {item.type === "d" ? "📁" : "📄"} {item.name}
                            </td>
                            <td className="p-2 text-sm text-gray-400">
                                {item.size}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {loading && (
                <div className="text-sm text-gray-400 mb-2 animate-pulse">
                    Loading directory...
                </div>
            )}

            {openEditor && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
                    <div className="bg-gray-800 p-4 w-3/4 h-3/4 flex flex-col">
                        <textarea
                            className="flex-1 bg-black text-green-400 p-2"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                        <div className="mt-2 flex gap-2">
                            <button onClick={saveFile} className="bg-green-700 px-3 py-1">Save</button>
                            <button onClick={() => setOpenEditor(false)} className="bg-red-700 px-3 py-1">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    </>
    );
}