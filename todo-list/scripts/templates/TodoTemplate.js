export const todoTemplate = `
<div class="wrapper">
<div class="container">
  <div class="todo__body">
    <section class="todo-view view">
      <form class="view-form form" name="addTodoItem">
        <div class="form-text text">
          <label class="text-title" for="taskDescription"
            >Task description:</label
          >
          <input
            class="text-field"
            type="text"
            id="taskDescription"
            name="taskDescription"
            required
          />
        </div>
        <footer class="form-date date">
          <label class="date-title" for="taskDate">Date:</label>
          <div class="date-field field">
            <input
              class="field__date"
              type="date"
              id="taskDate"
              name="taskDate"
              required
            />
            <button type="submit" class="field__add-btn">Add</button>
          </div>
        </footer>
      </form>
      <ul class="tasks"></ul>
    </section>
  </div>
</div>
</div>
`;
