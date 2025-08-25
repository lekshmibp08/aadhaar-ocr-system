import { NextFunction, Request, Response } from "express";
import { ExtractAadhaarDataUseCase } from "../../application/useCases/extractAadhaarDataUseCase";
import { OCRService } from "../../infrastructure/services/ocrService";
import fs from "fs/promises";

export class AadhaarController {
  static async extractData(req: Request, res: Response, next: NextFunction) {
    console.log("REACHED");
    
    let frontImage: string | undefined;
    let backImage: string | undefined;
    try {
      const files = req.files as {
        frontImage?: Express.Multer.File[];
        backImage?: Express.Multer.File[];
      };

      frontImage = files?.frontImage?.[0]?.path;
      backImage = files?.backImage?.[0]?.path;

      if (!frontImage || !backImage) {
        return res
          .status(400)
          .json({ message: "Both front and back images are required" });
      }

      const ocrService = new OCRService();
      const useCase = new ExtractAadhaarDataUseCase(ocrService);

      const result = await useCase.execute(frontImage, backImage);
      res.json(result);
    } catch (error: any) {
      next()
    } finally {
      console.log("frontImage: ", frontImage);
      if (frontImage) {
        fs.unlink(frontImage).catch(() => {});
      }
      if (backImage) {
        fs.unlink(backImage).catch(() => {});
      }
    }
  }
}
