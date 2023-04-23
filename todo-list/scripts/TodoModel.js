import { TodoDataBase } from "./TodoDataBase.js";
import { todoGroupTemplate } from "./templates/TodoGroupTemplate.js";
import { todoItemTemplate } from "./templates/TodoItemTemplate.js";

const groupTemplate = document.createElement("template");
groupTemplate.innerHTML = todoGroupTemplate;
const itemTemplate = document.createElement("template");
itemTemplate.innerHTML = todoItemTemplate;

export class TodoModel {
  #db = new TodoDataBase();
  #tasks = [];
  #list;

  getAll() {
    this.#db.getAllTasks().then((tasks) => {
      this.#tasks = tasks;
      this.#onListUpdate(this.#tasks);
    });
  }

  initList(elementList) {
    this.#list = elementList;
  }

  add(data) {
    this.#db.addTask(data).then((task) => {
      this.#tasks = [...this.#tasks, task];
      this.#onListUpdate(this.#tasks);
    });
  }

  remove(taskID) {
    this.#db.removeTask(taskID).then(() => {
      this.#tasks = this.#tasks.filter((task) => task.id !== taskID);
      this.#onListUpdate(this.#tasks);
    });
  }

  toggle(taskID) {
    this.#db.toggleTask(taskID).then((updatedTask) => {
      this.#tasks = this.#tasks.map((task) => {
        return task.id === taskID ? updatedTask : task;
      });
      this.#onListUpdate(this.#tasks);
    });
  }

  destroy() {
    this.#db.closeDB();
  }

  #onListUpdate(list) {
    const groupedList = this.#listToGroups(list);
    const fragment = document.createDocumentFragment();

    for (const [timestamp, items] of groupedList.entries()) {
      const el = groupTemplate.content.cloneNode(true);
      const header = el.querySelector("header");
      const ul = el.querySelector("ul");
      const title = new Date(timestamp).toLocaleDateString("ru", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "short",
      });
      header.textContent = title;
      ul.appendChild(
        items.reduce((fragment, item) => {
          const el = itemTemplate.content.cloneNode(true);
          const li = el.querySelector("li");
          const div = el.querySelector("div");

          div.textContent = item.description;
          li.dataset.taskID = item.id.toString();
          li.classList.toggle("completed", item.completed);
          fragment.appendChild(el);

          return fragment;
        }, document.createDocumentFragment())
      );

      fragment.appendChild(el);
    }

    this.#list.innerHTML = "";
    this.#list.appendChild(fragment);
  }

  #listToGroups(list) {
    return list
      .sort((a, b) => {
        const diff = a.date.getTime() - b.date.getTime();

        if (!diff) {
          return a.id - b.id;
        }

        return diff;
      })
      .reduce((map, item) => {
        const timestamp = item.date.getTime();

        if (!map.has(timestamp)) {
          map.set(timestamp, []);
        }

        map.get(timestamp).push(item);

        return map;
      }, new Map());
  }
}