// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

let taskTitleEl = $('#task-title');
let taskDateEl = $('#task-due-date');
let taskTextEl = $('#task-text');

function displayTime() {
    const rightNow = dayjs().format('MMM DD, YYYY [at] hh:mm:ss a');
    timeDisplayEl.text(rightNow);
}

// Using Date.now() to generate a unique ID.
function generateTaskId() {
 return (Date.now())
}

// Todo: create a function to create a task card
function createTaskCard(title, date, task) {
    const cardColumnEl = $('<div>');
    cardColumnEl.addClass('col-12 col-sm-4 col-md-3 mb-3');

    const cardEl = $('<div>');
    cardEl.addClass('card h-100');
    cardEl.attr('task-id', task.id)
    cardEl.appendTo(cardColumnEl);

    const cardTitle = $('<h5>').addClass('card-title').text(title);
    cardTitle.appendTo(cardEl);

    const cardBodyEl = $('<div>');
    cardBodyEl.addClass('card-body');
    cardBodyEl.appendTo(cardEl);

    const cardDueDate = $('<p>').addClass('card-date').text(date);
    cardDueDate.appendTo(cardBodyEl);  
    
    const cardTask = $('<p>').addClass('card-task').text(task);
    cardTask.appendTo(cardBodyEl);

    const deleteBtnEl = $('<button>');
    deleteBtnEl.addClass('btn btn-danger btn-sm').text('Remove Task');
    deleteBtnEl.on('click', handleDeleteTask);
    deleteBtnEl.appendTo(cardEl);

    return cardColumnEl;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const taskTitle = taskTitleEl.val();
    const taskDate = taskDateEl.val();
    const taskText = taskTextEl.val();

    if (!taskTitle || !taskDate || !taskText) {
        console.log('You need to fill out the task details!');
        return;
    } 

    const taskId = generateTaskId();

    const task = {
        id: taskId,
        title: taskTitle,
        dueDate: taskDate, 
        description: taskText
    };

    const taskCard = createTaskCard(task);

    $('#todo-cards').append(taskCard);
    
    taskList.push(task);


    taskTitleEl.val('');
    taskDateEl.val('');
    taskTextEl.val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){


}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
