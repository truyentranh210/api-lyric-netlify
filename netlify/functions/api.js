export const handler = async (event) => {
  const rawPath = event.path.replace("/.netlify/functions/api", "");
  const query = decodeURIComponent(event.queryStringParameters[""] || event.queryStringParameters.q || "").trim();

  // /home: hướng dẫn sử dụng
  if (rawPath === "/home") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "🎵 Hướng dẫn sử dụng API Lyric",
        usage: [
          "🟢 /home → Xem hướng dẫn",
          "🟢 /?=Shape of You → Lấy lời bài hát tiếng Anh",
          "🟢 /?=Em của ngày hôm qua → Hỗ trợ cả tiếng Việt",
        ],
        note: "Không cần nhập artist, API tự tìm!",
        author: "API Lyric by You 💚",
      }),
    };
  }

  // Có query → gọi API lyrics-api.vercel.app
  if (query) {
    try {
      const apiUrl = `https://lyrics-api.vercel.app/api/lyrics?name=${encodeURIComponent(query)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data || !data.lyrics) {
        throw new Error("Không có lyrics");
      }

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title || query,
          artist: data.artist || "Không rõ",
          lyrics: data.lyrics,
        }),
      };
    } catch {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "⚠️ Không tìm thấy bài hát hoặc API đang bận.",
        }),
      };
    }
  }

  // Không có query
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "🎶 Chào mừng đến với API Lyric!",
      note: "Dùng ?=tên_bài_hát hoặc /home để xem hướng dẫn.",
    }),
  };
};
