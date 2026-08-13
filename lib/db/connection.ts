export function getConnectionString(): string {
  if (process.env.DIRECT_DATABASE_URL) {
    return process.env.DIRECT_DATABASE_URL;
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  if (url.startsWith("prisma+postgres://")) {
    try {
      const parsed = new URL(url);
      const apiKey = parsed.searchParams.get("api_key");
      if (apiKey) {
        const decoded = JSON.parse(
          Buffer.from(apiKey, "base64url").toString("utf8"),
        ) as { databaseUrl?: string };
        if (decoded.databaseUrl) {
          return decoded.databaseUrl;
        }
      }
    } catch {
      // fall through to raw URL
    }
  }

  return url;
}
