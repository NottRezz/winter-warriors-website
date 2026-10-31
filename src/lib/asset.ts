const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** next/image doesn't add the site's sub-path by itself, so local images need it here. */
export function asset(path: string) {
  return path.startsWith("/") ? `${basePath}${path}` : path;
}
