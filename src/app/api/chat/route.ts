import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// /api/create-chat
export async function POST(req: Request, res: Response) {
    const { userId} = await auth();
    if (!userId) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log(file_key, file_name);
    await loadS3IntoPinecone(file_key);
    const chat_id = await db
    .insert(chats) 
    .values({
        pdfName: file_name,
        pdfUrl: file_key,
        userId,
        fileKey: file_key,
    })
    .returning({
        insertId: chats.id,
    })

    return NextResponse.json(
        {
            chat_id: chat_id[0].insertId,
        },
        { status: 200 }
    );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "internal server error" }, { status: 500 });
    }
}