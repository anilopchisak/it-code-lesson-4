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
const idList = {}; // id list to check the collisions

// MODAL
// modal open
const openModal = () => {
    modal.style.display = 'flex';
}

addNewTaskBtn.addEventListener('click', () => {
    openModal();
    taskNameInput.focus();
});

// modal close
const closeModal = () => {
    modal.style.display = 'none';
}

modalContent.addEventListener('click', (event) => {
    event.stopPropagation();
});

modal.addEventListener('click', () => {
    closeModal();
    setForm();
});

// GENERAL
const getElemById = (id) => doc.getElementById(id);
const getObject = id => data.find(obj => obj.id === id); // get object from data array
const getDataIndex = id => data.findIndex(obj => obj.id === id); // get index of object in data array
const isObjectNull = task => Object.keys(task).length === 0;
const updateLocalStorage = () => localStorage.setItem("data", JSON.stringify(data));
const throwError = (error) => {
    throw new Error(error)
};

// unique id
const generateUniqueId = () => {
    const timestamp = Date.now() % 10000;
    const random = Math.floor(Math.random() * 10000);
    const uniqueId = `${timestamp}-${random}`;
    return uniqueId;
}
const getUniqueId = () => {
    let id = generateUniqueId();
    while (Object.hasOwn(idList, id)) {
        id = generateUniqueId();
    }
    idList[id] = true;
    return id;
}

// reset form or fill task data for edit
const setForm = (task = {}) => {
    const isTaskNull = isObjectNull(task);
    taskNameInput.value = isTaskNull ? '' : task.name;
    dateInput.value = isTaskNull ? '' : task.date;
    statusSelect.value = isTaskNull ? 'non-urgent' : task.status;
    descInput.value = isTaskNull ? '' : task.description;
}

// set task data from inputs
const setData = (task = {}) => {
    const isTaskNull = isObjectNull(task);
    task.id = isTaskNull ? getUniqueId() : task.id;
    task.name = taskNameInput.value.trim();
    task.date = dateInput.value;
    task.status = statusSelect.value;
    task.description = descInput.value.trim();
    return task;
}

// CRUD
// create task
const taskLayout = (task) => {
    const div = doc.createElement('div');
    div.classList.add('card-wrapper');
    div.id = `task-${task.id}`;
    div.innerHTML = `
        <div class="task-manage-status">
            <div class="task-status ${task.status === 'urgent' ? 'red' : 'green'}">
                <i id="is-urgent-icon" class="fi fi-ss-bullet"></i>
                <p id="is-urgent-text">${task.status}</p>
            </div>
            <div class="task-manage">
                <i onClick='editTask(${task.id})' id="edit" class="fi fi-rr-pencil"></i>
                <i onClick='deleteTask(${task.id})' id="delete" class="fi fi-rr-trash"></i>
            </div>
        </div>
        <h2 class="task-name title">${task.name}</h2>
        <p class="task-date">${task.date}</p>
        <p class="task-desc">${task.description}</p>
    `;
    return div;
}

const addTask = (task) => {
    const layout = taskLayout(task);
    taskSection.append(layout);
}

const acceptData = () => {
    const newTask = setData(newTask);
    data.push(newTask);
    updateLocalStorage();
    return newTask;
}

const createTask = () => {
    const task = acceptData();
    addTask(task);
    closeModal();
}

createBtn.addEventListener('click', () => {
    if (taskNameInput.value.trim() === '') {
        alert('fill the task name!');
    }
    else {
        createTask();
    }
})

// edit task
const editTaskHandler = (task) => {
    
}

const editTask = (id) => {
    const task = getObject(id);
    setForm(task);
    openModal();
    editTaskHandler(task);
}

// delete task
const deleteTaskHandler = (task) => {
    const taskIndex = getDataIndex(task.id);
    data.splice(taskIndex, 1);
    updateLocalStorage();
    getElemById(`task-${task.id}`).remove();
}

const deleteTask = (id) => {
    const isConfirm = confirm('Are you sure you want to delete the task?');
    if (isConfirm) {
        const task = getObject(id);
        if (isObjectNull(task)) throwError('object not found');
        deleteTaskHandler(task);
    };
}

// load all the tasks in storage
const loadLocalStorage = () => {
    data.forEach((task, index) => {
        if (task) addTask(index);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    loadLocalStorage();
});
