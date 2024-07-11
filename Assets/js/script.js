// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

//bring in modal div

const taskModal = $('#formModal');

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let id = '';
    for (let i = 0; i < 15; i++) {
        id += String.fromCharCode(Math.floor(Math.random() * 77) + 34);
    }
    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    const taskTitle = $('#taskTitle').val();
    const date = dayjs($('#datepicker').val());
    const comment = $('#comment-input').val();
    const task = { title: taskTitle,
                    date: date,
                    comment:comment,
                    id: generateTaskId(),
                    category: "t"
                 };

    //push the task object to the current array for use in this session
    taskList.push(task);
    nextId.push(task.id);
    

    //save the arrays just in case user refreshes
    localStorage.setItem('tasks',JSON.stringify(taskList));
    localStorage.setItem('nextId',JSON.stringify(nextId));

    //add task card to the screen
    createTaskCard(task);
    
    
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}



//set date box
$( function() {
    $( "#datepicker" ).datepicker();
});


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    if(taskList == null){
        taskList = [];
    }
    if(nextId == null){
        nextId = [];
    }
    
    taskModal.on('click','.btnSubmit',handleAddTask);

});

