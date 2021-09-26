//Author: Eduardo Carranza

const DisplayStatusOfBoard = {
  All: 'All tasks',
  Active: 'Active Tasks',
  Completed: 'Completed Tasks'
}

function TaskManager(){

  //private properties
  var personalId = 144;
  var domain = 'https://altcademy-to-do-list-api.herokuapp.com/';
  var message = null;
  var taskCounter = 0;
  var completedTaskCounter = 0;
  var displayState = DisplayStatusOfBoard.All;

  //private methods

  var emptyTaskBoard = function(){
    var board = $('#task-board');
    if(board.children().length > 0)
    {
      board.children().each(function(){
        $(this).remove();
      });
    }
  }

  var addTaskToboard = function(id, description, taskStatus){
    var board = $('#task-board');
    $('<div></div>' , {
      "Class": 'col-3 my-1',
      html: '<div class="card">' +

              '<div class="card-header">' +
               description +
              '</div>' + 

              '<div class="card-body">' + 

                '<div class="row">' +

                  '<div class="col-6">' +
                    '<button type="button" class="btn btn-primary remove-task">Remove</button>' +
                  '</div>' +

                  '<div class="col-6 d-flex align-items-center">' +
                    '<div class="form-check form-switch">' +
                      '<input class="form-check-input" type="checkbox" ' + ((taskStatus)?'checked' : '') +'/>' +
                      '<label class="form-check-label">Completed</label>' +
                    '</div>' +
                  '</div>' +

                '</div>' +

              '</div>' +

            '</div>',
      taskId: id
    }).appendTo(board);
  }

  var updateTaskCounterOfBoard = function(counter){
    $('#task-amount span').text(counter);
  }


  //public methods
  this.getErrorMessage = function(){return message;}

  this.getTasks = function(){
    $.ajax({
      type: 'GET',
      url: domain + 'tasks/?api_key=' + personalId,
      dataType: 'json',
      success: function(response, textStatus){

        taskCounter = response.tasks.length;
        if(response.tasks.length > 0)
        {
          emptyTaskBoard();
          for(var i = 0; i< response.tasks.length; i++)
          {
            addTaskToboard(response.tasks[i].id, response.tasks[i].content, response.tasks[i].completed);
          }

        }
        updateTaskCounterOfBoard(taskCounter);
        return true;
      },
      error: function(request, textStatus, errorMessage){
        message = errorMessage;
        return false;
      } 
    });
  }

  this.createNewTask = function(description){
    $.ajax({
      type: 'POST',
      url: domain + 'tasks/?api_key=' + personalId,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task:{
          content: description
        }
      }),
      success: function(response, textStatus){

        addTaskToboard(response.task.id, response.task.content, false);
        taskCounter ++;
        updateTaskCounterOfBoard(taskCounter);
        return true;
        
      },
      error: function(request, textStatus, errorMessage){
        message = errorMessage;
        return false;
      }
    });
  }

  this.deleteTask = function(id , element){
    $.ajax({
      type: 'DELETE',
      url: domain + 'tasks/' + id + '?api_key=' + personalId,
      success: function(response, textStatus){
        taskCounter --;
        if($(element).parents('.col-3').find('.form-check-input').attr('checked') != undefined)
          completedTaskCounter --;

        switch(displayState)
        {
          case DisplayStatusOfBoard.Completed :
            updateTaskCounterOfBoard(completedTaskCounter);
            break;
          case DisplayStatusOfBoard.Active :
            updateTaskCounterOfBoard(taskCounter - completedTaskCounter);
            break;
          default :
            updateTaskCounterOfBoard(taskCounter);
            break;
        }
        
        $(element).parents('.col-3').remove();
        return true;
      },
      error: function(request, textStatus, errorMessage){
        message = errorMessage;
        return false;
      }
    });
  }

  this.markTaskAsComplete = function(id, element){
    $.ajax({
      type: 'PUT',
      url: domain + 'tasks/' + id + '/mark_complete?api_key=' + personalId,
      success: function(response, textStatus){
        
        $(element).attr('checked' , 'true');
        completedTaskCounter ++;
        return true;

      },
      error: function(request, testStatus, errorMessage){

        $(element).removeAttr('checked');
        message = errorMessage;
        return false;

      }
    });
  }

  this.markTaskAsActive = function(id, element){
    $.ajax({
      type: 'PUT',
      url: domain + 'tasks/' + id + '/mark_active?api_key=' + personalId,
      success: function(response, textStatus){
        $(element).removeAttr('checked');
        completedTaskCounter --;
        return true;
      },
      error: function(request, testStatus, errorMessage){

        $(element).attr('checked' , 'true');
        message = errorMessage;
        return false;

      }
    });
  }

  this.ShowCompletedTasks = function(){
    $.ajax({
      type: 'GET',
      url: domain + 'tasks/?api_key=' + personalId,
      dataType: 'json',
      success: function(response, textStatus){
        if(response.tasks.length > 0)
        {
          emptyTaskBoard();
          for(var i =0; i< response.tasks.length; i++)
          {
            if(response.tasks[i].completed == true)
            {
              addTaskToboard(response.tasks[i].id, response.tasks[i].content, response.tasks[i].completed);
            }
          }
        }
        updateTaskCounterOfBoard(completedTaskCounter);
        return true;
      },
      error: function(request, textStatus, errorMessage){
        message = errorMessage;
        return false;
      }
    });
  }

  this.ShowActiveTasks = function(){
    $.ajax({
      type: 'GET',
      url: domain + 'tasks/?api_key=' + personalId,
      dataType: 'json',
      success: function(response, textStatus){
        if(response.tasks.length > 0)
        {
          emptyTaskBoard();
          for(var i =0; i < response.tasks.length; i++)
          {
            if(!response.tasks[i].completed)
            {
              addTaskToboard(response.tasks[i].id, response.tasks[i].content, response.tasks[i].completed);
            }
          }
        }
        updateTaskCounterOfBoard(taskCounter - completedTaskCounter);
        return true;
      },
      error: function(request, textStatus, errorMessage){
        message = errorMessage;
        return false;
      }
    });
  }
  
  this.updateDisplayStateOfBoard = function(state){
    displayState = state;
  }

}


$(document).ready(function(){

  //creates task manager
  var taskManager = new TaskManager();
  taskManager.getTasks();
  $('#all-button').addClass('bg-success');
  $('#all-button').attr('disabled', 'true');

  $('#create-task').submit(function(event){
    event.preventDefault();
    if(!taskManager.createNewTask($('#task-input').val()))
      console.log(taskManager.getErrorMessage());
    
    $('#task-input').val('');

  });

  $(document).on('click', 'button.remove-task', function(){
    
    var id = $(this).parents('.col-3').attr('taskId');
    taskManager.deleteTask(id , this);
  
  });

  $(document).on('click' , 'input.form-check-input', function(){
    var id = $(this).parents('.col-3').attr('taskId');
    if($(this).attr('checked') == undefined)
    {
      taskManager.markTaskAsComplete(id , this);
    }  
    else
    {
      taskManager.markTaskAsActive(id, this);
    }
      
  });

  $('#completed-button').click(function(){
    taskManager.updateDisplayStateOfBoard(DisplayStatusOfBoard.Completed);
    $(this).addClass('bg-success');
    $(this).siblings().each(function(index, element){
      $(element).removeClass('bg-success');
    });
    taskManager.ShowCompletedTasks();
    $('#all-button').removeAttr('disabled');
  });

  $('#active-button').click(function(){
    taskManager.updateDisplayStateOfBoard(DisplayStatusOfBoard.Active);
    $(this).addClass('bg-success');
    $(this).siblings().each(function(index, element){
      $(element).removeClass('bg-success');
    });
    taskManager.ShowActiveTasks();
  });

  $('#all-button').click(function(){
    taskManager.updateDisplayStateOfBoard(DisplayStatusOfBoard.All);
    $(this).addClass('bg-success');
    $(this).siblings().each(function(index, element){
      $(element).removeClass('bg-success');
    });
    taskManager.getTasks();
  });

});