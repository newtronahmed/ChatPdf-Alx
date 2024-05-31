import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs"
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";



export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  let Chat;
  if (userId) {
    Chat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (Chat) {
      Chat = Chat[0];
    }
  }

  return (

    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with AI-powered PDF Analyzers</h1>
            <UserButton afterSignOutUrl="/" />
          </div>

           <div className="flex mt-2">
            {isAuth && Chat && (
              <>
                <Link href={`/chat/${Chat.id}`}>
                  <Button>
                    Go to Chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                
              </>
            )}
          </div> 
          

          <p className="max-w-xl mt-1 text-lg text-slate-600">
          Research Made Simple: Extract key findings, answer specific questions, 
          and gain deeper understanding from any PDF with AI. 
          (Highlights extracting information from the PDF and answering specific questions)
          </p>

          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}