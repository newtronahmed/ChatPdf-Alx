import OpenAI from "openai";
const openai = new OpenAI({ apiKey: 'sk-proj-dBkN4PhyCOE051FMc0ENT3BlbkFJoO7iJq6d0Y02HfACm8Mj' });



async function main() {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ],
    stream: true,
  });

  for await (const chunk of completion) {
    console.log(chunk.choices[0].delta.content);
  }
}

main();