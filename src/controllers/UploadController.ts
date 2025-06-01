import { Request, Response } from 'express';
import fs from 'fs';

export class UploadController {

  async uploadCSV(req: Request, res: Response): Promise<void> {
    
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        return;
      }

      const { path: filePath, originalname } = req.file;
      const result = await this.transactionService.processCSVFile(filePath, originalname);  

      try {
        // Limpar o arquivo após o processamento
        fs.unlinkSync(filePath);
      } catch (unlinkError) {
        console.error('Erro ao remover arquivo temporário:', unlinkError);
      }

      res.status(200).json({
        message: 'Arquivo processado com sucesso',
        validTransactionsCount: result.validCount,
        invalidTransactions: result.invalidTransactions
      });
      
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      
      // Tenta limpar o arquivo em caso de erro também
      if (req.file?.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Erro ao remover arquivo temporário:', unlinkError);
        }
      }
      
      res.status(500).json({ error: 'Erro ao processar arquivo.' });
    }
  }
}
