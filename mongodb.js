const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "task-manager";
const mongoClient = new MongoClient(connectionURL);
async function run() {
  const db = mongoClient.db(dbName);
  // const users = await db.collection("users").findOne({ name: "Lucifer" });
  // const users = await db.collection("users").find({ age: 27 });
  // console.log(users);
  // const tasks = await db.collection("tasks").countDocuments();
  // console.log("Total tasks", tasks);
  // const unFinishedTasks = await db
  //   .collection("tasks")
  //   .find({ completed: false })
  //   .toArray();
  // console.log("Unfinished tasks", unFinishedTasks);

  // const updatedPromise = await db
  //   .collection("tasks")
  //   .updateMany({ completed: false }, { $set: { completed: true } })
  //   .then((result) => {
  //     console.log("Updated documents");
  //   })
  //   .catch((error) => {
  //     console.log("Couldn't update documents");
  //   });

  // const deletedPromise = await db
  //   .collection("users")
  //   .deleteMany({ age: 27 })
  //   .then((result) => {
  //     console.log("Deleted document(s) successfully", result);
  //   })
  //   .catch((error) => {
  //     console.log("Unable to delete documents", error);
  //   });

  const deletedTaskPromise = await db
    .collection("tasks")
    .deleteOne({ description: "Finish Node.js chapter" })
    .then((result) => {
      console.log("Deleted task successfully", result);
    })
    .catch((error) => {
      console.log("Unable to delete document", error);
    });
}
run();

// db.collection("users")
//   .insertOne({ _id: objectId, name: "Lelouch", age: 27 })
//   .then((res) => console.log("Successfully inserted the document", res))
//   .catch((error) => {
//     console.log("Unable to insert a document");
//   });
// const tasks = [
//   { description: "Apply for license", completed: false },
//   { description: "Apply vaseline", completed: false },
//   { description: "Complete Node.js chapter", completed: true },
// ];
// db.collection("tasks")
//   .insertMany(tasks)
//   .then((res) => {
//     console.log("Succesfully inserted documents", res);
//   })
//   .catch((error) => {
//     console.log("Unable to insert documents");
//   });
