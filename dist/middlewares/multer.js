import multer from "multer";
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename(req, file, cb) {
//     const id = uuid();
//     //to get the extension of the file
//     const extName = file.originalname.split(".").pop();
//     const fileName = `${id}.${extName}`;
//     cb(null, fileName);
//   },
// });
// export const singleUpload = multer({ storage }).single("photo");
export const singleUpload = multer().single("photo");
export const multiUpload = multer().array("photos", 5);
