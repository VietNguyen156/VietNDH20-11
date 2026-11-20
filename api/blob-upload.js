import { handleUpload } from "@vercel/blob/client";
import {
  editorPasswordConfigured,
  isEditorPasswordValid,
} from "../lib/card-auth.js";

const imageTypes = [
  "image/avif",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const audioTypes = [
  "audio/aac",
  "audio/mp4",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "audio/x-wav",
];

function jsonResponse(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function handler(request) {
  if (request.method !== "POST")
    return jsonResponse(
      { error: "Phương thức không được hỗ trợ." },
      405,
    );

  if (!editorPasswordConfigured())
    return jsonResponse(
      { error: "Chưa cấu hình mật khẩu quản trị." },
      503,
    );

  try {
    const body = await request.json();
    if (!body || typeof body !== "object")
      return jsonResponse({ error: "Yêu cầu tải tệp không hợp lệ." }, 400);

    const uploadResult = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!isEditorPasswordValid(clientPayload))
          throw new Error("Mật khẩu quản trị không đúng.");

        const category = pathname.split("/")[1];
        if (
          !pathname.startsWith("teacher-card/") ||
          !["letter", "sphere", "music"].includes(category)
        )
          throw new Error("Đường dẫn tải tệp không hợp lệ.");

        return {
          allowedContentTypes: category === "music" ? audioTypes : imageTypes,
          addRandomSuffix: true,
        };
      },
    });
    return jsonResponse(uploadResult);
  } catch (error) {
    console.error("Could not authorize card media upload:", error);
    return jsonResponse(
      { error: error.message || "Không thể tải tệp lên." },
      400,
    );
  }
}

export default { fetch: handler };
