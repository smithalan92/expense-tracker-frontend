import getAxios from "./axios";

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("image", file);

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
}

export interface UploadFileResponse {
  file: string;
}
