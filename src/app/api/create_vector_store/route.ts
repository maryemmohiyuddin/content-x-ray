import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    console.log(await request.body);
    let vectorStore = await openai.beta.vectorStores.create({
      name: "Financial Statement",
    });

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
