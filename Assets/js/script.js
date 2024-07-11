// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));



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
    //create card elements
    const taskCard = $('<div>');
    const cardHeader = $('<div>');
    const cardBody = $('<div>');
    const cardComment =$('<p>');
    const cardDate =$('<p>');
    const deleteBtn =$('<a>');

    //nest elements in proper order to form card
    taskCard.append(cardHeader);
    taskCard.append(cardBody);
    cardBody.append(cardComment);
    cardBody.append(cardDate);
    cardBody.append(deleteBtn);

    //add content to cards
    cardHeader.text(task.title);
    cardComment.text(tast.comment);
    cardDate.text(task.date.format('MM DD YYYY'));
    deleteBtn.text('delete');


    // check for date to add color to delete button and card background and add all classes for proper card styling



    //check the category and append to that list


}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    //pull section where lists will go
    const toDoList = $('#todo-cards');
    const inProgressList = $('#in-progress-cards');
    const doneList = $('#done-cards');

    //create the sortables
    const sortableToDo = $('<ul>');
    const sortableInProgress = $('<ul>');
    const sortableDone = $('<ul>');

    // add sortable functionality to lists
    sortableToDo.sortable();
    sortableInProgress.sortable();
    sortableDone.sortable();

    //add sortable lists to page
    toDoList.append(sortableToDo);
    inProgressList.append(sortableInProgress);
    doneList.append(sortableDone);

    //loop through array to create card()
    for(const task of taskList){
        createTaskCard(task);
    }
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
    //check if our localStorage pull was null
    if(taskList == null){
        taskList = [];
    }
    if(nextId == null){
        nextId = [];
    }

    //bring in modal div
    const taskModal = $('#formModal');
    



    renderTaskList();
    console.log(taskList);
    //save button
    taskModal.on('click','.btnSubmit',handleAddTask);

});

