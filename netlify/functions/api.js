// ✅ API Lyric JSON (chạy trực tiếp trên Netlify, không cần import gì)

export const handler = async (event) => {
  const path = event.path.replace("/.netlify/functions/api", "");
  const query = event.queryStringParameters[""] || event.queryStringParameters.q;

  // ⚙️ Trang /home – hướng dẫn sử dụng
  if (path === "/home" || path === "/") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "🎵 Hướng dẫn sử dụng API Lyric",
        usage: [
          "🟢 /home → Xem hướng dẫn sử dụng API",
          "🟢 /?=Shape of You → Lấy lời bài hát tiếng Anh",
          "🟢 /?=Em của ngày hôm qua → Hỗ trợ cả tiếng Việt",
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
    // 🔗 Gọi API lyric.ovh
    const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl); // ✅ fetch có sẵn, không cần import
    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: query,
        lyrics: data.lyrics || "Không tìm thấy lời bài hát.",
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Lỗi khi tải dữ liệu bài hát hoặc API không phản hồi.",
      }),
    };
  }
};
