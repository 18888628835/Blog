import { config } from "./config";
import { Sequelize, DataTypes, Op } from "sequelize";

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host, //主机
    dialect: "mysql", //别名可以写'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一
    timezone: "+08:00", //东八时区
  }
);

// 生成一个表
const User = sequelize.define(
  "User",
  {
    // 在这里定义模型属性
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
      // allowNull 默认为 true
    },
    age: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    // 这是其他模型参数
  }
);

(async () => {
  await User.sync({ force: true });
  // 创建一个新用户
  const jane: any = await User.create({ firstName: "Jane", lastName: "Doe" });
  console.log("Jane's auto-generated ID:", jane.id); //1
  const jim: any = await User.create(
    { firstName: "Jim", lastName: "Green" },
    { fields: ["firstName"] }
  );
  console.log(jim.lastName); //undefined
  const Anne: any = await User.build({ firstName: "Anne", lastName: "Smith" });
  await Anne.save({ fields: ["firstName"] });
  console.log(Anne.lastName); // Smith
  console.log(jim.lastName);
  //读取整张表
  const users: any = await User.findAll();
  console.log(JSON.stringify(users));
  const s = await User.findAll({ attributes: ["firstName"] });
  console.log(JSON.stringify(s));
  //[{"firstName":"Jane"},{"firstName":"Jim"},{"firstName":"Anne"}]
  const d = await User.findAll({
    attributes: ["firstName", ["lastName", "lsName"]],
  });
  console.log(JSON.stringify(d));
  //[{"firstName":"Jane","lsName":"Doe"},{"firstName":"Jim","lsName":null},{"firstName":"Anne","lsName":null}]

  const g = await User.findAll({
    group: ["firstName", "lastName"],
    attributes: [
      "lastName",
      "firstName",
      [Sequelize.fn("COUNT", Sequelize.col("age")), "n_age"],
    ],
  });
  console.log(JSON.stringify(g));
  //[{"lastName":null,"firstName":"Anne","n_age":1},{"lastName":"Doe","firstName":"Jane","n_age":1},{"lastName":null,"firstName":"Jim","n_age":1}]
  const h: any = await User.findAll({
    attributes: {
      exclude: ["age"],
    },
  });
  console.log(JSON.stringify(h));
  const j: any = await User.findAll({
    where: {
      firstName: "jim",
    },
  });
  console.log(JSON.stringify(j));
  //[{"id":2,"firstName":"Jim","lastName":null,"age":0,"createdAt":"2021-07-17T07:57:06.000Z","updatedAt":"2021-07-17T07:57:06.000Z"}]
  const j2: any = await User.findAll({
    where: {
      firstName: {
        [Op.eq]: "jim",
      },
    },
  });
  console.log(JSON.stringify(j2));
  //[{"id":2,"firstName":"Jim","lastName":null,"age":0,"createdAt":"2021-07-17T07:57:06.000Z","updatedAt":"2021-07-17T07:57:06.000Z"}]
  const j3 = await User.findAll({
    where: { firstName: "Jane", lastName: "Doe" },
  });
  console.log(JSON.stringify(j3));
  //Executing (default): SELECT `id`, `firstName`, `lastName`, `age`, `createdAt`, `updatedAt` FROM `Users` AS `User` WHERE `User`.`firstName` = 'Jane' AND `User`.`lastName` = 'Doe';
  const j4 = await User.findAll({
    where: { [Op.and]: [{ firstName: "Jane" }, { lastName: "Doe" }] },
  });
  console.log(JSON.stringify(j4));
  const j5 = await User.findAll({
    where: { [Op.or]: [{ firstName: "Jane" }, { firstName: "jim" }] },
  });
  console.log(JSON.stringify(j5));

  const j6 = await User.findAll({
    where: { firstName: ["Jane", "jim"] },
  });
  console.log(JSON.stringify(j6));
  // [{"id":1,"firstName":"Jane","lastName":"Doe","age":0,"createdAt":"2021-07-17T08:25:48.000Z","updatedAt":"2021-07-17T08:25:48.000Z"},{"id":2,"firstName":"Jim","lastName":null,"age":0,"createdAt":"2021-07-17T08:25:48.000Z","updatedAt":"2021-07-17T08:25:48.000Z"}]
  const j7 = await User.update(
    { firstName: "jim2" },
    {
      where: {
        firstName: "jim",
      },
    }
  );
  console.log(JSON.stringify(j7));
  // 删除所有名为 "Jane" 的人
  await User.destroy({
    where: {
      lastName: null,
    },
  });
  // 截断表格
  await User.destroy({
    truncate: true,
  });
  await User.bulkCreate([
    { firstName: "qiu", lastName: "yanxi" },
    { firstName: "qiu", lastName: "yanxi" },
    { firstName: "qiu", lastName: "yanxi" },
  ]);
})();
