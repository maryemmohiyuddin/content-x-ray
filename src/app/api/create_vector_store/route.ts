import { NextRequest } from "next/server";
import OpenAI from "openai";
import fs from 'fs'
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
   
    // A user wants to attach a file to a specific message, let's upload it.
    const aapl10k = await openai.files.create({
      file: fs.createReadStream("public/1.pdf"),
      purpose: "assistants",
    });

    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content:
            "How many shares of AAPL were outstanding at the end of of October 2023?",
          // Attach the new file to the message.
          attachments: [
            { file_id: aapl10k.id, tools: [{ type: "file_search" }] },
          ],
        },
      ],
    });

    // The thread now has a vector store in its tool resources.
    console.log(thread.tool_resources?.file_search);
    // const upload = await openai.beta.vectorStores.fileBatches.uploadAndPoll(
    //   vectorStore.id,
    //   { files: files }
    // );
    // console.log("upload", upload);
    // console.log("files", files);

    // console.log("request", request.body);
    // console.log("request", request.body);

    // let vectorStore = await openai.beta.vectorStores.create({
    //   name: "Financial Statement",
    // });

    // const upload = await openai.beta.vectorStores.fileBatches.uploadAndPoll(
    //   vectorStore.id,
    //   { files: files }
    // );
    return new Response("Files uploaded successfully", { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
