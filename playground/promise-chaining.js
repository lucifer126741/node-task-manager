require("../src/db/mongoose");
const User = require("../src/models/user");
User.findByIdAndUpdate("65a26f1294b5bae844adebc3", { age: 22 })
  .then((user) => {
    console.log(user);
    return User.countDocuments({ age: 22 });
  })
  .then((cnt) => {
    console.log(cnt);
  })
  .catch((e) => {
    console.log(e);
  });
