// ✅ Lyric API sử dụng Genius (RapidAPI)
// Hỗ trợ /home, /?=bài_hát, và tự động lấy lyric + thông tin

export const handler = async (event) => {
  const path = event.path.replace("/.netlify/functions/api", "");
  const query = decodeURIComponent(
    event.queryStringParameters[""] ||
      event.queryStringParameters.q ||
      ""
  ).trim();

  // 📘 Hướng dẫn sử dụng (truy cập /home)
  if (path === "/home") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "🎵 Hướng dẫn sử dụng API Lyric (Genius)",
        usage: [
          "🟢 /home → Xem hướng dẫn",
          "🟢 /?=Shape of You → Lấy lời bài hát",
          "🟢 /?=Hello → Tìm lời bài hát khác",
        ],
        note: "Sử dụng Genius API (RapidAPI)",
        author: "Lyric API by You 💚",
      }),
    };
  }

  // ⚙️ Nếu có tên bài hát → tìm lyric
  if (query) {
    try {
      const apiUrl = `https://genius-song-lyrics1.p.rapidapi.com/search/?q=${encodeURIComponent(
        query
      )}`;

      const response = await fetch(apiUrl, {
        headers: {
          "x-rapidapi-key": "c34cb19c93mshb9c6b44976bfac8p1a895ejsnc8507442879c",
          "x-rapidapi-host": "genius-song-lyrics1.p.rapidapi.com",
        },
      });

      const data = await response.json();

      if (!data || !data.hits || data.hits.length === 0) {
        throw new Error("Không tìm thấy bài hát.");
      }

      const song = data.hits[0].result;
      const lyricsUrl = `https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${song.id}`;

      const lyricRes = await fetch(lyricsUrl, {
        headers: {
          "x-rapidapi-key": "c34cb19c93mshb9c6b44976bfac8p1a895ejsnc8507442879c",
          "x-rapidapi-host": "genius-song-lyrics1.p.rapidapi.com",
        },
      });

      const lyricData = await lyricRes.json();

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: song.title,
          artist: song.artist_names,
          lyrics: lyricData.lyrics?.lyrics?.body?.plain || "Không có lyric.",
          url: song.url,
          thumbnail: song.header_image_url,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "⚠️ Không thể tải lời bài hát hoặc API đang bận.",
          detail: error.message,
        }),
      };
    }
  }

  // ⚙️ Nếu không có query → trả hướng dẫn mặc định
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "🎶 API Lyric (Genius)",
      note: "Dùng ?=tên_bài_hát hoặc /home để xem hướng dẫn.",
    }),
  };
};
