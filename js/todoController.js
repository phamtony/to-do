todoController = function() {

  // callback error consolelog
  function errorLog(errorCode, errorMessage) {
    console.log(errorCode + ':' + errorMessage);
  }

  // Clear the inputs of todo form
  function clearInputs() {
    $(todoPage).find('form').fromObject({});
  }    

  function loadLocationButtion () {
    var loc = $('tbody.list td div.none.locationName p');
    var taskLoc = $('tbody.list tr td.localSearch');
    for (var i = 0; i < loc.length; i++) {
      var locString = loc[i].innerHTML;
      if(locString.indexOf("http:") > -1 || locString == "") {
      } else {
        var input = document.createElement('button');
        var inside = document.createElement('span');
        var textnode = document.createTextNode(" Location");
        inside.appendChild(textnode);
        inside.classList.add('glyphicon');
        inside.classList.add('glyphicon-road');
        inside.setAttribute('aria-hidden', 'true')
        input.appendChild(inside);
        input.classList.add('locationBtn');
        input.classList.add('btn');
        input.classList.add('btn-default');
        input.classList.add('btn-xs');
        input.setAttribute('type', 'button')    
        input.setAttribute('value', locString)
        taskLoc[i].appendChild(input);        
      }
    }
  }  

  function renderTable() {
    $.each($(todoPage).find('#tblTodos tbody tr'), function(idx, row) {
      var due = Date.parse($(row).find('[datetime]').text());
      if(due.compareTo(Date.today()) < 0) {
        $(row).addClass("overdueTodo");
      } else if (due.compareTo((2).days().fromNow()) <= 0) {
        $(row).addClass("warnTodo");
      }
      $(todoPage).find('tbody tr:even').addClass('even'); //To make each line alternate colors
    });
  }  

  var todoPage;
  var initialised = false;

  return {

    init: function(page, call) {
      if (initialised) {
        call();
      } else {
        todoPage = page;
        webStorage.init(function() {
          webStorage.initList('todo', function() {
            call();
          }, errorLog)
        }, errorLog);

        $(todoPage).find('tbody tr:even').addClass('even'); //To make each line alternate colors

        $('.locationField').hide();
        $('#location').click(function() {
          $('.locationField')[this.checked ? "show" : "hide"]();
        });           

        //bootstrap data date picker option
        $(function() {
          var currentDate = new Date();
          $('.datepicker').datepicker({
              format: "mm/dd/yyyy",
              autoclose: true,
              clearBtn: true,
              todayHighlight: true
          });
          $(".datepicker").datepicker("setDate", currentDate);
        });       

        // This is when the input form shows up when pressing add
        $(todoPage).find('#btnAdd').click(function(evt) {
          evt.preventDefault();
          $(todoPage).find('#create').removeClass('none');
        }); 

        //Clear button
        $(todoPage).find('#clear').click(function(evt) {
          evt.preventDefault();
          clearInputs();
        });

        //Done task 
        $(todoPage).find('#tblTodos tbody').on('click', '.completeRow', function(evt) {           
          webStorage.searchID('todo', $(evt.target).data().taskId, function(todo) {
            if (todo.complete == true) {
              todo.complete = false;
              webStorage.add('todo', todo, function() {
                todoController.loadList();
              }, errorLog);              
            } else {
              todo.complete = true;
              webStorage.add('todo', todo, function() {
                todoController.loadList();
              },errorLog);
            }
          }, errorLog);
        });

        // this is an X that clears the overlay
        $(todoPage).find('.btn-close').click(function(evt) {
          evt.preventDefault();
          $(todoPage).find('#create').addClass('none');
          todoController.loadList();
          clearInputs();
        });  

        //clear overlay on click overlay
        $(document).click(function(e) {
          if ($(e.target).is('#create')) {
            $('#create').addClass('none');
            todoController.loadList();
            clearInputs();            
          }
          if ($(e.target).is('.note')) {
            $('.note').addClass('none');  
            todoController.loadList();
            clearInputs();            
          }
          if ($(e.target).is('#maps')) {
            $('#maps').addClass('none');  
            todoController.loadList();
            clearInputs();            
          }          
        });              

        //lightbox show misc information
        $(todoPage).find('#tblTodos tbody').on('click', '.link', function(evt) {
          webStorage.searchID('todo', $(evt.target).data().taskId, function(todo) {
            var id = "#" + todo.id.toString()
            $(todoPage).find(id).removeClass('none');
          })
        });

        //undo Complete task
        $(todoPage).find('#tblTodos tbody').on('click', '.undoRow', function(evt) {
          webStorage.searchID('todo', $(evt.target).data().taskId, function(todo) {
            todo.complete = false;
            webStorage.add('todo', todo, function() {
              todoController.loadList();
            }, errorLog);
          }, errorLog);
        });        

        //Edit TODO
        $(todoPage).find('#tblTodos tbody').on('click', '.editRow', function(evt) {
          $(todoPage).find('#create').removeClass('none');
          webStorage.searchID('todo', $(evt.target).data().taskId, function(todo) {
            $(todoPage).find('form').fromObject(todo);
          }, errorLog);
        });  

        //Remove todo
        $(todoPage).find('#tblTodos tbody').on('click', '.deleteRow', function(evt) { 
          webStorage.remove('todo', $(evt.target).data().taskId, function() {
            $(evt.target).parents('tr').remove(); 
          }, errorLog);
          todoController.loadList();
        });  

        //location search
        $(todoPage).find('#tblTodos tbody').on('click', '.locationBtn', function(evt) { 
          evt.preventDefault();
          var mapInput = $('#pac-input');
          mapInput.val(evt.currentTarget.value);
          $(todoPage).find('#maps').removeClass('none');
        });

        //cancel changes
        $(todoPage).find('#cancel').click(function(evt) {
          evt.preventDefault();
          $(todoPage).find('#tblTodos tbody').empty();
          todoController.loadList();
          clearInputs();      
          $(todoPage).find('#create').addClass('none');
        });

        // clear local storage
        $(todoPage).find('#btnClear').click(function(evt) {
          evt.preventDefault();
          var answer = confirm("Clear your todo list?")
          if (answer) {
            window.localStorage.clear();
            $(todoPage).find('#tblTodos tbody').empty();
            todoController.loadList();
            clearInputs();          
          }
        })

        //Add todo, also has validation .valid()
        $(todoPage).find('#save').click(function(evt) {
          evt.preventDefault();
          if ($(todoPage).find('form').valid()) {
            var todo = $(todoPage).find('form').toObject();
            webStorage.add('todo', todo, function() {
              $(todoPage).find('#tblTodos tbody').empty();
              todoController.loadList();
              clearInputs();
              $(todoPage).find('#create').addClass('none');
            }, errorLog);
          }
        });   

        initialised = true;                                     

      }
    },

    //when app begins, it beings with this function, what this function does is takes the data
    //after adding or completing the task and displaying it.
    loadList: function() {
      $(todoPage).find('#tblTodos tbody').empty(); //empty's the list out to refresh
      webStorage.searchAll('todo', function(todos) {
        todos.sort(function(o1, o2) {
          return Date.parse(o1.requiredBy).compareTo(Date.parse(o2.requiredBy));
        });
        $.each(todos, function(index, todo) {
          if (!todo.complete) {
            todo.complete = false;
          }
          $('#todoRow').tmpl(todo).appendTo($(todoPage).find('#tblTodos tbody'));
          renderTable();
        });
      }, errorLog);
      var a = $('table#tblTodos.table tbody.list tr.even').toArray();
      if(a.length > 0) {
        loadLocationButtion();
      }
    }


  }
}();