// global variables
const form = document.querySelector('form');

const getTaskName = () => {
  const taskNameInput = document.getElementById('taskName');
  const taskName = taskNameInput.value.toLowerCase();
  return taskName;
};

const getAssignedTo = () => {
  const assignedToInput = document.getElementById('assignedTo');
  const assignedTo = assignedToInput.value.toLowerCase();
  return assignedTo;
};

const getDueDate = () => {
  const dueDateInput = document.getElementById('dueDate');
  const dueDate = dueDateInput.value;
  console.log('Due Date:', dueDate);
  return dueDate;
};

const getTaskDescription = () => {
  const taskDescriptionInput = document.getElementById('taskDescription');
  const taskDescription = taskDescriptionInput.value;
  return taskDescription;
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
});

/**
 * represents a task manager
 */
class TaskManager {
  /**
   * initializes a table containing the tasks and the current id
   * @param{number} currentId - the id that keeps track of the current task
   */
  constructor(currentId) {
    this._tasks = [];
    this._currentId = currentId;
  }
  /**
   * returns the table containg the tasks
   * @return{array}
   */
  get task() {
    return this._tasks;
  }
  /**
   * returns the current id
   * @return{number}
   */
  get currentId() {
    return this._currentId;
  }
  /**
   * adds a task to the table containg the tasks
   * @param{object} task
   */
  addTask(task) {
    this._task.push(task);
    this._currentId++;
  }
}

taskManager = new TaskManager();
