// Retrieve tasks from localStorage, or create it if it doesn't already exist
let taskList = JSON.parse(localStorage.getItem("tasks"));
if (!taskList) {
    taskList = [];
}

const taskTitleEl = $('#task-title');
const taskDateEl = $('#task-due-date');
const taskTextEl = $('#task-text');

// Function to display the current time
function displayTime() {
    const rightNow = dayjs().format('MMM DD, YYYY [at] hh:mm:ss a');
    timeDisplayEl.text(rightNow);
}

// Function to generate a unique task ID using the current timestamp
function generateTaskId() {
    return Date.now();
}

// Function to create a task card element
function createTaskCard(task) {
    const cardColumnEl = $('<div>');
    cardColumnEl.addClass('col-12 col-sm-4 col-md-3 mb-3');

    // Create the card element
    const cardEl = $('<div>');
    cardEl.addClass('card h-100');
    cardEl.attr('data-task-id', task.id);
    cardEl.appendTo(cardColumnEl);

    // Add the task title to the card
    const cardTitle = $('<h5>').addClass('card-title').text(task.title);
    cardTitle.appendTo(cardEl);

    // Create the card body and append it to the card
    const cardBodyEl = $('<div>');
    cardBodyEl.addClass('card-body');
    cardBodyEl.appendTo(cardEl);

    // Adds the due date to the card
    const cardDueDate = $('<p>').addClass('card-date').text('Due: ' + task.dueDate);
    cardDueDate.appendTo(cardBodyEl);  
    
    // Adds the task description to the card
    const cardTask = $('<p>').addClass('card-task').text(task.description); 
    cardTask.appendTo(cardBodyEl);

    // Creates a delete button and append it to the card
    const deleteBtnEl = $('<button>');
    deleteBtnEl.addClass('btn btn-danger btn-sm').text('Remove Task');
    deleteBtnEl.on('click', handleDeleteTask);
    deleteBtnEl.appendTo(cardEl);

    // Sets task background color based on due date
    if (task.dueDate && task.status !== 'complete') {
       const now = dayjs();
       const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

       if (now.isSame(taskDueDate, 'day')) {
        cardEl.addClass('bg-warning text-black'); // Yellow for tasks due today
       } else if (now.isAfter(taskDueDate)) {
        cardEl.addClass('bg-danger text-white'); // Red for past due tasks
        deleteBtnEl.addClass('border-light'); // Light border for the delete button
       }
    }

    // Makes cards draggable
    cardEl.draggable({
        revert: "invalid",
        helper: function() {
            const clone = $(this).clone().css({
                opacity: 0.5
            }).addClass('ui-draggable-helper'); // Add a class for additional styling if needed
            return clone;
        },
        start: function(event, ui) {
            ui.helper.css("zIndex", 1000); // Ensure the clone is on top
        },
        stop: function(event, ui) {
            $(this).css("opacity", "1");
        }
    });

    return cardColumnEl;
}

// Function that renders task list and appends the cards to their appropriate columns
function renderTaskList() {
    if (taskList.length > 0) {
        for (let i = 0; i < taskList.length; i++){
            const taskCard = createTaskCard(taskList[i]);
        
            // Appends cards based on its status
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

// Handles adding a new task
function handleAddTask(event) {
    event.preventDefault();
    const taskTitle = taskTitleEl.val();
    const taskDate = taskDateEl.val();
    const taskText = taskTextEl.val();

    // Checks if all fields are filled out
    if (!taskTitle || !taskDate || !taskText) {
        console.log('You need to fill out the task details!');
        return;
    }

    // Creates a new task object
    const taskId = generateTaskId();

    const task = {
        id: taskId,
        title: taskTitle,
        dueDate: taskDate,
        description: taskText,
        status: 'to-do',
    };

    // Creates and appends the new task card
    const taskCard = createTaskCard(task);

    $('#todo-cards').append(taskCard);
    
    // Adds the task to task list and saves to localStorage
    taskList.push(task);

    const taskListString = JSON.stringify(taskList);
    localStorage.setItem('tasks', taskListString);

    // Clears the input fields
    taskTitleEl.val('');
    taskDateEl.val('');
    taskTextEl.val('');
}

// Handles deleting a task
function handleDeleteTask(event){
    event.preventDefault();
    const taskCardEl = $(this).closest('.card');
    const taskId = taskCardEl.attr('data-task-id');
    
    // Finds and removes the task from the task list
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == taskId) {
            taskList.splice(i, 1);
            break;
        }
    }

    // Updates localStorage
    localStorage.setItem('tasks', JSON.stringify(taskList));

    // Removes task card from DOM
    taskCardEl.remove();
}

// Handles dropping task into status lane
function handleDrop(event, ui) {
    const taskCardEl = $(ui.draggable);
    const taskId = taskCardEl.attr('data-task-id');
    // Extracts the exact ID ('to-do', 'in-progress', 'done')
    const newStatus = $(this).attr('id'); 

    // Updates the task's status
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == taskId) {
            // Update the status directly
            taskList[i].status = newStatus; 
            break;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(taskList));

    // Clears and re-renders task list
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();
    renderTaskList();
}

// On page load renders the task list, adds event listeners, makes lanes droppable, and makes the due date field a datepicker
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

    $('#task-due-date').datepicker({
        changeMonth: true,
        changeYear: true
    });
});
