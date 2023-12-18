export async function h_postJson(url = "", data = {}) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log("h_postJson Success:", result);
        return result;

    } catch (error) {
        console.error("h_postJson Error:", error);
    }
}

export async function h_get(url = "") {
    try {
        const response = await fetch(url, {
            method: "GET",
        });

        const result = await response.json();
        console.log("h_get Success:", result);
        return result;

    } catch (error) {
        console.error("h_get Error:", error);
    }
}