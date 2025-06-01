import express from 'express';
import 'reflect-metadata';
import { initializeDatabase } from './config/database';
import uploadRoutes from './routes/uploadRoutes';
import errorHandler from './middlewares/errorHandler';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configurando rotas
app.use('/api-move', uploadRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicialização do servidor
const startServer = async () => {
  try {
    const dbConnected = await initializeDatabase();
    
    if (!dbConnected) {
      console.warn('Aviso: Banco de dados não está conectado. A API irá iniciar, mas algumas funcionalidades podem não funcionar corretamente.');
    }
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
