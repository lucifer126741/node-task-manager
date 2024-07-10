require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("65a2727e82fb2a1416261a1b").then((res) => {
//   console.log(res);
//   return Task.countDocuments({ completed: false })
//     .then((cnt) => {
//       console.log(cnt);
//     })
//     .catch((e) => {
//       console.log(e);
//     });
// });

const deleteTaskById = async (id) => {
  const _id = await Task.findByIdAndDelete(id);
  const cnt = await Task.countDocuments({ completed: false });
  return cnt;
};

deleteTaskById("65a2727e82fb2a1416261a1b")
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log("Error", e);
  });
