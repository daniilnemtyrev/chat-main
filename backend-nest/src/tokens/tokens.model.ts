import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface TokenCreationOptions {
  userId: string;
  refreshToken: string;
}

@Table({ tableName: 'tokens' })
export class Token extends Model<Token, TokenCreationOptions> {
  @Column({
    type: DataType.INTEGER
  })
  userId: number;

  @Column({ type: DataType.STRING})
  refreshToken: string;
}
