import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import Poll from "./polls";
import Votes from "./votes";

export interface IChoicesAttributes {
  id?: number;
  title: string;
  pollId?: number;
}

@Table({
  tableName: "choices",
  timestamps: false,
})
export class Choices extends Model<IChoicesAttributes> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @ForeignKey(() => Poll)
  @Column
  pollId!: number;

  @BelongsTo(() => Poll)
  poll!: Poll;

  @HasMany(() => Votes)
  votes!: Votes[];
}

export default Choices;
