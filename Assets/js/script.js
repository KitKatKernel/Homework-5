// Retrieve tasks from localStorage, or creating it if it doesn't already exist.
let taskList = JSON.parse(localStorage.getItem("tasks"));
if (!taskList) {
    taskList = [];
}

const taskTitleEl = $('#task-title');
const taskDateEl = $('#task-due-date');
const taskTextEl = $('#task-text');

function displayTime() {
    const rightNow = dayjs().format('MMM DD, YYYY [at] hh:mm:ss a');
    timeDisplayEl.text(rightNow);
}

// Using Date.now() to generate a unique ID.
function generateTaskId() {
    return Date.now();
}

// Create's function to create a task card
function createTaskCard(task) {
    const cardColumnEl = $('<div>');
    cardColumnEl.addClass('col-12 col-sm-4 col-md-3 mb-3');

    const cardEl = $('<div>');
    cardEl.addClass('card h-100');
    cardEl.attr('data-task-id', task.id);
    cardEl.appendTo(cardColumnEl);

    const cardTitle = $('<h5>').addClass('card-title').text(task.title);
    cardTitle.appendTo(cardEl);

    const cardBodyEl = $('<div>');
    cardBodyEl.addClass('card-body');
    cardBodyEl.appendTo(cardEl);

    const cardDueDate = $('<p>').addClass('card-date').text('Due: ' + task.dueDate);
    cardDueDate.appendTo(cardBodyEl);  
    
    const cardTask = $('<p>').addClass('card-task').text(task.description); 
    cardTask.appendTo(cardBodyEl);

    // Creates a delete button at the bottom of the task that's red.
    const deleteBtnEl = $('<button>');
    deleteBtnEl.addClass('btn btn-danger btn-sm').text('Remove Task');
    deleteBtnEl.on('click', handleDeleteTask);
    deleteBtnEl.appendTo(cardEl);

    // Sets the card background color based on due date, white for 2+ days, yellow for due today, red for past due
    if (task.dueDate && task.status !== 'complete') {
       const now = dayjs();
       const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

       if (now.isSame(taskDueDate, 'day')) {
        cardEl.addClass('bg-warning text-black');
       } else if (now.isAfter(taskDueDate)) {
        cardEl.addClass('bg-danger text-white');
        deleteBtnEl.addClass('border-light');
       }
    }

    // Make the card draggable
    cardEl.draggable({
        revert: "invalid",
        helper: function() {
            return $(this).clone().css({
                width: $(this).width(),
                height: $(this).height(),
                opacity: 0.5
            });
        },
        start: function(event, ui) {
            $(this).css("opacity", "0.5");
        },
        stop: function(event, ui) {
            $(this).css("opacity", "1");
        }
    });

    return cardColumnEl;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    if (taskList.length > 0) {
        for (let i = 0; i < taskList.length; i++){
            const taskCard = createTaskCard(taskList[i]);
        
            if (taskList[i].status === 'to-do') {
                $('#todo-cards').append(taskCard);
            } else if (taskList[i].status === 'in-progress') {
                $('#in-progress-cards').append(taskCard);
            } else if (taskList[i].status === 'done') {
                $('#done-cards').append(taskCard);
            }
        }
    }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
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
        description: taskText,
        status: 'to-do',
    };

    const taskCard = createTaskCard(task);

    $('#todo-cards').append(taskCard);
    
    taskList.push(task);

    const taskListString = JSON.stringify(taskList);
    localStorage.setItem('tasks', taskListString);

    taskTitleEl.val('');
    taskDateEl.val('');
    taskTextEl.val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    event.preventDefault();
    const taskCardEl = $(this).closest('.card');
    const taskId = taskCardEl.attr('data-task-id');
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == taskId) {
            taskList.splice(i, 1);
            break;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(taskList));

    taskCardEl.remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskCardEl = $(ui.helper);
    const taskId = taskCardEl.attr('data-task-id');
    const newStatus = $(this).attr('id').split('-')[0]; // Extracts 'to-do', 'in-progress', or 'done'

    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == taskId) {
            taskList[i].status = newStatus;
            break;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(taskList));

    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $('#task-form').on('submit', handleAddTask);
    renderTaskList();

    // Make lanes droppable
    $('#to-do').droppable({
        accept: ".card",
        drop: handleDrop
    });

    $('#in-progress').droppable({
        accept: ".card",
        drop: handleDrop
    });

    $('#done').droppable({
        accept: ".card",
        drop: handleDrop
    });

    // Initialize the date picker for the due date field
    $('#task-due-date').datepicker({
        changeMonth: true,
        changeYear: true
    });
});
