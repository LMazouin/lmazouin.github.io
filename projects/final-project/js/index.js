// moduleimport validator from 'validator';

// global variables
const form = document.querySelector('form');

const generalValidator = (str, type) => {
	if (type === 'name') {
		return validator.isAlpha(str);
	}
	if (type === 'text') {
		return validator.isAlphanumeric(str);
	}
	if (type === 'date') {
		return validator.isDate(str);
	}
	if (type === 'date-after') {
		return validator.isAfter(str);
	}
};

// function to export data from input fields
const getInputValues = (inputField) => {
	const input = {};
	input.content = inputField.value.toString();
	input.id = inputField.id;
	input.valid = generalValidator(input.content, inputField.dataset.type);
	return input;
};

// create a task manager object
const taskManager = new TaskManager();

const getTaskName = () => {
	const taskNameInput = document.getElementById('task-name');
	const taskName = taskNameInput.value;
	if (validator.isAlphanumeric(taskName)) {
		taskNameInput.value = '';
		return taskName;
	} else {
		return false;
	}
};

const getAssignedTo = () => {
	const assignedToInput = document.getElementById('assigned-to');
	const assignedTo = assignedToInput.value;
	if (validator.isAlpha(assignedTo)) {
		assignedToInput.value = '';
		return assignedTo;
	} else {
		return false;
	}
};

const getDueDate = () => {
	const dueDateInput = document.getElementById('due-date');
	const dueDate = dueDateInput.value;
	if (validator.isAfter(dueDate)) {
		dueDateInput.value = '';
		return dueDate;
	} else {
		return false;
	}
};

const getTaskDescription = () => {
	const taskDescriptionInput = document.getElementById('task-description');
	const taskDescription = taskDescriptionInput.value;
	if (validator.isAlphanumeric(taskDescription)) {
		taskDescription.value = '';
		return taskDescription;
	} else {
		return false;
	}
};

form.addEventListener('submit', (event) => {
	event.preventDefault();
	
	// console.log('hello');
    
	const inputList = [];
	document.querySelector('#popup-form input').forEach((input) => {
		inputList.push(input);
	});

	const name = inputList.find((input) => input.id === 'task-name');
	const assignedTo = inputList.find((input) => input.id === 'assigned-to');
	const dueDate = inputList.find((input) => input.id === 'due-date');
	const description = inputList.find((input) => input.id === 'task-description');

	console.log(name);
	console.log(assignedTo);
	console.log(dueDate);
	console.log(description);

	taskManager.addTask(name, description, assignedTo, dueDate);
  
	console.log(taskManager.tasks);

	taskManager.render();

});

