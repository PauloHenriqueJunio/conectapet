import { Injectable } from "@nestjs/common";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import * as streamifier from "streamifier";

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "conectapet" },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("No result from Cloudinary"));
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
