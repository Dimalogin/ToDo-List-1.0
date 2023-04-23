import { todoTemplate } from "./templates/TodoTemplate.js";
import { TodoModel } from "./TodoModel.js";

export class TodoView {
  #eventListeners = {
    handleEvent: (event) => {
      if (event.currentTarget === this.#form) {
        console.log("form");
        this.#onAddTask(event);
      } else if (event.currentTarget === this.#list) {
        const target = event.target;

        const taskID = Number(target.closest(".task").dataset.taskID);
        if (target.closest(".task-toggle")) {
          this.#onToggleTask(taskID);
        }

        if (target.closest(".task-delete")) {
          this.#onDeleteTask(taskID);
        }
      }
    },
  };

  #form = null;
  #list = null;
  #model = null;

  render(parentElement) {
    this.#initModel();
    this.#initTemplate(parentElement);
    this.#bindListeners();

    return () => {
      this.#unbindListeners();
      this.#destroyModel();
      this.#destroyTemplate(parentElement);
    };
  }

  #initTemplate(parentElement) {
    const todoMainTemplate = document.createElement("template");
    todoMainTemplate.innerHTML = todoTemplate;
    const fullView = todoMainTemplate.content.cloneNode(true);

    this.#form = fullView.querySelector("form");
    this.#list = fullView.querySelector("ul");

    this.#model.initList(this.#list);

    parentElement.innerHTML = "";
    parentElement.appendChild(fullView);
  }

  #destroyTemplate(parentElement) {
    parentElement.innerHTML = "";
    this.#form = null;
    this.#list = null;
  }

  #initModel() {
    this.#model = new TodoModel();
    this.#model.getAll();
  }

  #destroyModel() {
    this.#model.destroy();
    this.#model = null;
  }

  #onAddTask(event) {
    event.preventDefault();

    const data = new FormData(this.#form);

    this.#model.add({
      completed: false,
      description: data.get("taskDescription"),
      date: new Date(data.get("taskDate")),
    });

    this.#form.reset();
  }

  #onToggleTask(taskID) {
    this.#model.toggle(taskID);
  }

  #onDeleteTask(taskID) {
    this.#model.remove(taskID);
  }

  #bindListeners() {
    this.#form.addEventListener("submit", this.#eventListeners);

    this.#list.addEventListener("click", this.#eventListeners);
  }

  #unbindListeners() {
    this.#form.removeEventListener("submit", this.#eventListeners);
    this.#model.removeEventListener("list", this.#eventListeners);
    this.#list.removeEventListener("click", this.#eventListeners);
  }
}
