'use client';

import { installFetchMonitor } from "@/app/fetch-monitor";
import { useState, useEffect } from "react";
import { FiMessageSquare, FiSend, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

const normalizePages = (pages: string[]) => {
    return Array.from(
        new Set(
            pages
                .map(p => p.replace("/page.tsx", ""))
                .map(p => (p.endsWith("/") ? p.slice(0, -1) : p))
                .filter(p => !p.includes("layout"))
        )
    );
};

const pageExplanations: Record<string, string[]> = {
    "/dashboard": [
        "Dashboard berfungsi sebagai pusat kontrol sistem.",
        "Di halaman Dashboard, kamu bisa memantau aktivitas akun, status sistem, dan informasi penting.",
        "Device IP digunakan untuk melihat alamat IP perangkat yang mengakses akun, berguna untuk keamanan dan deteksi aktivitas mencurigakan."
    ],

    "/post-instagram": [
        "Halaman Post Instagram digunakan untuk melakukan posting otomatis ke Instagram.",
        "Fitur ini membantu menjadwalkan dan mengirim post tanpa harus login manual ke Instagram.",
        "Biasanya digunakan untuk auto post, manajemen konten, dan efisiensi sosial media."
    ],

    "/dump-instagram": [
        "Halaman Dump Instagram digunakan untuk mengambil data publik seperti username atau ID Instagram.",
        "Fitur ini sering dipakai untuk riset akun atau pengumpulan data secara otomatis."
    ],

    "/create-instagram": [
        "Halaman Create Instagram berfungsi untuk membuat akun Instagram secara otomatis.",
        "Biasanya digunakan untuk keperluan testing, automation, atau manajemen akun massal."
    ],

    "/mail": [
        "Halaman Mail digunakan untuk mengelola email masuk dan keluar.",
        "Biasanya dipakai untuk verifikasi akun atau menerima notifikasi sistem."
    ]
};
const intents = [
    {
        label: "search_web",
        examples: [
            "cari di google",
            "cari di web",
            "contoh jurnal",
            "contoh di web",
            "referensi online",
            "artikel di internet",
            "sumber dari google",
            "contoh penelitian",
            "paper pdf",
            "jurnal pdf"
        ]
    },
    {
        label: "chat",
        examples: [
            "hai",
            "halo",
            "hello",
            "hi",
            "apa kabar",
            "kabar",
            "lagi apa",
            "terima kasih",
            "makasih",
            "thanks",
            "ok",
            "sip"
        ]
    },
    {
        label: "error",
        examples: [
            "error muncul", "bug di halaman", "tidak bisa klik", "gagal load",
            "halaman eror", "kenapa halaman gagal", "tugas eror"
        ]
    },
    {
        label: "page",
        examples: [
            "halaman dashboard", "form login", "tombol submit",
            "komponen sidebar", "masuk dashboard"
        ]
    },
    {
        label: "navigation",
        examples: [
            "buka halaman", "ke dashboard", "pindah page",
            "pergi ke", "masuk ke menu", "arahkan ke"
        ]
    },
    {
        label: "general",
        examples: ["cara pakai fitur", "bisa bantu?", "mohon penjelasan"]
    }
];
const pageKeywords: Record<string, string[]> = {
    "/me": [
        "profil",
        "profile",
        "akun saya",
        "tentang saya",
        "cover",
        "halaman utama",
        "beranda",
        "home"
    ],

    "/dashboard": [
        "dashboard",
        "dash",
        "panel",
        "kontrol",
        "admin",
        "menu utama"
    ],
    "/exploit": [
        "exploit",
        "tools",
        "alat",
        "menu exploit",
        "hacking",
        "penetration",
        "testing"
    ],
    "/dump-facebook": [
        "dump facebook",
        "dump fb",
        "facebook id",
        "ambil id fb",
        "scrape fb",
        "facebook dump"
    ],
    "/dump-instagram": [
        "dump instagram",
        "dump ig",
        "username ig",
        "ambil ig",
        "scrape instagram"
    ],
    "/graber-domain": [
        "graber domain",
        "grab domain",
        "cek xmlrpc",
        "xmlrpc",
        "domain grabber",
        "scan domain"
    ],
    "/create-instagram": [
        "buat akun ig",
        "create instagram",
        "create ig",
        "daftar ig",
        "akun instagram",
        "mass instagram",
        "bot ig"
    ],
    "/create-facebook": [
        "buat akun facebook",
        "create facebook",
        "create fb",
        "daftar fb",
        "akun facebook",
        "mass fb"
    ],
    "/post-instagram": [
        "post instagram",
        "post ig",
        "auto post ig",
        "posting ig",
        "upload ig",
        "automatic post"
    ],
    "/a2f-instagram": [
        "a2f",
        "2fa",
        "a2f instagram",
        "a2f ig",
        "keamanan ig",
        "keamanan instagram",
        "verifikasi dua langkah",
        "2fa ig"
    ],
    "/mail": [
        "mail",
        "email",
        "kotak masuk",
        "pesan"
    ],
    "/file": [
        "file",
        "berkas",
        "upload",
        "download",
        "manager file"
    ]
};
const findBestPageByAI = (text: string, pages: string[]) => {
    const input = text.toLowerCase();

    let bestMatch: string | null = null;
    let bestScore = 0;

    for (const page in pageKeywords) {
        const keywords = pageKeywords[page];

        let score = 0;
        keywords.forEach(k => {
            if (input.includes(k)) score++;
        });

        if (score > bestScore && pages.includes(page)) {
            bestScore = score;
            bestMatch = page;
        }
    }

    return bestMatch;
};
const normalizeText = (text: string) =>
    text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim();
const extractSearchQuery = (text: string) => {
    const stopWords = [
        // kata bantu umum
        "cari", "carikan", "tolong", "bisa", "kamu",
        "di", "ke", "dari", "yang", "untuk",

        // sumber
        "web", "google", "internet",

        // kata tanya / pengantar
        "apa", "apakah", "adakah",
        "maksud", "maksudnya", "nya",
        "itu", "ini",

        // kata umum
        "contoh", "tentang", "seperti"
    ];

    return normalizeText(text)
        .split(" ")
        .filter(w => w.length > 2)          // buang kata terlalu pendek
        .filter(w => !stopWords.includes(w))
        .join(" ");
};
const isExplanationQuestion = (text: string) => {
    const t = text.toLowerCase();
    return [
        "untuk apa",
        "fungsinya",
        "fungsi",
        "apa itu",
        "digunakan untuk",
        "gunanya",
        "buat apa"
    ].some(k => t.includes(k));
};
const isGenericQuery = (query: string) => {
    const genericWords = [
        "gambar", "contoh", "web",
        "google", "internet"
    ];

    const tokens = query.split(" ");
    const meaningful = tokens.filter(t => !genericWords.includes(t));

    return meaningful.length === 0;
};
function getDashboardExplanation(key: string) {
    switch (key) {

        case "page":
            return {
                title: "Dashboard",
                description:
                    "Dashboard adalah halaman utama sebagai pusat kontrol untuk memantau aktivitas sistem, statistik penggunaan, dan status akun."
            };

        case "device_ip":
            return {
                title: "Device IP",
                description:
                    "Device IP digunakan untuk menampilkan alamat IP perangkat yang mengakses sistem. Berguna untuk keamanan, audit login, dan mendeteksi aktivitas mencurigakan."
            };

        case "total_requests":
            return {
                title: "Total Requests",
                description:
                    "Total Requests menunjukkan jumlah seluruh permintaan (request) yang masuk ke sistem, seperti membuka halaman, memanggil API, login, atau submit data. Digunakan untuk monitoring trafik, performa, dan keamanan."
            };

        case "today_requests":
            return {
                title: "Requests Hari Ini",
                description:
                    "Menampilkan jumlah request yang terjadi dalam satu hari (hari ini). Berguna untuk melihat lonjakan trafik harian."
            };

        case "monthly_requests":
            return {
                title: "Requests Bulanan",
                description:
                    "Menampilkan total request dalam satu bulan. Biasanya digunakan untuk analisis performa dan billing."
            };

        default:
            return {
                title: "Unknown",
                description: "Data tidak dikenali."
            };
    }
}
const getKeywordsFromPage = (page: string | null) => {
    if (!page) return [];
    return pageKeywords[page] || [];
};
const tokenize = (text: string) => normalizeText(text).split(/\s+/);
const cosineSim = (vecA: Record<string, number>, vecB: Record<string, number>) => {
    let dot = 0, magA = 0, magB = 0;
    for (let key in vecA) {
        dot += (vecA[key] || 0) * (vecB[key] || 0);
        magA += (vecA[key] || 0) ** 2;
    }
    for (let key in vecB) {
        magB += (vecB[key] || 0) ** 2;
    }
    return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
};

type BotReply = {
    text: string;
    showReport: boolean;
    page?: string | null;
};


const vectorize = (tokens: string[]) => {
    const vec: Record<string, number> = {};
    tokens.forEach(t => {
        let weight = 1;
        if (["error", "eror", "bug", "gagal"].includes(t)) weight = 3; // bobot lebih tinggi
        vec[t] = (vec[t] || 0) + weight;
    });
    return vec;
};

const detectIntentSmart = (text: string) => {
    const textVec = vectorize(tokenize(text));
    let bestScore = 0;
    let bestIntent = "unknown";

    intents.forEach(i => {
        i.examples.forEach(ex => {
            const score = cosineSim(textVec, vectorize(tokenize(ex)));
            if (score > bestScore) {
                bestScore = score;
                bestIntent = i.label;
            }
        });
    });
    return bestIntent;
};

export default function ChatAI() {
    const [open, setOpen] = useState(false);
    const [chatMode, setChatMode] = useState(false);
    const [message, setMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [lastError, setLastError] = useState<any>(null);
    const [lastPageContext, setLastPageContext] = useState<string | null>(null);
    const [chat, setChat] = useState([{ from: "ai", text: "Apa ada yang bisa aku bantu?" }]);
    const [pageList, setPageList] = useState<string[]>([]);
    const router = useRouter();
    useEffect(() => {
        fetch("/api/pages")
            .then(r => r.json())
            .then(d => {
                const cleanPages = normalizePages(d.pages || []);
                setPageList(cleanPages);
            })
            .catch(err => {
                console.error("Gagal fetch pages:", err);
                saveError({ type: "api", message: String(err) });
            });
    }, []);

    const chatDictionary: Record<
        string,
        {
            keywords: string[];
            responses: string[];
        }
    > = {
        greeting: {
            keywords: [
                "hai", "halo", "hi", "hello", "pagi", "siang", "malam"
            ],
            responses: [
                "👋 Hai! Ada yang bisa aku bantu?",
                "😊 Halo! Mau cari halaman atau tanya fitur?",
                "🙌 Hai juga! Silakan bertanya."
            ]
        },
        gratitude: {
            keywords: [
                "alhamdulillah",
                "alhamdulillah baik",
                "Alhamdulillah",
                "Alhamdulillah baik",
                "baik",
                "sakit",
                "ga enak badan",
                "pusing",
                "meriang",
                "batuk",
                "siap",
                "syukur",
                "puji tuhan"
            ],
            responses: [
                "😊 Alhamdulillah, semoga harimu lancar!",
                "🤲 Syukur ya, mau lanjut bahas apa?",
                "🤲 Semoga cepat sembuh ya!",
                "✨ Mantap, semoga urusannya dimudahkan."
            ]
        },

        wellbeing: {
            keywords: [
                "apa kabar", "kabar", "gimana kabar", "baik?"
            ],
            responses: [
                "😊 Alhamdulillah baik! Kamu gimana?",
                "😄 Baik! Siap bantu kamu.",
                "👍 Aman terkendali, mau lanjut ngapain?"
            ]
        },

        thanks: {
            keywords: [
                "makasih", "terima kasih", "thanks", "thx", "makasi"
            ],
            responses: [
                "🙏 Sama-sama!",
                "😄 Dengan senang hati!",
                "👌 Siap, kalau perlu tinggal bilang."
            ]
        },

        confirm: {
            keywords: [
                "ok", "oke", "sip", "siap", "ya"
            ],
            responses: [
                "👌 Oke!",
                "✅ Siap!",
                "👍 Mantap."
            ]
        },

        confused: {
            keywords: [
                "bingung", "gak ngerti", "tidak paham"
            ],
            responses: [
                "🤔 Tenang, jelasin pelan-pelan ya.",
                "🧠 Coba ceritakan lebih detail.",
            ]
        }
    };

    const getChatResponse = (text: string) => {
        const cleanText = normalizeText(text);
        const tokens = tokenize(text);

        let bestIntent: string | null = null;
        let bestScore = 0;

        for (const intent in chatDictionary) {
            const { keywords } = chatDictionary[intent];
            let score = 0;

            keywords.forEach(k => {
                if (cleanText.includes(k)) score += 2;
                tokens.forEach(t => {
                    if (k.includes(t) || t.includes(k)) score += 1;
                });
            });

            if (score > bestScore) {
                bestScore = score;
                bestIntent = intent;
            }
        }

        if (bestIntent) {
            const responses = chatDictionary[bestIntent].responses;
            return responses[Math.floor(Math.random() * responses.length)];
        }

        return "🤖 Aku paham. Bisa jelaskan sedikit lebih detail?";
    };

    const saveError = (err: any) => {
        setLastError(err);
        if (!err) return;
        localStorage.setItem("lastError", JSON.stringify(err));
    };

    const sendErrorReport = async () => {
        if (!lastError) return;
        try {
            await fetch("/api/report-error", {
                method: "POST",
                body: JSON.stringify({
                    error: lastError,
                    page: window.location.pathname,
                    userAgent: navigator.userAgent,
                    time: new Date().toISOString(),
                }),
                headers: { "Content-Type": "application/json" }
            });
            setChat(prev => [...prev, { from: "ai", text: "✅ Bug telah dilaporkan ke developer!" }]);
        } catch (e) {
            setChat(prev => [...prev, { from: "ai", text: "⚠️ Gagal mengirim laporan bug!" }]);
        }
    };

    useEffect(() => {
        const cached: any = localStorage.getItem("lastError");
        if (cached && cached !== "null") setLastError(JSON.parse(cached));

        installFetchMonitor(saveError);

        const offline = () => saveError({ type: "network", message: "Koneksi internet terputus!" });
        const runtimeError = (e: any) => saveError({ type: "runtime", message: e?.message });

        window.addEventListener("offline", offline);
        window.addEventListener("error", runtimeError);

        return () => {
            window.removeEventListener("offline", offline);
            window.removeEventListener("error", runtimeError);
        };
    }, []);


    const getErrorResponse = () => {
        if (!lastError) return { text: "✅ Sistem berjalan normal! Tidak ada error terdeteksi.", showReport: false };

        const reportButtonNote = "\n\n🐞 Jika error terus muncul, klik tombol untuk melaporkan bug ke developer 👇";

        let message = "";
        let showReport = true;

        switch (lastError.type) {
            case "offline": message = "📡 Kamu sedang Offline!\n➡️ Periksa koneksi internet."; break;
            case "runtime": message = `⚠️ Error script: ${lastError.message}`; break;
            case "promise": message = `⏳ Async gagal: ${lastError.message}`; break;
            case "network": message = `🌐 Gagal fetch data: ${lastError.message}`; break;
            case "api": message = `❌ API error: ${lastError.status} - ${lastError.message}`; break;
            default: message = `🔍 Error tidak diketahui: ${lastError?.message || "Tidak ada info"}`;
        }

        return { text: `${message}${reportButtonNote}`, showReport };
    };

    const sendMessage = () => {
        if (!message) return;
        const userText = message;
        setChat(prev => [...prev, { from: "user", text: userText }]);
        setMessage("");
        setTyping(true);

        setTimeout(() => {
            let botReply: BotReply = { text: "Baik, saya siap membantu ", showReport: false };
            const intent = detectIntentSmart(userText);

            switch (intent) {
                case "navigation":
                    const target = pageList.find(p =>
                        userText.toLowerCase().includes(
                            p.split("/").filter(Boolean).pop()?.toLowerCase() || ""
                        )
                    );

                    if (target) {
                        botReply = {
                            text: `🔗 Mengarahkan ke halaman: ${target}`,
                            showReport: false,
                            page: target
                        };
                    } else {
                        botReply = {
                            text: `📌 List halaman:\n${pageList.join("\n")}`,
                            showReport: false
                        };
                    }
                    break;

                case "search_web": {
                    let query = extractSearchQuery(userText);
                    if (
                        (!query || isGenericQuery(query)) &&
                        lastPageContext
                    ) {
                        query = `${query} ${getKeywordsFromPage(lastPageContext).join(" ")}`.trim();
                    }
                    if (!query) query = "tutorial";
                    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                    botReply = {
                        text: `🔍 Aku carikan referensi yang relevan di Google:\n\n👉 ${query}`,
                        showReport: false,
                        page: googleUrl
                    };
                    break;
                }

                case "error":
                    botReply = getErrorResponse();
                    break;

                case "page":
                    const bestPage = findBestPageByAI(userText, pageList);

                    if (bestPage) {
                        setLastPageContext(bestPage);
                        if (isExplanationQuestion(userText)) {
                            if (bestPage === "/dashboard") {
                                let key = "page";

                                if (userText.includes("ip")) key = "device_ip";
                                else if (userText.includes("total") && userText.includes("request")) key = "total_requests";
                                else if (userText.includes("hari")) key = "today_requests";
                                else if (userText.includes("bulan")) key = "monthly_requests";

                                const info = getDashboardExplanation(key);

                                botReply = {
                                    text: `📘 ${info.title}:\n\n${info.description}`,
                                    showReport: false
                                };
                            }
                            else {
                                const explanations = pageExplanations[bestPage];

                                if (explanations) {
                                    botReply = {
                                        text: `📘 Penjelasan ${bestPage}:\n\n${explanations.join("\n\n")}`,
                                        showReport: false
                                    };
                                } else {
                                    botReply = {
                                        text: `📄 Halaman ${bestPage} digunakan untuk fitur terkait sistem.`,
                                        showReport: false
                                    };
                                }
                            }
                        }
                    } else {
                        botReply = {
                            text: `❓ Aku belum yakin. Berikut halaman yang tersedia:\n${pageList.join("\n")}`,
                            showReport: false
                        };
                    }
                    break;
                case "general":
                    botReply = {
                        text: "🤖 Pertanyaanmu dicatat. Aku akan bantu sebisa mungkin.",
                        showReport: false
                    };
                    break;

                case "chat":
                    botReply = {
                        text: getChatResponse(userText),
                        showReport: false
                    };
                    break;

                default:
                    botReply = {
                        text: "🤔 Maaf, aku belum mengerti. Bisa dijelaskan lebih rinci?",
                        showReport: false
                    };

            }

            setChat(prev => [...prev, {
                from: "ai",
                text: botReply.text,
                showReport: botReply.showReport,
                page: (botReply as any).page || null
            }]);
            setTyping(false);
        }, 700);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <div className={`${open ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all`}>
                {open && (
                    <div className="w-80 h-[480px] bg-white shadow-2xl flex flex-col">
                        <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
                            <span className="font-semibold text-sm">Chat AI Assistant</span>
                            <button onClick={() => setOpen(false)}><FiX size={18} /></button>
                        </div>

                        {!chatMode ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 gap-3 rounded">
                                <p className="font-semibold text-gray-800 text-lg">Selamat datang 👋</p>
                                <p className="text-gray-600 text-xs">Saya bisa membantu apa yang ingin anda tanyakan perihal halaman dan pertanyaan yang anda berikan.</p>
                                <button onClick={() => setChatMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-md">Mulai Chat</button>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3 rounded">
                                    {chat.map((c: any, i) => (
                                        <div key={i} className={`flex gap-2 ${c.from === "ai" ? "justify-start" : "justify-end"}`}>
                                            {c.from === "ai" && (
                                                <div className="w-6 h-6 bg-blue-600 text-white text-xs flex items-center justify-center rounded-full">AI</div>
                                            )}

                                            <div className={`px-3 py-2 rounded-2xl text-sm ${c.from === "ai" ? "bg-white border text-gray-800" : "bg-blue-600 text-white"}`}>
                                                {c.text}
                                                {c.showReport && (
                                                    <button onClick={sendErrorReport} className="block w-full bg-red-600 text-white font-semibold mt-2 p-2 rounded-md text-xs hover:bg-red-700">
                                                        Laporkan Bug
                                                    </button>
                                                )}
                                                {c.page && (
                                                    <button
                                                        onClick={() => {
                                                            if (c.page.startsWith("http")) {
                                                                window.open(c.page, "_blank");
                                                            } else {
                                                                router.push(c.page);
                                                            }
                                                        }}
                                                        className="block w-full bg-green-600 text-white font-semibold mt-2 p-2 rounded-md text-xs hover:bg-green-700"
                                                    >
                                                        🚀 Buka hasil
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-3 border-t bg-white flex gap-2">
                                    <input
                                        placeholder="Ketik pesan..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        className="flex-1 rounded-full border px-3 py-2 text-sm outline-none"
                                    />
                                    <button onClick={sendMessage} className="bg-blue-600 text-white rounded-full p-2">
                                        <FiSend size={16} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <button onClick={() => { setOpen(!open); if (!open) setChatMode(false); }} className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center">
                <FiMessageSquare size={28} />
            </button>
        </div>
    );
}
