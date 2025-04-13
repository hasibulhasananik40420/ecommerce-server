import sharp from "sharp";

// Compress image using sharp
const compressImage = async (inputPath: string, outputPath: string) => {
  try {
    await sharp(inputPath)
      .resize(800) // Resize image (adjust as necessary)
      .jpeg({ quality: 80 }) // Compress the image
      .toFile(outputPath);
  } catch (error: any) {
    throw new Error("Error during image compression: " + error.message);
  }
};


export default compressImage