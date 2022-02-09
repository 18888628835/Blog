import { config } from "./config";
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host, //主机
    dialect: "mysql", //别名可以写'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一
  }
);
/* //测试连接是否成功
(async () => {
  try {
    await sequelize.authenticate();
    console.log(" 连接成功.");
  } catch (error) {
    console.error("连接失败:");
  }
})(); */
// 生成一个表
const User = sequelize.define(
  "User",
  {
    // 在这里定义模型属性
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "qiu",
    },
    lastName: {
      type: DataTypes.STRING,
      defaultValue: "yanxi",
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
  ////增加数据
  //create 是 build 方法+save 方法的集合，
  const Jim = await User.create({ firstName: "Jim", lastName: "green" });
  const kitty = await User.create({ firstName: "hello", lastName: "kitty" });
  // console.log(kitty); 不要这样打印
  console.log(kitty.toJSON());
  //修改数据
  Jim.lastName = "red";
  //保存
  await Jim.save();
  kitty.firstName = "halo";
  //保存
  await kitty.save();
  await Jim.destroy();
  const Jim2 = await User.create({ firstName: "Jim", lastName: "green" });
  Jim2.firstName = "Jim2";
  console.log(Jim2.firstName); //Jim2 但是数据库中的数据没变，依然是Jim
  await Jim2.reload(); //但是我依然希望能得到数据库的数据而不是 Jim2，可以调用 reload方法
  console.log(Jim2.firstName); //Jim
  const qiu = await User.create({ firstName: "qiu" });
  qiu.firstName = "Qiu";
  console.log(qiu.lastName); //按照默认值生成的 yanxi
  qiu.lastName = "YanXi";
  await qiu.save({ fields: ["lastName"] });
  await qiu.reload();
  console.log(qiu.firstName); //qiu
  const yang = await User.create({ firstName: "yang" });
  console.log("yang.age", yang.age); //0
  const incrementResult = await yang.increment("age");
  console.log("yang.age", yang.age); //0
  console.log("incrementResult.age", incrementResult.age); //0
  await yang.reload();
  console.log("yang.age", yang.age); //1
  console.log("incrementResult.age", incrementResult.age); //1
})();
