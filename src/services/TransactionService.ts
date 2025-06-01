import fs from 'fs';
import csv from 'csv-parser';
import { AppDataSource } from '../config/database';
import { Transaction } from '../models/Transaction';
import { ProcessedFile } from '../models/ProcessedFile';
import { InvalidTransaction, InvalidReason } from '../models/InvalidTransaction';
import { TransactionData } from '../types/TransactionData';

export class TransactionService {
    private readonly transactionRepository = AppDataSource.getRepository(Transaction);
    private readonly processedFileRepository = AppDataSource.getRepository(ProcessedFile);
    private readonly invalidTransactionRepository = AppDataSource.getRepository(InvalidTransaction);

    async processCSVFile(filePath: string, originalFilename: string): Promise<{
        validCount: number,
        invalidTransactions: Array<{ from: string, to: string, amount: number, reason: string }>
    }> {
        return new Promise((resolve, reject) => {
            const transactions: TransactionData[] = [];
            const invalidTransactions: Array<{ data: TransactionData, reason: InvalidReason }> = [];
            
            fs.createReadStream(filePath)
                .pipe(csv({ separator: ';' }))
                .on('data', (row) => {
                    const transaction: TransactionData = {
                        from: row.from,
                        to: row.to,
                        amount: Number(row.amount)
                    };

                    // Validar valor negativo
                    if (transaction.amount < 0) {
                        invalidTransactions.push({
                            data: transaction,
                            reason: InvalidReason.NEGATIVE_AMOUNT
                        });
                        return;
                    }

                    // Verificar duplicadas dentro do próprio arquivo
                    const isDuplicate = transactions.some(t => 
                        t.from === transaction.from && 
                        t.to === transaction.to && 
                        t.amount === transaction.amount
                    );

                    if (isDuplicate) {
                        invalidTransactions.push({
                            data: transaction,
                            reason: InvalidReason.DUPLICATE_TRANSACTION
                        });
                        return;
                    }

                    transactions.push(transaction);
                })
                .on('end', async () => {
                    try {
                        // Criar registro do arquivo processado
                        const processedFile = new ProcessedFile();
                        processedFile.filename = originalFilename;
                        processedFile.validTransactionsCount = transactions.length;
                        const savedFile = await this.processedFileRepository.save(processedFile);

                        // Salvar transações válidas
                        for (const t of transactions) {
                            const transaction = new Transaction();
                            transaction.from = t.from;
                            transaction.to = t.to;
                            transaction.amount = t.amount;
                            // Marcar como suspeita se o valor for superior a 50.000,00 reais (5.000.000 centavos)
                            transaction.suspicious = t.amount > 5000000;
                            
                            await this.transactionRepository.save(transaction);
                        }

                        // Salvar transações inválidas
                        for (const invalid of invalidTransactions) {
                            const invalidTransaction = new InvalidTransaction();
                            invalidTransaction.from = invalid.data.from;
                            invalidTransaction.to = invalid.data.to;
                            invalidTransaction.amount = invalid.data.amount;
                            invalidTransaction.reason = invalid.reason;
                            invalidTransaction.processedFile = savedFile;
                            
                            await this.invalidTransactionRepository.save(invalidTransaction);
                        }

                        resolve({
                            validCount: transactions.length,
                            invalidTransactions: invalidTransactions.map(inv => ({
                                from: inv.data.from,
                                to: inv.data.to,
                                amount: inv.data.amount,
                                reason: inv.reason
                            }))
                        });
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }
}
