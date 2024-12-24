import getAxios from "./axios";

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  // We always want to hit the production API URL for file uploads
  const { data } = await getAxios().post<UploadFileResponse>(
    `${import.meta.env.PRODUCTION_API_URL}/files/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `appStore.authToken`,
      },
    },
  );

  return data.file;
}

export interface UploadFileResponse {
  file: string;
}
