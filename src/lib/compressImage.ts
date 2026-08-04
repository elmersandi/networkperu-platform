export function compressImage(
  file: File,
  maxWidth = 800,
  quality = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo obtener el contexto del canvas"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Cambiamos la extensión original por .webp
              const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              resolve(new File([blob], newName, { type: "image/webp" }));
            } else {
              reject(new Error("Error al comprimir la imagen"));
            }
          },
          "image/webp", // Aquí lo forzamos a WebP
          quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsDataURL(file);
  });
}