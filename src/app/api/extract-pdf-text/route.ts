import { NextRequest } from "next/server";
import OpenAI from "openai";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument, PDFPage } from "pdf-lib";
import PDFJS from "pdf2json";

export async function POST(req: any, res: any) {
  try {
    const fileBuffer =
      req.body instanceof Buffer ? req.body : Buffer.from(req.body, "base64");

    // Initialize PDFJS object
    const pdf = new PDFJS(fileBuffer);

    // Load PDF
    //     await pdf.loadPDF(fileBuffer);
    // ;

    //       // Extract text

  
    //       const text = pdf.getRawTextContent();

    res.status(200).json({ pdf });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
