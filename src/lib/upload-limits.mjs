export const MAX_UPLOAD_FILES = 5;

export function exceedsUploadFileLimit(files) {
  return files.length > MAX_UPLOAD_FILES;
}
