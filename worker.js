const SOURCE_URL = "https://drop-primaveo.salesdrive.me/export/yml/export.yml?publicKey=nKa3Gr6PEqUc5ImGvUC61i_9E7oZ5H8KnPuFA8J-a5uM0LNTrwCP2PaucGE3Zim8-YT4_E7";

function removeEmojis(text) {
  return text.replace(
    /(?:\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?)*|\p{Emoji_Modifier}|\uFE0F)/gu,
    ""
  );
}

function cleanTag(xml, tag) {
  const pattern = new RegExp(
    `(<${tag}[^>]*>)([\\s\\S]*?)(</${tag}>)`,
    "gi"
  );

  return xml.replace(pattern, (match, open, content, close) => {
    return open + removeEmojis(content) + close;
  });
}

export default {
  async fetch(request) {
    try {
      const response = await fetch(SOURCE_URL);

      if (!response.ok) {
        return new Response("Source feed error: " + response.status, {
          status: 502
        });
      }

      let xml = await response.text();

      xml = cleanTag(xml, "description");
      xml = cleanTag(xml, "description_ua");

      return new Response(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=UTF-8",
          "Cache-Control": "no-store"
        }
      });
    } catch (error) {
      return new Response("Feed processing error", {
        status: 500
      });
    }
  }
};
