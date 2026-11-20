import { timingSafeEqual } from "node:crypto";

export function editorPasswordConfigured() {
  return Boolean(process.env.EDITOR_PASSWORD);
}

export function isEditorPasswordValid(value) {
  const expected = process.env.EDITOR_PASSWORD;
  if (!expected || typeof value !== "string") return false;

  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(value);
  return (
    expectedBuffer.length === actualBuffer.length &&
    timingSafeEqual(expectedBuffer, actualBuffer)
  );
}
