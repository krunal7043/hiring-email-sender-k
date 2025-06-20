// import fs from "fs";
// import path from "path";
import dbConnect from "@/lib/dbConnect";
import EmailLog from "@/model/logModel";

export async function GET() {
  try {
    // const logFilePath = path.join(process.cwd(), "email-log.txt");
    // const logData = fs.readFileSync(logFilePath, "utf8");

    await dbConnect();

    const logs = await EmailLog.find({}).sort({ sentAt: 1 });

    return new Response(JSON.stringify({ logs }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ logs: [], error: error.message }), {
      status: 500,
    });
  }
}
