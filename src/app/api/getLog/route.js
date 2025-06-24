import dbConnect from "@/lib/dbConnect";
import EmailLog from "@/model/logModel";
import { jwtVerify } from "jose";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ message: "Unauthorized: No token" }),
        {
          status: 401,
        }
      );
    }

    try {
      await jwtVerify(
        token,
        new TextEncoder().encode("nashjkahjhasjdjasjdahsjdhas")
      );
    } catch (err) {
      return new Response(JSON.stringify({ message: "Invalid token" }), {
        status: 401,
      });
    }

    await dbConnect();
    const logs = await EmailLog.find({}).sort({ sentAt: 1 });

    return new Response(JSON.stringify({ logs }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ logs: [], error: error.message }), {
      status: 500,
    });
  }
}
