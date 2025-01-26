import { promises as fs } from "fs";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument, PDFPage } from "pdf-lib";

export async function POST(req: any, res: any) {
  try {
    console.log("Req", req);
     const file = await req.body;
     const pdfBytes = Buffer.from(await file.arrayBuffer());
     const pdfDoc = await PDFDocument.load(pdfBytes);
     const pages = pdfDoc.getPages();
     console.log("pages", pages);
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

