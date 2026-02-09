let installed = false;

export function installFetchMonitor(saveError: any) {
    if (installed) return;
    installed = true;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        try {
            const res = await originalFetch(...args);

            if (!res.ok) {
                saveError({
                    type: "api",
                    status: res.status,
                    message: `API gagal: Status ${res.status}`
                });
            }

            // ✅ Cegah crash JSON kosong
            const clone = res.clone();
            const text = await clone.text();
            if (text.trim() === "") {
                return res;
            }
            try {
                JSON.parse(text);
            } catch {
                saveError({
                    type: "api",
                    message: "Response API bukan JSON valid"
                });
            }

            return res;
        } catch (err: any) {
            saveError({
                type: "network",
                message: err?.message || "Gagal fetch API"
            });
            throw err;
        }
    };
}
