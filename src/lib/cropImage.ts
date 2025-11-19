
export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  fileName: string = "avatar.jpg"
): Promise<File> => {
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No 2d context"));

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));

        // ← САМОЕ ГЛАВНОЕ: создаём File с правильным именем и типом
        const file = new File([blob], fileName, { type: blob.type || "image/jpeg" });
        resolve(file);
      }, "image/jpeg", 0.95);
    };

    image.onerror = reject;
  });
};