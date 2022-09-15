import {
  Table,
  Model,
  Column,
  DataType,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Choices } from "./choices";

export interface IVotesAttributes {
  id?: number;
  choiceId?: number; // number of days comparing to created_at
  createdBy: string;
}

@Table({
  tableName: "votes",
})
class Votes extends Model<IVotesAttributes> {
  @AutoIncrement
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
  createdBy!: string;

  @ForeignKey(() => Choices)
  @Column
  choiceId!: number;

  @BelongsTo(() => Choices)
  choices!: Choices;
}

export default Votes;
