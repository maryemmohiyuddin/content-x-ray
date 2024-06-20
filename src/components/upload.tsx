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
import axios from "axios";
import { FaRegFilePdf } from "react-icons/fa";
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
  const [pdfLoading, setPDFLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>("");
  const [userID, setUserID] = useState<string | undefined>("");
  const [aiResponse, setAIResponse] = useState<string | undefined>("");
  const [pdfLink, setPDFLink] = useState<string | undefined>("");
  const [fileAIResponse, setFileAIResponse] = useState<string>("");
  const [urlUploadId, setUrlUploadId] = useState<string>("");
  const [fileUploadId, setFileUploadId] = useState<string>("");
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

  const updateSupabase = async (upload_id: String, report: any) => {
    try {
      const res = await supabase
        .from("uploads")
        .update({ report: report })
        .eq("uploadid", upload_id);

      if (!res) {
        console.error("Error updating Supabase:");
      } else {
      }
    } catch (error) {
      console.error("Error updating Supabase:", error);
    }
  };

  const handleOpenAICall = async (url: string, upload_id: String) => {
    const requestBody = {
      url: url,
    };
    const options = {
      method: "POST",
      body: JSON.stringify(requestBody),
    };
    try {
      const response = await fetch("/api/chat_completion", options);

      if (response.ok) {
        const data = await response.json();
        setAIResponse(data.report);
        await updateSupabase(upload_id, data.report);
      } else {
        toast.error("Error during OpenAI Call");
        console.error("Failed to call OpenAI:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error during OpenAI Call");
    }
  };

  const createPdfAsync = async (report: string, upload_id: string) => {
    try {
      setPDFLoading(true);
      const { data: supabaseData, error: supabaseError } = await supabase
        .from("uploads")
        .select("pdf")
        .eq("uploadid", upload_id)
        .limit(1)
        .single();

      if (supabaseError) {
        toast.error("Error during PDF Creation. Please try again");
        console.error(
          "Error fetching data from Supabase:",
          supabaseError.message
        );
        setPDFLoading(false);
        return;
      }
      if (!supabaseData?.pdf) {
        const response = await axios.post(
          "https://api.craftmypdf.com/v1/create",
          {
            data: { body: report, person_name: userEmail },
            template_id: "06a77b230de5b7f6",
            expiration: 60,
            is_cmyk: false,
            load_data_from: null,
            version: 8,
            export_type: "json",
            output_file: "output.pdf",
            direct_download: 1,
            cloud_storage: 1,
            pdf_standard: "string",
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-API-KEY": "61b6Njk3Mjo3MDAwOnUyUVhJRGRkOUpkQ3RrcW0",
            },
          }
        );
        const { file } = response.data;

        if (file) {
          const { data, error } = await supabase
            .from("uploads")
            .update({ pdf: file })
            .eq("uploadid", upload_id);

          if (error) {
            console.error("Error updating Supabase PDF column:", error.message);
          } else {
          }
          const link = document.createElement("a");
          link.href = file;
          link.download = "output.pdf";
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setPDFLink(file);
        setPDFLoading(false);
      } else {
        const pdfLink = supabaseData.pdf;
        const link = document.createElement("a");
        link.href = pdfLink;
        link.download = "output.pdf";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setPDFLink(pdfLink);
        setPDFLoading(false);
      }
    } catch (error) {
      toast.error("Error during PDF Creation. Please try again");
      console.error("Error creating PDF:", error);
      setPDFLoading(false);
    }
  };

  const handleUrlSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAIResponse("");
    setFileAIResponse("");
    setUrlUploadId("");
    setFileUploadId("");

    if (!url) return;

    try {
      setURlLoading(true);

      if (!userID) {
        toast.error("User not authenticated");
        return;
      }
      const upload_id = uuidv4();
      setUrlUploadId(upload_id);
      const { data, error } = await supabase.from("uploads").insert([
        {
          uploadid: upload_id,
          user_id: userID,
          url,
          type: "url",
        },
      ]);
      if (error) {
        toast.error("Error during analyzing url");
        console.error("Error saving URL:", error);
      } else {
        await handleOpenAICall(url, upload_id);
        setUploadedFiles((prevFiles) => [...prevFiles, url]);
      }
    } catch (error) {
      toast.error("Error during analyzing url");
      console.error("Error during URL save:", error);
    } finally {
      setURlLoading(false);
    }
  };
  const handleFileSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAIResponse("");
    setFileAIResponse("");
    setUrlUploadId("");
    setFileUploadId("");

    if (files.length > 0) {
      try {
        setFileLoading(true);
        const upload_id = uuidv4();
        setFileUploadId(upload_id);

        for (const file of files) {
          const fileId = uuidv4();
          try {
            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("content-files")
                .upload(`/${fileId}_${file.name}`, file);

            // console.log("upload", uploadError, uploadData);

            if (uploadError) {
              setFiles([]);

              throw new Error(
                `Error uploading file: ${uploadError.message} ${file.name}`
              );
            }

            const { data: publicUrlData } = await supabase.storage
              .from("content-files")
              .getPublicUrl(`/${fileId}_${file.name}`);

            if (publicUrlData.publicUrl) {
              const updateupabase = await supabase.from("uploads").insert([
                {
                  uploadid: upload_id,
                  user_id: userID,
                  url: publicUrlData.publicUrl,
                  type: "file",
                },
              ]);
              // console.log("update supabase", updateupabase);

              // if (insertError) {
              //   setFiles([]);

              //   throw new Error(
              //     `Error saving file URL: ${insertError.message} ${file.name}`
              //   );
              // } else {
              //   setUploadedFiles((prevFiles) => [
              //     ...prevFiles,
              //     publicUrlData.publicUrl,
              //   ]);
              // }
            }
          } catch (error) {
            toast.error("Error during file upload. Please try again");
            setFiles([]);

            console.error(error);
          }
        }

        const data = new FormData();
        files.forEach((file) => data.append("files", file));

        try {
          const customVectorID = uuidv4();
          let vectorStore = await openai.beta.vectorStores.create({
            name: customVectorID,
          });

          const upload =
            await openai.beta.vectorStores.fileBatches.uploadAndPoll(
              vectorStore.id,
              { files: files }
            );
          // const res = await fetch("/api/create_vector_store", {
          //   method: "POST",
          //   body: data,
          // });
          // console.log("upload", upload);

          // if (!res.ok) {
          //   setFiles([]);
          //   throw new Error("Failed to create vector store");
          // }

          // const result = await res.json();
          const uploadId = upload.vector_store_id;

          const customAssistantID = uuidv4();

          try {
            const fileResponse = await fetch("/api/assistant_create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customAssistantID,
                uploadId,
              }),
            });
            // console.log("fileResponse", fileResponse);
            if (!fileResponse.ok) {
              toast.error("Error during file upload. Please try again");
              setFiles([]);
              throw new Error("Failed to create assistant");
            }
            const fileResult = await fileResponse.json();
            await updateSupabase(upload_id, fileResult.report);
            setFileAIResponse(fileResult.report);
          } catch (error) {
            toast.error("Error during file upload. Please try again");
            setFiles([]);
            throw new Error(`Error creating assistant`);
          }
        } catch (error) {
          toast.error("Error during file upload. Please try again");
          setFiles([]);

          throw new Error(`Error during vector store creation`);
        }

        setFileLoading(false);
        setFiles([]);
      } catch (error) {
        setFileLoading(false);
        setFiles([]);
        toast.error("Error during file upload. Please try again");
        console.error("Error during file analyze:", error);
      }
    }
  };

  useEffect(() => {
    const handleUser = async () => {
      const user = await supabase.auth.getUser();
      setUserEmail(user.data.user?.email);
      setUserID(user.data.user?.id);
    };
    handleUser();
  }, []);
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
            <button
              className={`${
                pdfLoading ? "opacity-50 pointer-events-none" : ""
              } bg-theme flex items-center justify-center gap-1 text-white px-3 py-2 rounded-md mb-4 hover:bg-themedark transition-all duration-150`}
              onClick={() => createPdfAsync(aiResponse, urlUploadId)}
            >
              {" "}
              {pdfLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Exporting
                </>
              ) : (
                <>
                  <FaRegFilePdf />
                  Export to PDF
                </>
              )}
            </button>
            <div
              className="aiResponse"
              dangerouslySetInnerHTML={{ __html: aiResponse }}
            />
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
              <form className="my-1" encType="multipart/form-data">
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
            {fileAIResponse && (
              <div className="text-sm shadow-md overflow-y-auto px-7 py-5 my-3 rounded-lg">
                <button
                  className={`${
                    pdfLoading ? "opacity-50 pointer-events-none" : ""
                  } bg-theme flex items-center justify-center gap-1 text-white px-3 py-2 rounded-md mb-4 hover:bg-themedark transition-all duration-150`}
                  onClick={() => createPdfAsync(fileAIResponse, fileUploadId)}
                >
                  {" "}
                  {pdfLoading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      Exporting
                    </>
                  ) : (
                    <>
                      <FaRegFilePdf />
                      Export to PDF
                    </>
                  )}
                </button>
                <div
                  className="aiResponse"
                  dangerouslySetInnerHTML={{ __html: fileAIResponse }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
