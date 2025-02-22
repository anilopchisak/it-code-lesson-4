const doc = document;
// modal window (open/close)
let modal = doc.getElementById("modal");
let modalContent = doc.getElementById('modal-content');
// modal form 
let taskNameInput = doc.getElementById('modal-task-name');
let dateInput = doc.getElementById('date-input');
let statusSelect = doc.getElementById('select-status');
let descInput = doc.getElementById('modal-task-desc');
let createBtn = doc.getElementById('create');
// main page - content
let taskSection = doc.getElementById('task-section');
// main page - manage tasks
let addNewTaskBtn = doc.getElementById('add-new-task');

let data = JSON.parse(localStorage.getItem("data")) || [];
let editIndex = null; // id блока редактируемого задания 

const findIndex = (index = editIndex) => {
    data.findIndex((task) => {
        if (task) {
            task.id === index;
        }
        else return false;
    });
};

const updateLocalStorage = () => localStorage.setItem("data", JSON.stringify(data));

// modal open
let openModal = () => {
    modal.style.display = 'flex';
}

addNewTaskBtn.addEventListener('click', () => {
    openModal();
    taskNameInput.focus();
});

// modal close
let closeModal = () => {
    modal.style.display = 'none';
    editIndex = null;
}

modalContent.addEventListener('click', (event) => {
    event.stopPropagation();
});

modal.addEventListener('click', () => {
    closeModal();
});

// modal form - create task
let createTask = (index) => {
    const taskData = data[index];

    const div = doc.createElement('div');
    div.classList.add('card-wrapper');
    div.id = `task-${taskData.id}`;

    div.innerHTML = `
        <div class="task-manage-status">
            <div class="task-status ${taskData.status === 'urgent' ? 'red' : 'green'}">
                <i id="is-urgent-icon" class="fi fi-ss-bullet"></i>
                <p id="is-urgent-text">${taskData.status}</p>
            </div>
            <div class="task-manage">
                <i onClick='editTask(${taskData.id})' id="edit" class="fi fi-rr-pencil"></i>
                <i onClick='deleteTask(${taskData.id})' id="delete" class="fi fi-rr-trash"></i>
            </div>
        </div>
        <h2 class="task-name title">${taskData.name}</h2>
        <p class="task-date">${taskData.date}</p>
        <p class="task-desc">${taskData.description}</p>
    `;
    return div;
}

let resetForm = () => {
    taskNameInput.value = '';
    dateInput.value = '';
    statusSelect.value = 'non-urgent';
    descInput.value = '';
}

let addTask = (index) => {
    const task = createTask(index);
    taskSection.append(task);
}

let acceptData = () => {
    data.push({
        id: data.length,
        name: taskNameInput.value.trim(),
        date: dateInput.value,
        status: statusSelect.value,
        description: descInput.value.trim(),
    });
    updateLocalStorage();
    return data.length - 1;
}

let updateData = () => {
    const index = findIndex(editIndex);
    const task = data[index];
    if (index !== -1) {
        task.name = taskNameInput.value.trim();
        task.date = dateInput.value;
        task.status = statusSelect.value;
        task.description = descInput.value.trim();
    }
    updateLocalStorage();
    loadLocalStorage();
}

createBtn.addEventListener('click', () => {
    if (taskNameInput.value.trim() === '') {
        alert('fill the task name!');
    }
    else {
        if (editIndex === null) {
            const index = acceptData();
            addTask(index);
        }
        else updateData();
        closeModal();
        resetForm();
    }
});

// modal - edit task
let fillForm = () => {
    const id = findIndex();
    const taskData = data[id];
    taskNameInput.value = taskData.name;
    dateInput.value = taskData.date;
    statusSelect.value = taskData.status;
    descInput.value = taskData.description;
    openModal();
}

let editTask = (index) => {
    editIndex = index;
    fillForm();
}

// delete task
let deleteTaskHandler = (index) => {
    const id = findIndex(index);
    data[id] = null; 
    localStorage.setItem("data", JSON.stringify(data));
    doc.getElementById(`task-${index}`).remove();
}

let deleteTask = (index) => {
    const isConfirm = confirm('Are you sure you want to delete the task?');
    if (isConfirm) deleteTaskHandler(index);
}

// load all the tasks in storage
let loadLocalStorage = () => {
    taskSection.innerHTML = '';
    data.forEach((task, index) => {
        if (task)
            addTask(index);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    loadLocalStorage();
});
