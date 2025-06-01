import express from 'express';
import 'reflect-metadata';
import uploadRoutes from './routes/uploadRoutes';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configurando rotas
app.use('/api-move', uploadRoutes);


// Inicialização do servidor
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
