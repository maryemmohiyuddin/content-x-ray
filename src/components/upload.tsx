import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Input, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaGears } from "react-icons/fa6";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineUpload } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Upload() {
  const [url, setUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const supabase = createClientComponentClient();
  const [maxFiles, setMaxFiles] = useState(5);
  const [urlDisabled, setUrlDisabled] = useState(false);
  const [fileInputDisabled, setFileInputDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (files.length >= 5) {
        alert("You can only select up to 5 files.");
      } else {
        setFiles((prevFiles) => [...prevFiles, selectedFile]);
        updateMaxFilesLimit();
      }
    }
    setUrlDisabled(!!selectedFile);
    setFileInputDisabled(false);
  };

  const updateMaxFilesLimit = () => {
    const remainingCapacity = 5 - files.length;
    setMaxFiles(remainingCapacity);
  };

  useEffect(() => {
    updateMaxFilesLimit();
  }, [files]);

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("URL to analyze:", url);
  };

  const handleFileSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (files.length > 0) {
      console.log("Files to analyze:", files);
      try {
        setLoading(true);

        for (const file of files) {
          console.log("filename", file.name);
          const { data, error } = await supabase.storage
            .from("content-files")
            .upload(`/${file.name}`, file);

          if (error) {
            toast.error(error.message + " " + file.name);
            console.error("Error uploading file:", error);
          } else {
            toast.success("File uploaded successfully" + " " + file.name);
            console.log("File uploaded successfully:", data);
            setUploadedFiles((prevFiles) => [...prevFiles, data.path]);
          }
        }
      } catch (error) {
        toast.error("Error during file upload");
        console.error("Error during file upload:", error);
      } finally {
        setLoading(false);
        setFiles([]);
      }
    }
  };

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
          <form onSubmit={handleUrlSubmit} className="flex gap-3">
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
              placeholder="xyz.org"
              onChange={handleUrlChange}
              labelPlacement="outside"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">https://</span>
                </div>
              }
            />

            <Button
              type="submit"
              radius="sm"
              className="!flex !w-auto mt-2  self-end items-center justify-center bg-theme text-white"
            >
              <FaGears fontSize="40px" />
              Analyze
            </Button>
          </form>
        </div>
        <p className="text-xs font-light mb-5">Enter your website URL here.</p>
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
                        disabled={fileInputDisabled}
                      />
                    </label>
                    <Button
                      radius="sm"
                      type="submit"
                      className={`${
                        loading ? "pointer-events-none opacity-70" : ""
                      } flex w-auto mt-2 self-end items-center justify-center bg-theme text-white ${
                        fileInputDisabled
                          ? "opacity-40 pointer-events-none"
                          : ""
                      }`}
                      disabled={files.length === 0 || fileInputDisabled}
                      onClick={handleFileSubmit}
                    >
                      {loading ? (
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
                <ul className="border rounded-xl w-full space-y-2 px-3 py-2">
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
