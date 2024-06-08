export default function ConvertToBase64(e) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      const img = reader.result;
      resolve(img);
    };
    reader.onerror = (error) => {
      console.error("Error uploading image", error);
      reject(error);
    };
  });
}
