import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ProcessedFile } from './ProcessedFile';

export enum InvalidReason {
    NEGATIVE_AMOUNT = 'NEGATIVE_AMOUNT',
    DUPLICATE_TRANSACTION = 'DUPLICATE_TRANSACTION'
}

@Entity('invalid_transactions')
export class InvalidTransaction {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'from_account', length: 20 })
    from: string;

    @Column({ name: 'to_account', length: 20 })
    to: string;

    @Column({ type: 'bigint' })
    amount: number;

    @Column({
        type: 'enum',
        enum: InvalidReason
    })
    reason: InvalidReason;

    @ManyToOne(() => ProcessedFile, processedFile => processedFile.invalidTransactions)
    processedFile: ProcessedFile;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
