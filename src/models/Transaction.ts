import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'from_account', length: 20 })
    from: string;

    @Column({ name: 'to_account', length: 20 })
    to: string;

    @Column({ type: 'bigint' })
    amount: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
