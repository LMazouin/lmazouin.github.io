/**
 * represents a task manager
 */
class TaskManager {
	/**
   * initializes a table containing the tasks and the current id
   * @param{number} currentId - the id that keeps track of the current task
   */
	constructor(currentId = 0) {
		this._tasks = [];
		this._currentId = currentId;
	}
	/**
   * returns the table containing the tasks
   * @return{array}
   */
	get tasks() {
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
	addTask(name, description, assignedTo, dueDate, status = 'TODO') {
		const task = {
			name, 
			description, 
			assignedTo, 
			dueDate, 
			status
		};
		this._tasks.push(task);
		this._currentId++;
	}
	addTaskHTML(name, description, assignedTo, dueDate, status) {
		const html = `<article class="card shadow mb-3">
                    <header class="card-header d-flex justify-content-between">
                      <figure class="status-symbol"></figure>
                      <div>
                        <h3 class="card-title">${name}</h3>
                        <h4 class="card-subtitle text-muted h5">Assigned to ${assignedTo}</h4>      
                      </div>
                      <div id="card-buttons">
                        <div class="dropdown">
                          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownStatusButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Status
                          </button>
                          <div class="dropdown-menu" aria-labelledby="dropdownStatusButton">
                            <a class="dropdown-item" href="#">todo</a>
                            <a class="dropdown-item" href="#">in progress</a>
                            <a class="dropdown-item" href="#">review</a>
                            <a class="dropdown-item" href="#">done</a>
                          </div>
                          <a href="#" class="pencil-icon ml-3"></a>
                          <a href="#" class="trash-icon ml-3"></a>
                        </div>
                      </div>
                    </header>
                    <main class="card-body pb-0">
                      <p class="card-text">${description}</p>
                      <div class="d-flex justify-content-between">
                        <p class="card-text">Due Date: ${dueDate}</p>
                        <p class="card-text">Status: <strong class="text-danger">${status}</strong></p>
                      </div>
                    </main>
                  </article>`;
		return html;
	}
	render() {
		const tasksListHTML = [];
		this._tasks.forEach((task) => {
			const {name, description, assignedTo, dueDate, status} = task; 
			const date = new Date(dueDate);
			const formattedDate = date.toDateString();
			const taskHTML = this.addTaskHTML(name, description, assignedTo, formattedDate, status);
			tasksListHTML.push(taskHTML);
		});
		const tasksHTML = tasksListHTML.join('\n');
		document.getElementById('task-cards-section').innerHTML = tasksHTML;
	}
}
