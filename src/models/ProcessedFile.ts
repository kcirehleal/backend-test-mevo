import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { InvalidTransaction } from './InvalidTransaction';

@Entity('processed_files')
export class ProcessedFile {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    filename: string;

    @Column({ name: 'valid_transactions_count', default: 0 })
    validTransactionsCount: number;

    @OneToMany(() => InvalidTransaction, invalidTransaction => invalidTransaction.processedFile)
    invalidTransactions: InvalidTransaction[];

    @CreateDateColumn({ name: 'processed_at' })
    processedAt: Date;
}
