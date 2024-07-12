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
    cardComment.text(task.comment);
    cardDate.text(task.date);
    deleteBtn.text('delete');

    
    
    // all classes for proper card styling(use variable at end to specify the color)
    //check for date to add color to delete button and card background
    const date = task.date;
    if(dayjs().isAfter(dayjs(date))&&task.category!='d'){
        taskCard.addClass('card bg-danger text-white my-2');
        deleteBtn.addClass('border-white');
    }
    if(dayjs(date).diff(dayjs(),'day') <=7 &&task.category!='d'){
        taskCard.addClass('card bg-warning text-white my-2');
    }else{
        taskCard.addClass('card bg-light my-2')
    }
    taskCard.addClass('task-card');
    cardHeader.addClass('card-header');
    cardBody.addClass('card-body');
    cardComment.addClass('card-text');
    cardDate.addClass('card-text');
    deleteBtn.addClass('btn btn-danger');

    //add id to card
    taskCard.attr("id",task.id);


    taskCard.draggable({
        stack: ".task-card",
        connectToSortable: ".connectedSortable"
    });



    //bring in lists to append cards to
    const todoList = $('#todo-cards');
    const inProgressList = $('#in-progress-cards');
    const doneList = $('#done-cards');

    //check which list and add to list
    if(task.category == 't'){
        todoList.append(taskCard);
    }
    if(task.category == 'i'){
        inProgressList.append(taskCard);
    }
    if(task.category == 'd'){
        doneList.append(taskCard);
    }
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    //pull section where lists will go
    const toDoList = $('#todo-cards');
    const inProgressList = $('#in-progress-cards');
    const doneList = $('#done-cards');

    //help with selecting and allow cards to move around
    toDoList.addClass('connectedSortable h-100');
    inProgressList.addClass('connectedSortable h-100');
    doneList.addClass('connectedSortable h-100');

    
    //loop through array to create card()
    for(const taskId of nextId){
        const taskItem = taskList.find((element)=> element.id == taskId);
        createTaskCard(taskItem);
    }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    
    const taskTitle = $('#taskTitle').val();
    const date = dayjs($('#datepicker').val()).format('MM/DD/YYYY');
    const comment = $('#comment-input').val();

    //input validation -> ceck fields are not empty
    if(!(taskTitle == '') && !(date == 'Invalid Date') && !(comment == '')){
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
        //close modal
        $('#formModal').modal('hide');

    }else{
        const modalFooter = $('#errorMsg');
        modalFooter.html('');
        if(taskTitle == ''){
            modalFooter.append('Task Title is empty');
            modalFooter.append('<br>')
        }
        if(date == 'Invalid Date'){
            modalFooter.append('Date is empty');
            modalFooter.append('<br>')
        }
        if(comment == ''){
            modalFooter.append('Comment is empty');
        }
    }
    
    
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

    //get task id,index of element in nextId and item from task List
    const cardId = $(event.target).parent().parent().attr("id");
    const index = nextId.indexOf(cardId);
    const taskItem = taskList.find((element)=> element.id == cardId);

    //remove from global array
    taskList.splice(taskList.indexOf(taskItem),1);
    nextId.splice(index,1);

    //save the arrays just in case user refreshes
    localStorage.setItem('tasks',JSON.stringify(taskList));
    localStorage.setItem('nextId',JSON.stringify(nextId));

    //remove from ui
    $(event.target).parent().parent().remove();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    console.log(ui.item.attr('class'));
    //get array of items for every sortable list
    const combineArr = $('#todo-cards').sortable("toArray").concat($('#in-progress-cards').sortable("toArray"),$('#done-cards').sortable("toArray"));

    
    //get moved item
    const taskItem = taskList.find((element)=> element.id == ui.item.attr('id'));
    const itemIndex = taskList.indexOf(taskItem);
    const date = taskItem.date
    //change category
    if(event.target.id =='todo-cards' && taskItem.category !== 't'){
        if(dayjs().isAfter(dayjs(date)) || dayjs(date).diff(dayjs(),'day') <=7){
            ui.item.children().removeClass('bg-light');
            ui.item.addClass('text-white');
        }
        taskItem.category = 't';

    }else if(event.target.id =='in-progress-cards' && taskItem.category !== 'i'){
        if(dayjs().isAfter(dayjs(date)) || dayjs(date).diff(dayjs(),'day') <=7){
            ui.item.children().removeClass('bg-light');
            ui.item.addClass('text-white');
        }
        taskItem.category = 'i';
    }else if(event.target.id =='done-cards' && taskItem.category !== 'd'){
        
        taskItem.category = 'd';
        ui.item.children().addClass('bg-light');
        ui.item.removeClass('text-white');
    }


    //update task item in array
    taskList[itemIndex] = taskItem;

    //rupdate gloabl array

    nextId = combineArr;

    //save changes to array
    localStorage.setItem('tasks',JSON.stringify(taskList));
    localStorage.setItem('nextId',JSON.stringify(combineArr));

}





// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    //check if our localStorage pull was null
    if(taskList == null){
        taskList = [];
    }
    if(nextId == null){
        nextId = [];
    }

    
    //render the existing tasks
    renderTaskList();

    //set date box
    $( "#datepicker" ).datepicker();


    //add dragable funtionality and order save
    $("#todo-cards,#in-progress-cards,#done-cards").sortable({
        dropOnEmpty: true,
        connectWith:".connectedSortable",
        update:handleDrop

    });

    //handel delete
    const dltArea = $('.swim-lanes');
    dltArea.on('click','.btn-danger',handleDeleteTask);

    //bring in modal div and add save button fuctionality
    const taskModal = $('#formModal');
    taskModal.on('click','.btnSubmit',handleAddTask);

});

