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

class TaskManager() {
  constructor() {

  }

}
