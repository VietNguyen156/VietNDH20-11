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

export default async function handler(request) {
  if (request.method !== "POST")
    return Response.json(
      { error: "Phương thức không được hỗ trợ." },
      { status: 405 },
    );

  if (!editorPasswordConfigured())
    return Response.json(
      { error: "Chưa cấu hình mật khẩu quản trị." },
      { status: 503 },
    );

  try {
    const body = await request.json();
    const response = await handleUpload({
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
    return Response.json(response);
  } catch (error) {
    console.error("Could not authorize card media upload:", error);
    return Response.json(
      { error: error.message || "Không thể tải tệp lên." },
      { status: 400 },
    );
  }
}
