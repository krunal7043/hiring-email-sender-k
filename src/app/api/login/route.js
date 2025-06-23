    import { NextResponse } from "next/server";
    import jwt from "jsonwebtoken";

    const SECRET_KEY = "nashjkahjhasjdjasjdahsjdhas";

    export async function POST(req) {
    const { username, password } = await req.json();

    if (username === "hiring" && password === "Krunal1020") {
        const token = jwt.sign({ username }, "nashjkahjhasjdjasjdahsjdhas", {
        expiresIn: "1h",
        });

        const response = NextResponse.json({ success: true });

        response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        maxAge: 60 * 60,
        path: "/",
        });

        return response;
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
