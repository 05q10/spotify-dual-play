import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const songsDir = path.join(process.cwd(), "public", "songs");
    const files = fs.readdirSync(songsDir);
    const mp3Files = files.filter((f) => f.endsWith(".mp3"));
    // Return URLs that the browser can use
    const urls = mp3Files.map((f) => `/songs/${f}`);
    return NextResponse.json({ songs: urls });
  } catch (err) {
    console.error("Error reading songs:", err);
    return NextResponse.json({ songs: [] }, { status: 500 });
  }
}
