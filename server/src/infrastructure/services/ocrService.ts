import Tesseract from "tesseract.js";
import { AadhaarData } from "../../domain/entities/aadhaarData";
import { IOCRRepository } from "../../domain/repositories/IOCRRepository";

export class OCRService implements IOCRRepository {
  async extractTextFromImages(
    frontPath: string,
    backPath: string
  ): Promise<AadhaarData> {
    const langs = "eng";

    const extractText = async (path: string) => {
      const {
        data: { text },
      } = await Tesseract.recognize(path, langs);
      return this.cleanText(text);
    };

    // OCR each side separately
    const frontText = await extractText(frontPath);
    const backText = await extractText(backPath);

    // Extract fields from each side
    const name = this.extractName(frontText);
    const aadhaarNumber = frontText.match(/\d{4}\s\d{4}\s\d{4}/)?.[0];
    const dateOfBirth = frontText.match(/\d{2}\/\d{2}\/\d{4}/)?.[0];
    const gender = frontText.match(
      /(Male|Female|MALE|FEMALE|Transgender)/i
    )?.[0];
    const mobile = frontText.match(/(\d{10})/)?.[0];

    const address = this.extractAddress(backText);
    const guardianName = this.extractFatherName(backText);

    return {
      name,
      aadhaarNumber,
      dateOfBirth,
      gender,
      mobile,
      address,
      guardianName,
    };
  }

  private cleanText(text: string): string {
    // Collapse excess spaces and remove obvious noise characters
    return text
      .replace(/\s+/g, " ")
      .replace(/[|~_^`]+/g, "")
      .replace(/[^a-zA-Z0-9:/,.\-\s]/g, "")
      .replace(/www\.uidai\.gov\.in|helpuidai\.gov\.in/gi, "")
      .replace(/1800\s*300\s*1947|1947/gi, "")
      .replace(/Bengaluru.*?\d{3}\s*\d{3}/gi, "")
      .trim();
  }

  private extractName(text: string): string | undefined {
    const match = text.match(/([A-Za-z\s]{2,50})\s+DOB/i);
    if (match) {
      return match[1].replace(/^\s*[a-z]\s+/i, "").trim();
    }
    return undefined;
  }

  private extractFatherName(text: string): string | undefined {
    const match = text.match(/C\/O\s+([A-Za-z\s]+)/i);
    return match ? match[1].trim() : undefined;
  }

  private extractAddress(text: string): string | undefined {
    // Match from "C/O" up to pincode
    const addrRegex = /(C\/O[\s\S]*?Kerala\s*-\s*\d{6})/i;
    const match = text.match(addrRegex);

    if (match) {
      // Basic postprocessing to remove single-letters & stray tokens
      let address = match[0]
        .replace(/[\n\r]/g, " ")
        .replace(/C\s*\/\s*O/gi, "__CO__")
        .replace(/([,.;])\1+/g, "$1")
        .replace(/\b[A-Za-z]\b/g, "")
        .replace(/\s{2,}/g, " ")
        .replace(/(\s?[-,:]\s?)+/g, ", ")
        .replace(/,\s*,/g, ",")
        .replace(/[, ]+$/, "")
        .trim()
        .replace(/__CO__/g, "C/O");

      // Remove common noise words from OCR
      address = address.replace(/\b(at|ward|PED|Raia|Tas|Sd|ol|pa|Ky|oh|ah|ne|tu|fat|pe)\b/gi, "");
      // Remove any remaining sequences of 2-3 non-address words
      address = address.replace(/\b[a-z]{2,3}\b/gi, "");

      // Final clean up:
      return address.replace(/\s{2,}/g, " ").replace(/,\s*,/g, ",").trim();
    }
    // fallback: extract starting from PO if C/O not found
    const poMatch = text.match(/([A-Za-z0-9,\s\-\/]+PO[,A-Za-z0-9\s\-\/]+.*Kerala\s*-\s*\d{6})/i);
    if (poMatch) {
      let address = poMatch[0]
        .replace(/[\n\r]/g, " ")
        .replace(/\b([A-Za-z])\b/g, "")
        .replace(/\s{2,}/g, " ")
        .replace(/[, ]+$/, "")
        .trim();
      return address;
    }

    return undefined;
  }
}
