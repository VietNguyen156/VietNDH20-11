import { del, list, put } from "@vercel/blob";
import {
  editorPasswordConfigured,
  isEditorPasswordValid,
} from "../lib/card-auth.js";

const statePath = "teacher-card/card.json";
const settingLimits = {
  date: 40,
  prompt: 100,
  hint: 140,
  eyebrow: 100,
  title: 120,
  greeting: 140,
  message: 3000,
  signature: 240,
};

function jsonResponse(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function isPublicCardBlobUrl(value) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".public.blob.vercel-storage.com") &&
      url.pathname.startsWith("/teacher-card/")
    );
  } catch {
    return false;
  }
}

function validateMediaList(value, maximumCount) {
  return (
    Array.isArray(value) &&
    (maximumCount === null || value.length <= maximumCount) &&
    value.every(
      (item) =>
        item &&
        typeof item.name === "string" &&
        item.name.length <= 255 &&
        isPublicCardBlobUrl(item.url),
    )
  );
}

function validateCardState(value) {
  if (!value || typeof value !== "object" || !value.settings) return false;
  if (
    !Object.entries(settingLimits).every(
      ([key, maximumLength]) =>
        typeof value.settings[key] === "string" &&
        value.settings[key].length <= maximumLength,
    )
  )
    return false;

  if (
    !value.photos ||
    !validateMediaList(value.photos.letter, 3) ||
    !validateMediaList(value.photos.sphere, null)
  )
    return false;

  return (
    value.music === null ||
    (value.music &&
      typeof value.music.name === "string" &&
      value.music.name.length <= 255 &&
      isPublicCardBlobUrl(value.music.url))
  );
}

async function readStoredCard() {
  const { blobs } = await list({ prefix: statePath, limit: 1 });
  const storedBlob = blobs.find((blob) => blob.pathname === statePath);
  if (!storedBlob) return null;

  const response = await fetch(
    storedBlob.url + "?v=" + encodeURIComponent(storedBlob.etag),
    { cache: "no-store" },
  );
  if (!response.ok)
    throw new Error("Không đọc được nội dung đã xuất bản.");
  return response.json();
}

function mediaUrls(card) {
  return [
    ...(card?.photos?.letter || []),
    ...(card?.photos?.sphere || []),
    ...(card?.music ? [card.music] : []),
  ].map((item) => item.url);
}

async function handler(request) {
  if (request.method === "GET") {
    try {
      return jsonResponse({ state: await readStoredCard() });
    } catch (error) {
      console.error("Could not read published card:", error);
      return jsonResponse(
        { error: "Không đọc được dữ liệu trên Vercel Blob." },
        503,
      );
    }
  }

  if (request.method !== "PUT")
    return jsonResponse(
      { error: "Phương thức không được hỗ trợ." },
      405,
    );

  if (!editorPasswordConfigured())
    return jsonResponse(
      { error: "Chưa cấu hình mật khẩu quản trị." },
      503,
    );

  const authorization = request.headers.get("authorization") || "";
  const suppliedPassword = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";
  if (!isEditorPasswordValid(suppliedPassword))
    return jsonResponse(
      { error: "Mật khẩu quản trị không đúng." },
      401,
    );

  try {
    const card = await request.json();
    if (
      !validateCardState(card) ||
      Buffer.byteLength(JSON.stringify(card), "utf8") > 1_000_000
    )
      return jsonResponse(
        { error: "Dữ liệu thiệp không hợp lệ." },
        400,
      );

    const previousCard = await readStoredCard();
    await put(statePath, JSON.stringify(card), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      contentType: "application/json",
    });

    const retainedUrls = new Set(mediaUrls(card));
    const removedUrls = mediaUrls(previousCard).filter(
      (url) => !retainedUrls.has(url),
    );
    let cleanupWarning = "";
    if (removedUrls.length) {
      try {
        await del(removedUrls);
      } catch (error) {
        console.error("Could not remove old card media:", error);
        cleanupWarning =
          "Nội dung đã xuất bản, nhưng chưa xóa được một số tệp cũ.";
      }
    }

    return jsonResponse({ ok: true, cleanupWarning });
  } catch (error) {
    console.error("Could not publish card:", error);
    return jsonResponse(
      { error: error.message || "Không thể xuất bản thiệp." },
      500,
    );
  }
}

export default { fetch: handler };
