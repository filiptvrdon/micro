export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

export async function compressImage(file: File, options: CompressionOptions = {}): Promise<File> {
  const { maxSizeMB = 0.2, maxWidthOrHeight = 1920 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidthOrHeight) {
            height *= maxWidthOrHeight / width;
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width *= maxWidthOrHeight / height;
            height = maxWidthOrHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Quality starts at 0.8 and decreases if size is still too large
        const quality = 0.8;
        const targetSizeBytes = maxSizeMB * 1024 * 1024;

        const attemptCompression = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Canvas to Blob conversion failed"));
                return;
              }

              if (blob.size > targetSizeBytes && q > 0.1) {
                attemptCompression(q - 0.1);
              } else {
                resolve(new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                }));
              }
            },
            "image/jpeg",
            q
          );
        };

        attemptCompression(quality);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
  });
}
