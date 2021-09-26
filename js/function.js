//Author: Eduardo Carranza

function TaskManager(){

  //private properties
  var personalId = 144;
  var domain = 'https://altcademy-to-do-list-api.herokuapp.com/';
  var message = null;

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
    }).apendTo(board);
  }


  //public methods
  this.getTasks = function(){
    $.ajax({
      type: 'GET',
      url: domain + 'tasks/?api_key=' + personalId,
      dataType: 'JSON',
      success: function(response, textStatus){
        if(textStatus == 200)
        {
          if(response.tasks.length > 0)
          {
            emptyTaskBoard();
            response.tasks.foreach(function(taskObject){
              addTaskToboard(taskObject.id, taskObject.content);
            });

          }
          return true;
        }
        return false;
      },
      error: function(request, textStatus, errorMessage){
        message = errorMessage;
        return false;
      } 
    });
  }
  

}


$(document).ready(function(){

});