import configAxios from "./axiosConfig";


export const processAndFetchData = (formData: FormData) => {
    return configAxios.post("/api/ocr/process", formData);
}