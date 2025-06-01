import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  console.error('Error:', err.message);
  
  if (err.message.includes('Apenas arquivos CSV são permitidos!')) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: 'Erro interno do servidor' });
};

export default errorHandler;
