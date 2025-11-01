import axios from "axios";

export const handler = async (event) => {
  const song = event.queryStringParameters[""] || event.queryStringParameters.q;
  if (!song)
    return {
      statusCode: 200,
      body: JSON.stringify({
        error: "Hãy thêm ?=tên_bài_hát vào URL, ví dụ: ?=Shape of You",
      }),
    };

  try {
    // Gọi API lyrics.ovh (miễn phí)
    const { data } = await axios.get(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(song)}`
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: song,
        lyrics: data.lyrics || "Không tìm thấy lời bài hát.",
      }),
    };
  } catch {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: song,
        lyrics: "Không tìm thấy lời bài hát hoặc lỗi kết nối.",
      }),
    };
  }
};
