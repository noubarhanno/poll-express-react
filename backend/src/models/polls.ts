import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
  AutoIncrement,
} from "sequelize-typescript";
import { Choices } from "./choices";
import Votes from "./votes";

export interface IPollAttributes {
  id?: number;
  title: string;
  expiration: Date; // number of days comparing to created_at
  createdBy: string;
  choices?: { title: string }[];
  votes?: { createdBy: string }[];
}

@Table({
  tableName: "poll",
})
class Poll extends Model<IPollAttributes> {
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
  title!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiration!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  createdBy!: string;

  @HasMany(() => Choices)
  choices!: Choices[];
}

export default Poll;
