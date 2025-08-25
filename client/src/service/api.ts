import configAxios from "./axiosConfig";

export const processAndFetchData = (formData: FormData) => {
  return configAxios.post("/api/aadhaar/process", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
