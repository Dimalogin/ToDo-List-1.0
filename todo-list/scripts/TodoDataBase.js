import {
  openDb,
  readFromDB,
  addIntoDB,
  updateInDB,
  removeFromDB,
  getAllFromDB,
} from "./datebase/baseIndexedDB.js";

export class TodoDataBase {
  #dbName = "TaskStorage";
  #storageName = "tasks";

  #migrations = [
    (db) => {
      db.createObjectStore(this.#storageName, {
        keyPath: "id",
        autoIncrement: true,
      });
    },
  ];

  #dbPromise = openDb(this.#dbName, this.#migrations);

  getAllTasks() {
    return this.#dbPromise.then((db) => getAllFromDB(db, this.#storageName));
  }

  addTask(task) {
    return this.#dbPromise.then((db) =>
      addIntoDB(db, this.#storageName, task).then((id) => {
        return { ...task, id };
      })
    );
  }

  removeTask(taskId) {
    return this.#dbPromise.then((db) =>
      removeFromDB(db, this.#storageName, taskId)
    );
  }

  toggleTask(taskId) {
    return this.#dbPromise.then(async (db) => {
      const task = await readFromDB(db, this.#storageName, taskId);
      const updateTask = { ...task, completed: !task.completed };
      await updateInDB(db, this.#storageName, updateTask);
      return updateTask;
    });
  }

  closeDB() {
    this.#dbPromise.then((db) => db.close());
  }
}
