let modal = document.getElementById("modal");
let addNewTask = document.getElementById('add-new-task');
let create = document.getElementById('create');

addNewTask.addEventListener('click', () => {
    modal.style.display = 'flex';
});

let closeModal = () => {
    modal.style.display = 'none';
}

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

let createTask = () => {
    
}
