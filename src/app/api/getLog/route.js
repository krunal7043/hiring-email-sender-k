import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const logFilePath = path.join(process.cwd(), "email-log.txt");
    const logData = fs.readFileSync(logFilePath, "utf8");

    return new Response(logData, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    return new Response("No logs available", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
