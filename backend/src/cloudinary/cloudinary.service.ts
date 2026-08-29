import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import * as streamifier from "streamifier";

type UploadableFile = {
  buffer: Buffer;
};

@Injectable()
export class CloudinaryService {
  private ensureCloudinaryConfig() {
    const requiredEnvVars = [
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ];

    const missingVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar],
    );

    if (missingVars.length > 0) {
      throw new ServiceUnavailableException(
        `Configuração do Cloudinary ausente: ${missingVars.join(", ")}.`,
      );
    }
  }

  uploadFile(
    file: UploadableFile,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    this.ensureCloudinaryConfig();

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

  /** Extrai o public_id (com pasta) de uma URL do Cloudinary, ex:
   *  ".../upload/v123456/conectapet/abc123.png" -> "conectapet/abc123". */
  extractPublicId(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    return match ? match[1] : null;
  }

  async deleteFile(publicId: string): Promise<void> {
    this.ensureCloudinaryConfig();
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  }
}
