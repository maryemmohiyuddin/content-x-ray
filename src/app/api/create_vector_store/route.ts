import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const data = await request.formData();
    const formDataEntries = Array.from(data.getAll("files"));
    const files: File[] = formDataEntries
      .filter((entry) => entry instanceof File)
      .map((entry) => entry as File);

    if (files.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No valid files uploaded",
      });
    }

    const customVectorID = uuidv4();
    let vectorStore = await openai.beta.vectorStores.create({
      name: customVectorID,
    });

    const upload = await openai.beta.vectorStores.fileBatches.uploadAndPoll(
      vectorStore.id,
      { files: files }
    );

    return NextResponse.json({ success: true, upload });
  } catch (error) {
    console.error("Error during upload:", error);
    return NextResponse.json({ success: false, error: error });
  }
}
