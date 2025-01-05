import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BlockType } from "../enums/block-type.enum";

@Entity()
export class Block {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('enum')
    type: BlockType

    @Column()
    position: number

    @CreateDateColumn({
        type: 'timestamp with time zone',
    })
    createdAt?: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
    })
    updatedAt?: Date;
}