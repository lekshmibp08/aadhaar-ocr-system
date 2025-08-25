import { Router } from "express";
import { upload } from "../middlewares/upload"; 
import { AadhaarController } from "../controllers/aadhaarController";


const router = Router();

router.post(
  "/process",
  upload.fields([{ name: "frontImage", maxCount: 1 }, { name: "backImage", maxCount: 1 }]),
  AadhaarController.extractData
);

export default router;
