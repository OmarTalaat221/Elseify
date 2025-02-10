import { secondUrl } from "../baseUrl";

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData?.append("file_attachment", file);
  const response = await fetch(secondUrl + "upload_pdf.php", {
    method: "POST",
    body: formData,
  
  });

  const url = await response.json();
  return url?.message;
};
