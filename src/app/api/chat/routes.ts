import { db } from "@/lib/db";
import { Flow, DocumentArray, Document } from "jina";
import { getContext } from "@/lib/context"; // Import the getContext function

export const runtime = "edge";

// Assuming you have your Jina flow configured and running

const jinaFlow = new Flow("https://api.jina.ai/v1/embeddings"); // Replace with your Jina flow URL

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, chatId); // Adjust based on your context retrieval logic

    const prompt = new Document({
      text: `
        AI assistant is a brand new, powerful, human-like artificial intelligence.
        The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
        AI assistant is a big fan of Pinecone and Vercel.
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK
        AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
        If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
        AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
        AI assistant will not invent anything that is not drawn directly from the context.
      `,
      tags: { chatId, role: "system" }, // Add chatId and role as tags for context
    });

    const responses = await jinaFlow.post("/", new DocumentArray([prompt]));

    // Assuming responses contains an array of Documents with the generated response
    const generatedResponse = responses[0].text;

    // Save user message into db (logic similar to OpenAI code)
    await db.insert(messages).values({
      chatId,
      content: lastMessage.content,
      role: "user",
    });

    // Save AI message into db (logic similar to OpenAI code)
    await db.insert(messages).values({
      chatId,
      content: generatedResponse,
      role: "system",
    });

    return new Response(generatedResponse, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
