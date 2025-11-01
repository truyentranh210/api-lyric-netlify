export const handler = async (event) => {
  const rawPath = event.path.replace("/.netlify/functions/api", "");
  const query = decodeURIComponent(event.queryStringParameters[""] || event.queryStringParameters.q || "").trim();

  // /home => hướng dẫn
  if (rawPath === "/home") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "🎵 Hướng dẫn sử dụng API Lyric",
        usage: [
          "🟢 /home → Xem hướng dẫn",
          "🟢 /?=Shape of You → Lấy lời bài hát tiếng Anh",
          "🟢 /?=Em của ngày hôm qua → Lấy lời bài hát tiếng Việt",
        ],
        note: "Tự động chọn nguồn phù hợp 🇬🇧 / 🇻🇳",
        author: "API Lyric by You 💚",
      }),
    };
  }

  // Nếu có query
  if (query) {
    try {
      let lyrics = "";
      let title = query;
      let artist = "";

      // 🔹 Nếu chứa dấu tiếng Việt → gọi Zing MP3 API
      const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵđèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ]/i.test(query);
      if (isVietnamese) {
        const zingApi = `https://api-lyrics-zing.vercel.app/search?q=${encodeURIComponent(query)}`;
        const res = await fetch(zingApi);
        const data = await res.json();

        if (data && data.result && data.result.lyric) {
          lyrics = data.result.lyric;
          title = data.result.title || query;
          artist = data.result.artist || "";
        }
      } else {
        // 🔹 Tiếng Anh → lyrics-api.vercel.app
        const engApi = `https://lyrics-api.vercel.app/api/lyrics?name=${encodeURIComponent(query)}`;
        const res = await fetch(engApi);
        const data = await res.json();

        if (data && data.lyrics) {
          lyrics = data.lyrics;
          title = data.title || query;
          artist = data.artist || "";
        }
      }

      if (!lyrics) throw new Error("No lyrics found");

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, artist, lyrics }),
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

  // Nếu không có query
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "🎶 Chào mừng đến với API Lyric!",
      note: "Dùng ?=tên_bài_hát hoặc /home để xem hướng dẫn.",
    }),
  };
};
