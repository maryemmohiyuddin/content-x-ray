import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Input, Button, Card } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaGears } from "react-icons/fa6";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineUpload } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";

function Upload() {
  const [url, setUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const supabase = createClientComponentClient();
  const [urlDisabled, setUrlDisabled] = useState(false);
  const [fileInputDisabled, setFileInputDisabled] = useState(false);
  const [urlLoading, setURlLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [aiResponse, setAIResponse] = useState<string>("");
  const [aiAccessibility, setAIAccessibility] = useState<string>("");
  const [aiEffectiveness, setAIEffectiveness] = useState<string>("");
  const [aiStructure, setAIStructure] = useState<string>("");
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)]);
    }
    setUrlDisabled(!!selectedFiles);
    setFileInputDisabled(false);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleOpenAICall = async (url: string) => {
    const requestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a website analyzer. You will be provided with a URL of a website enclosed in <url> tag. You will have to generate a report based on the given in <structure> tag. In the <structure> tag we are using 'recommendations' too, but those recommendations are only instructions for you and should not be a part of response. Also we are using 'description' in the <structure> tag, we donot need that description in our response, it is for your instrucctions only. DONOT write any Summary, just follow the structure given.
                          
                    <structure>

                    ---## AI Content X-Ray Report### 
                    Introduction
                    The AI Content X-Ray tool provides an in-depth analysis of documents or web pages, offering insights and potential improvements across three key areas: Accessibility and Readability, Effectiveness and Sentiment, and Structure.
                    ### 1. Accessibility and Readability####
                    Description
                    Accessibility and readability focus on how easily a document can be read and understood by its audience. This dimension assesses the complexity of the language used and the required proficiency level in English.
                    #### Key Elements
                    - **Readability Level**: How challenging the text is to read and comprehend.
                    - **Language Complexity**: The sophistication of the vocabulary and sentence structure.
                    - **User Understanding**: The level of English proficiency needed for the reader to fully grasp the content.
                    #### Recommendations
                    - Simplify complex sentences and use common vocabulary to enhance understanding.
                    - Use readability tools to gauge the text's difficulty and adjust accordingly.
                    - Incorporate clear headings and subheadings to guide the reader.
                    ### 2. Effectiveness and Sentiment
                    #### Description
                    Effectiveness and sentiment measure how persuasive and impactful the document is. This dimension evaluates how well the message is conveyed and the emotional response it elicits from the reader.
                    #### Key Elements
                    - **Persuasiveness**: The ability of the document to convince and engage the reader.
                    - **Message Clarity**: How clearly the main ideas are presented.
                    - **Emotional Impact**: The use of metaphors and other rhetorical devices to evoke emotions.

                    #### Recommendations
                    - Strengthen key arguments with evidence and clear examples.
                    - Ensure the message is concise and to the point, avoiding unnecessary jargon.
                    - Use metaphors and analogies effectively to create a stronger emotional connection.
                    ### 3. Structure
                    #### Description
                    The structure dimension examines the visual and organizational aspects of the document. It focuses on how visuals and layout contribute to readability and comprehension.
                    #### Key Elements
                    - **Visual Aids**: The use of images, graphs, and charts to support the text.
                    - **Document Layout**: The overall organization and flow of the content.
                    - **Clarity of Visuals**: How well the visual elements aid in understanding the text.
                    #### Recommendations
                    - Incorporate relevant visuals to break up text and illustrate key points.
                    - Use bullet points and numbered lists for better organization.
                    - Ensure that all visual elements are clear and directly related to the content they support.
                    </structure>
      
      `,
        },
        {
          role: "user",
          content: `<url>${url}/</url>`,
        },
      ],
    };

    const options = {
      method: "POST",
      body: JSON.stringify(requestBody),
    };
    try {
      const response = await fetch("/api/openai_call", options);
      console.log("response", response);

      if (response.ok) {
        const data = await response.json();
        console.log("data", data.report);
        // const paragraph = JSON.parse(data.report).report;
        // console.log("data", JSON.parse(data.report).report);
        // setAIAccessibility(
        //   JSON.parse(data.report).report["Accessibility and readability"]
        // );
        // setAIEffectiveness(
        //   JSON.parse(data.report).report["Effectiveness and sentiment"]
        // );
        // setAIStructure(JSON.parse(data.report).report["Structure"]);
        setAIResponse(data.report);
      } else {
        console.error("Failed to call OpenAI:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUrlSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!url) return;

    try {
      setURlLoading(true);
      const user = await supabase.auth.getUser();
      const user_id = user.data.user?.id;

      if (!user_id) {
        toast.error("User not authenticated");
        return;
      }

      const upload_id = uuidv4();

      const { data, error } = await supabase.from("uploads").insert([
        {
          uploadid: upload_id,
          user_id,
          url,
          type: "url",
        },
      ]);

      if (error) {
        toast.error(error.message);
        console.error("Error saving URL:", error);
      } else {
        await handleOpenAICall(url);
        setUploadedFiles((prevFiles) => [...prevFiles, url]);
        // setUrl("");
      }
    } catch (error) {
      toast.error("Error during URL save");
      console.error("Error during URL save:", error);
    } finally {
      setURlLoading(false);
    }
  };
  const handleFileSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (files.length > 0) {
      try {
        let vectorStore = await openai.beta.vectorStores.create({
          name: "Financial Statement",
        });

        const upload = await openai.beta.vectorStores.fileBatches.uploadAndPoll(
          vectorStore.id,
          { files: files }
        );
        console.log("upload", upload);
        console.log("files", files);

        setFileLoading(true);
        const user = await supabase.auth.getUser();
        const user_id = user.data.user?.id;

        if (!user_id) {
          toast.error("User not authenticated");
          return;
        }

        const formData = new FormData();

        for (const file of files) {
          formData.append("files", file);
        }

        // await handleAnalyzeButtonClick(formData);
      } catch (error) {
        toast.error("Error during file upload");
        console.error("Error during file upload:", error);
      } finally {
        setFileLoading(false);
        setFiles([]);
      }
    }
  };

  async function handleAnalyzeButtonClick(formData: FormData) {
    try {
      // Create a vector store including our two files.
      // const response = await fetch("/api/create_vector_store", {
      //   method: "POST",
      //   body: formData,
      //   headers: {
      //     "Content-Type": "multipart/form-data", // Ensure this is set correctly
      //   },
      // });
      // if (!response.ok) {
      //   throw new Error("Failed to create vector store");
      // }
      // const responseData = await response.json();
      // console.log("Vector Store ID:", responseData.vectorStoreId);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="text-black">
      <div className="bg-white px-10 py-10 rounded-lg">
        <ToastContainer />

        <h1 className="font-medium">Submit Content For Analysis</h1>

        <div
          className={`mt-6 ${
            files.length > 0 ? "opacity-70 pointer-events-none" : ""
          } mb-2`}
        >
          <form className="flex gap-3">
            <Input
              radius="sm"
              type="url"
              label="Website"
              classNames={{
                label: "text-black/50 font-medium dark:text-white/90",
                input: ["bg-white"],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                  "fo",
                  "shadow-md",
                  "bg-white",
                  "dark:bg-white",
                  "hover:bg-white-",
                  "dark:hover:bg-white",
                  "dark:group-data-[focus=true]:bg-white",
                  "!cursor-text",
                ],
              }}
              placeholder="https://xyz.org"
              onChange={handleUrlChange}
              labelPlacement="outside"
            />

            <Button
              radius="sm"
              type="submit"
              className={`${
                urlLoading ? "pointer-events-none opacity-70" : ""
              } flex w-auto mt-2 self-end items-center justify-center bg-theme text-white ${
                fileInputDisabled ? "opacity-40 pointer-events-none" : ""
              }`}
              disabled={!url}
              onClick={handleUrlSubmit}
            >
              {urlLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Analyzing
                </>
              ) : (
                <>
                  <FaGears fontSize="40px" className="mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </form>
        </div>
        <p className="text-xs font-light mb-5">Enter your website URL here.</p>
        {aiResponse && (
          <div className="text-sm shadow-md overflow-y-auto px-7 py-5 my-3 rounded-lg">
            <h1 className="font-medium mb-2 text-wrap break-all">Report:</h1>
            <pre>{aiResponse}</pre>
            <p>{aiAccessibility}</p>
            <br />
            <p>{aiEffectiveness}</p>
            <br />
            <pre>{aiStructure}</pre>
          </div>
        )}

        <div>
          <div className="">
            <div
              className={`${
                url ? "opacity-70 pointer-events-none cursor-not-allowed" : ""
              }`}
            >
              <label htmlFor="file" className="text-[14px] font-medium">
                Upload Files
              </label>
              <form className="my-1">
                <div>
                  <div className="flex gap-3 items-center justiyf-center">
                    <label
                      htmlFor="fileInput"
                      className={`col col-span-1 input-shadow transition-all duration-150 bg-white rounded-lg opacity-60 border-dashed h-full py-2 w-full flex items-center justify-center cursor-pointer ${
                        fileInputDisabled
                          ? "opacity-40 pointer-events-none"
                          : ""
                      }`}
                    >
                      <p className="text-sm py-1 flex items-center justify-center gap-1">
                        <AiOutlineUpload />
                        Upload files
                      </p>
                      <input
                        id="fileInput"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf,.docx,.txt"
                        multiple
                        disabled={fileInputDisabled}
                      />
                    </label>
                    <Button
                      radius="sm"
                      type="submit"
                      className={`${
                        fileLoading ? "pointer-events-none opacity-70" : ""
                      } flex w-auto mt-2 self-end items-center justify-center bg-theme text-white ${
                        fileInputDisabled
                          ? "opacity-40 pointer-events-none"
                          : ""
                      }`}
                      disabled={files.length === 0 || fileInputDisabled}
                      onClick={handleFileSubmit}
                    >
                      {fileLoading ? (
                        <>
                          <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            className="mr-2"
                          />
                          Analyzing
                        </>
                      ) : (
                        <>
                          <FaGears fontSize="40px" className="mr-2" />
                          Analyze
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs font-light mt-1">
                    Note: You can select maximum 5 files.
                  </p>
                </div>
              </form>
            </div>
            {files.length > 0 && (
              <div className="text-[14px] w-full">
                <h2 className="text-[14px] w-full mb-2 mt-5 font-medium">
                  Selected Files
                </h2>
                <ul className="border rounded-xl w-full space-y-2 px-3 py-2 max-h-[200px] overflow-auto">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between cursor-pointer hover:bg-gray-100 px-4 rounded-lg py-1"
                      style={{ wordWrap: "break-word" }}
                    >
                      {file.name}
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="ml-2 text-red-600 w-1 h-1 "
                      >
                        &#10005;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
