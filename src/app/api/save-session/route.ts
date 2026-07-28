import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface SaveSessionBody {
  promptText: string;
  responseText: string;
  modelName: string;
}

/**
 * POST /api/save-session
 *
 * Persists a broadcast Q&A pair to the local filesystem as a markdown file.
 * Files are organized in date-stamped folders with sequential numbering:
 *
 *   sessions/2026-07-28/001-question.md
 *   sessions/2026-07-28/002-question.md
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SaveSessionBody;
    const { promptText, responseText, modelName } = body;

    // Validate required fields
    if (!promptText?.trim() || !responseText?.trim()) {
      return NextResponse.json(
        { success: false, error: "Both promptText and responseText are required." },
        { status: 400 }
      );
    }

    // Build the date-stamped folder path (e.g. sessions/2026-07-28)
    const today = new Date();
    const dateFolder = today.toISOString().split("T")[0]; // YYYY-MM-DD
    const sessionsDir = path.join(process.cwd(), "sessions", dateFolder);

    // Ensure the directory exists
    await fs.mkdir(sessionsDir, { recursive: true });

    // Determine the next sequence number by scanning existing files
    const existingFiles = await fs.readdir(sessionsDir);
    const questionFiles = existingFiles.filter(
      (f) => /^\d{3}-question\.md$/.test(f)
    );
    const nextNumber = questionFiles.length + 1;
    const paddedNumber = String(nextNumber).padStart(3, "0");

    // Format the markdown content
    const timestamp = today.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const markdownContent = [
      `# Question`,
      ``,
      promptText.trim(),
      ``,
      `---`,
      ``,
      `## Answer`,
      ``,
      `**Model:** ${modelName || "Unknown"}`,
      ``,
      responseText.trim(),
      ``,
      `---`,
      ``,
      `*Presented at ${timestamp} on ${dateFolder}*`,
      ``,
    ].join("\n");

    // Write the file
    const fileName = `${paddedNumber}-question.md`;
    const filePath = path.join(sessionsDir, fileName);
    await fs.writeFile(filePath, markdownContent, "utf-8");

    return NextResponse.json({
      success: true,
      filePath: `sessions/${dateFolder}/${fileName}`,
    });
  } catch (error) {
    console.error("Failed to save session:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error while saving session." },
      { status: 500 }
    );
  }
}
