import { Table, Column, Model, DataType } from "sequelize-typescript";

export type IUserAttributes = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
};

@Table({
  tableName: "Users",
})
class User extends Model<IUserAttributes> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  password!: string;
}

export default User;
