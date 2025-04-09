import { useState } from "react";
import axiosInstance from "../helpers/axios";
import url from "../helpers/url";
import { toast } from "react-hot-toast";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
  onFileUploadComplete: (filedId: string) => void;
};

const FileInput = ({ onFileUploadComplete }: Props) => {
  const [file, setFile] = useState<any>(null);

  const handleChange = async (e: any) => {
    const toastID = toast.loading("Uploading file...");
    try {
      const file = e.target.files[0];
      console.log(file);
      const formData = new FormData();
      formData.append("file", file);
      const response = await axiosInstance.post(
        url + "/files/upload",
        formData
      );
      const submittedFile = response.data.data || {};
      setFile(submittedFile);
      onFileUploadComplete(submittedFile.id);
      toast.success("File uploaded successfully", { id: toastID });
    } catch (error: any) {
      console.log(error.response);
      const message = error.response?.data?.message || "Error uploading file";
      toast.error(message, { id: toastID });
    }
  };

  return (
    <>
      <label
        htmlFor="phoneNumber"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Request Letter
      </label>
      <div className="flex items-center justify-center w-full mb-1">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            {file?.name ? (
              <p className="text-xs text-gray-500">{file?.name}</p>
            ) : (
              <p className="text-xs text-gray-500">PDF, PNG, JPG, GIF</p>
            )}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>
    </>
  );
};

export default FileInput;
