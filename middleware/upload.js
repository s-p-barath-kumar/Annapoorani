import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_KEY,
      api_secret: process.env.CLOUD_SECRET
    });


    let folder = "uploads";

    console.log(file, "filefilefilefile")

    // Student registration documents
    if (
      file.fieldname === "profilePic" ||
      file.fieldname === "incomeCertificate" ||
      file.fieldname === "aadhaarCard" ||
      file.fieldname === "teacherSignature"
    ) {
      const regNo = req.body.regNo || "unknown";

      folder = `uploads/students/${regNo}`;
    }

    // Food images
    if (file.fieldname === "foodImage") {
      folder = "uploads/foods";
    }

    const isPdf = file.mimetype === "application/pdf";
    return {
      folder,
      // Change 1: Set resource_type to "raw" for PDFs
      resource_type: "image",
      format: isPdf ? "pdf" : undefined,

      // Change 2: ONLY provide allowed_formats if it's NOT a PDF
      // Cloudinary throws an error if you provide formats for "raw" types
      allowed_formats: isPdf ? ["pdf"] : ["jpg", "png", "jpeg"],
    };
  }
});

export const upload = multer({ storage });