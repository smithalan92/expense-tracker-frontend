import axios from "axios";
import getAxios from "./axios";

export class FileUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileUploadError";
  }
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  try {
    // We always want to hit the production API URL for file uploads
    const { data } = await getAxios().post<UploadFileResponse>(
      `${import.meta.env.VITE_PRODUCTION_API_URL}/v2/files/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data.file;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 413) {
        throw new FileUploadError("That image is too large. Please choose one under 25MB.");
      }

      if (err.response?.status === 415) {
        throw new FileUploadError("That file isn't an image we can read. Try a JPEG or PNG.");
      }
    }

    throw err;
  }
}

export interface UploadFileResponse {
  file: string;
}
