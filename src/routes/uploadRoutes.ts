import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { UploadController } from '../controllers/UploadController';

const router = Router();
const uploadController = new UploadController();

// Definindo diretorio armazenamento de arquivos provisorios
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  }
});

// Filtro de arquivos para aceitar apenas CSVs
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Apenas arquivos CSV são permitidos!'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter
});

// Rota para upload de arquivo CSV
router.post('/upload', upload.single('file'), uploadController.uploadCSV.bind(uploadController));

export default router;
