import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

const PdfUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedText, setParsedText] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const fileBuffer = reader.result;

        const pdfDoc = await PDFDocument.load(new Uint8Array(fileBuffer));
        const textContent = [];

        for (let i = 0; i < pdfDoc.getPageCount(); i++) {
          const page = await pdfDoc.getPage(i + 1); // getPage() is 1-based index

          console.log("pages", page); // Log the page object to console
          // setConsoleOutput(`Page ${i + 1}: ${page.getTextContent()}`); // Update state with formatted message

          const content = await page.target;
          console.log("content",content)
          textContent.push(content);
        }

        const text = textContent.join("\n\n");
        setParsedText(text);
      };

      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error("Error parsing PDF:", error);
      // Handle error state
    }
  };

  return (
    <div className="text-black">
      <p>{consoleOutput}</p>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload & Parse PDF</button>
      {parsedText && <div>{parsedText}</div>}
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse ipsum distinctio fuga quia nulla sint tempora quo voluptas quae culpa aut maiores, repudiandae fugiat, deserunt perspiciatis, alias earum veritatis obcaecati voluptatem ad ipsam vitae neque! Porro rerum modi, voluptates aliquid tempora, debitis quaerat fugiat velit dolorem doloribus beatae ad! Enim inventore quae autem ipsa soluta? Voluptatum quas, expedita cupiditate dolor non recusandae voluptas sint debitis assumenda eos soluta nihil veritatis dolorum consectetur! Culpa, nulla pariatur optio animi suscipit quibusdam, tempore exercitationem vel rem aperiam harum. Sint, qui? Perferendis culpa, numquam, a minus aperiam mollitia nobis modi rerum, hic animi aut!</p>
    </div>
  );
};

export default PdfUploadComponent;
