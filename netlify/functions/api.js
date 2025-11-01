// ✅ API JSON - Lyric Finder
// Deploy trực tiếp lên Netlify (không cần package.json riêng)

import fetch from "node-fetch";

export const handler = async (event) => {
  const path = event.path.replace("/.netlify/functions/api", "");
  const query = event.queryStringParameters[""] || event.queryStringParameters.q;

  // 📌 Trang hướng dẫn ( /home )
  if (path === "/home" || path === "/") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "🎵 Hướng dẫn sử dụng API Lyric",
        usage: [
          "1️⃣ /home → Xem hướng dẫn",
          "2️⃣ /?=Shape of You → Tìm lời bài hát 'Shape of You'",
          "3️⃣ /?=Em của ngày hôm qua → Hỗ trợ cả tiếng Việt",
        ],
        author: "API Lyric by You 💚",
      }),
    };
  }

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Thiếu tham số ?=bài_hát. Hãy thử /home để xem hướng dẫn.",
      }),
    };
  }

  try {
    const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: query,
        lyrics: data.lyrics || "Không tìm thấy lời bài hát.",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Lỗi khi lấy dữ liệu bài hát.",
      }),
    };
  }
};
