import { AadhaarData } from "../entities/aadhaarData"; 

export interface IOCRRepository {
  extractTextFromImages(frontPath: string, backPath: string): Promise<AadhaarData>;
}
