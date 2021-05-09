const section = document.getElementById('input-fields');
const input = document.querySelectorAll('.input-container input');
let id = 0;




section.addEventListener('keypress', (event) => {
	if (event.code === 'Enter' && event.target.type === 'text') {
		id++;
		
		const command = event.target.value;
		event.target.value = '';

		const newInputField = document.createElement('label');
		newInputField.classList.add('input-container');
		
		const span = document.createElement('span');
		span.setAttribute('id', `text-input-label-${id}`);
		span.innerText = 'root> ';

		const previousInput = document.createElement('span');
		previousInput.setAttribute('id', `text-input-${id}`);
		previousInput.innerText = command.toString();

		newInputField.appendChild(span);
		newInputField.appendChild(previousInput);
 
		document.getElementById('previous-input-fields').appendChild(newInputField);
	}
});

section.addEventListener('input', (event) => {
	if (event.target.type === 'text') {
		document.getElementById('text-input-label-0')?.classList.remove('blink-animation');  
		console.log(event.target.value.toString());
	}
});

