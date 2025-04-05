import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import config from '../config';
import fs from 'fs';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
  secure: true, 
});



export const sendFileToCloudinary = (
  fileName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: fileName.trim(), resource_type: 'raw', secure: true, format: 'html' }, // Use 'raw' for non-image files
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
        // delete a file asynchronously
        fs.unlink(path, () => {});
      },
    );
  });
};




export const sendPdfFileToCloudinary = (
  fileName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: fileName.trim(), resource_type: 'raw', secure: true, format: 'pdf' }, // Use 'raw' for non-image files
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
        // delete a file asynchronously
        fs.unlink(path, () => {});
      },
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    if (file?.mimetype === 'text/html') {
      cb(null, file.fieldname + '-' + uniqueSuffix + '.html');
    } else {
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  },
});
export const uploadHtmlFile = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'text/html',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      
      cb(null, false);
    }
  },
});


