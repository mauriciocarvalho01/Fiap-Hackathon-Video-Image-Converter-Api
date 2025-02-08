import multer from "multer";

const upload = multer();

export const uploadSingle = (fileName: string) => upload.single(fileName)
