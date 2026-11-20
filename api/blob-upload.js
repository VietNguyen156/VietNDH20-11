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

function jsonResponse(response, data, status = 200) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(data));
}

export default async function handler(request, response) {
  if (request.method !== "POST")
    return jsonResponse(
      response,
      { error: "Phương thức không được hỗ trợ." },
      405,
    );

  if (!editorPasswordConfigured())
    return jsonResponse(
      response,
      { error: "Chưa cấu hình mật khẩu quản trị." },
      503,
    );

  try {
    const body =
      typeof request.body === "string"
        ? JSON.parse(request.body)
        : request.body;
    if (!body || typeof body !== "object")
      return jsonResponse(response, { error: "Yêu cầu tải tệp không hợp lệ." }, 400);

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
    return jsonResponse(response, uploadResult);
  } catch (error) {
    console.error("Could not authorize card media upload:", error);
    return jsonResponse(
      response,
      { error: error.message || "Không thể tải tệp lên." },
      400,
    );
  }
}
