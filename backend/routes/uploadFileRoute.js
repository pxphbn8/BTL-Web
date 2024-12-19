
import express from 'express';
import {uploadfile, getAllUploadedFiles } from '../controllers/uploadFileController.js'; 
import upload from '../controllers/uploadFileController.js';
const Routes = express.Router();

// Endpoint thêm file
Routes.post('/uploadfile', upload.single('file') ,uploadfile);

// Endpoint lấy toàn bộ file
Routes.get('/getfiles', getAllUploadedFiles);

export default Routes;
