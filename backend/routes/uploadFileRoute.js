import express from 'express';
import { Allfile, uploadfile } from '../controllers/uploadFileController.js'; 

const Routes = express.Router();

// Endpoint thêm file
Routes.post('/uploadfile', uploadfile);
 
// Endpoint lấy tất cả file
Routes.get('/getupload', Allfile);

export default Routes;
