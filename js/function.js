//Author: Eduardo Carranza

function TaskManager(){

  //private properties
  var personalId = 144;
  var domain = 'https://altcademy-to-do-list-api.herokuapp.com/';
  var message = null;
  var taskCounter = 0;

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

  var addTaskToboard = function(id, description){
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
                    '<button type="button" class="btn btn-primary">Remove</button>' +
                  '</div>' +

                  '<div class="col-6 d-flex align-items-center">' +
                    '<div class="form-check form-switch">' +
                      '<input class="form-check-input" type="checkbox" />' +
                      '<label class="form-check-label">Completed</label>' +
                    '</div>' +
                  '</div>' +

                '</div>' +

              '</div>' +

            '</div>',
      completed: false
    }).appendTo(board);
  }

  var updateTaskCounterOfBoard = function(){
    $('#task-amount span').text(taskCounter);
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
          console.log(response);
          emptyTaskBoard();
          for(var i = 0; i< response.tasks.length; i++)
          {
            addTaskToboard(response.tasks[i].id, response.tasks[i].content);
          }

        }
        updateTaskCounterOfBoard();
        return true;
      },
      error: function(request, textStatus, errorMessage){
        message = errorMessage;
        return false;
      } 
    });
  }

  this.createNewTask = function(description){
    console.log('Making http Request');
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

        addTaskToboard(response.task.id, response.task.content);
        taskCounter ++;
        updateTaskCounterOfBoard();
        return true;
        
      },
      error: function(request, textStatus, errorMessage){
        message = errorMessage;
        return false;
      }
    });
  }
  

}


$(document).ready(function(){

  //creates task manager
  var taskManager = new TaskManager();
  taskManager.getTasks();

  $('#create-task').submit(function(event){
    event.preventDefault();
    if(!taskManager.createNewTask($('#task-input').val()))
      console.log(taskManager.getErrorMessage());
    
    $('#task-input').val('');

  });

});