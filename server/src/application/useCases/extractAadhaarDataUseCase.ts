import { IOCRRepository } from "../../domain/repositories/IOCRRepository"; 
import { AadhaarData } from "../../domain/entities/aadhaarData";

export class ExtractAadhaarDataUseCase {
  constructor(private ocrRepository: IOCRRepository) {}

  async execute(frontPath: string, backPath: string): Promise<AadhaarData> {
    return await this.ocrRepository.extractTextFromImages(frontPath, backPath);
  }
}
