import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    let requestData = await request.json();

    console.log(requestData);

    const completion = await openai.chat.completions.create({
      messages: requestData.messages,
      model: requestData.model,
      response_format: { type: "json_object" },
    });

    const aiResponse = completion.choices[0].message.content;

    console.log("AI Response:", aiResponse);

    return new Response(JSON.stringify({ report: aiResponse }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
