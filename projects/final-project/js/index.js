// global variables
const form = document.querySelector('form');

// create a task manager object
const taskManager = new TaskManager();

const getTaskName = () => {
	const taskNameInput = document.getElementById('task-name');
	const taskName = taskNameInput.value.toLowerCase();
	taskNameInput.value = '';
	return taskName;
};

const getAssignedTo = () => {
	const assignedToInput = document.getElementById('assigned-to');
	const assignedTo = assignedToInput.value.toLowerCase();
	assignedToInput.value = '';
	return assignedTo;
};

const getDueDate = () => {
	const dueDateInput = document.getElementById('due-date');
	const dueDate = dueDateInput.value;
	dueDateInput.value = '';
	return dueDate;
};

const getTaskDescription = () => {
	const taskDescriptionInput = document.getElementById('task-description');
	const taskDescription = taskDescriptionInput.value;
	taskDescriptionInput.value = '';
	return taskDescription;
};

form.addEventListener('submit', (event) => {
	event.preventDefault();
	
	// console.log('hello');
  
	const name = getTaskName();
	const assignedTo = getAssignedTo();
	const dueDate = getDueDate();
	const description = getTaskDescription();

	console.log(name);
	console.log(assignedTo);
	console.log(dueDate);
	console.log(description);

	taskManager.addTask(name, description, assignedTo, dueDate);
  
	console.log(taskManager.tasks);

	taskManager.render();

});

