import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  conversionRates: Record<string, number>;

  @Column({ type: 'timestamp' })
  lastUpdate: Date;
}
