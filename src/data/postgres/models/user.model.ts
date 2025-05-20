import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 150,
  })
  name: string;

  @Column('varchar', {
    length: 255,
    unique: true,
    nullable: true,
  })
  email: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  password: string;

  @Column('enum', {
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column('boolean', {
    default: false,
  })
  status: boolean;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created_at: Date;
}
