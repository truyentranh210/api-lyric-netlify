export const handler = async (event) => {
  // Lấy đường dẫn và query
  const rawPath = event.path.replace("/.netlify/functions/api", "");
  const query = decodeURIComponent(event.queryStringParameters[""] || event.queryStringParameters.q || "").trim();

  // ✅ Nếu người dùng truy cập /home thì trả hướng dẫn
  if (rawPath === "/home") {
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

  // ✅ Nếu có query (tức là có ?=...) thì tìm lyric
  if (query) {
    try {
      const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: query,
          lyrics: data.lyrics || "❌ Không tìm thấy lời bài hát.",
        }),
      };
    } catch {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "⚠️ Lỗi khi tải dữ liệu bài hát hoặc API không phản hồi.",
        }),
      };
    }
  }

  // ✅ Nếu không có query và không phải /home → tự động hướng dẫn
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "🎶 Chào mừng đến với API Lyric!",
      note: "Dùng ?=tên_bài_hát hoặc truy cập /home để xem hướng dẫn.",
    }),
  };
};
