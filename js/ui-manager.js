var queueTable = document.getElementById('queue-table').getElementsByTagName('tbody')[0];
var workoutBox = document.getElementById('workout-box');
var queueActions = document.getElementById('queue-actions');

const removeGlyphHTML = '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"> </span>';
const playGlyphHTML = '<span class="glyphicon glyphicon-play" aria-hidden="true"> </span>';

queueActions.appendChild(startStopButton());

//will probably never use it
function workoutSelectHintDiv(){
    var div = document.createElement('div');
    div.role = "alert";
    div.classList.add("col-xs-6", "alert", "alert-info");
    div.innerHTML = "Please choose a workout to get started";
    return div;
}

function startStopButton(){
    var div = document.createElement('div');
    div.classList.add("col-xs-4");

    var button = document.createElement('button');
    button.type = "button";    
    button.onclick = function(){ startStopPressed(button); };

    startStopPressed(button);

    div.appendChild(button);   
    return div;
}

function startStopPressed(button){
    paused = !paused;

    button.innerHTML = "";

    if(paused){
        button.classList = "btn btn-success";
        var span = document.createElement('span');
        span.classList.add("glyphicon", "glyphicon-play");
        span.setAttribute("aria-hidden", "true");

        button.appendChild(span);
        button.innerHTML += " PLAY";
    }else{
        button.className = "btn btn-danger"
        var span = document.createElement('span');
        span.classList.add("glyphicon", "glyphicon-stop");
        span.setAttribute("aria-hidden", "true");

        button.appendChild(span);
        button.innerHTML += " PAUSE";
    }
}

//var newRow = tableRef.insertRow(tableRef.rows.length);

function showPopularWorkouts(){
    availableWorkouts.slice(0,10).forEach(function(entry) {
        workoutBox.innerHTML = "";
        workoutBox.appendChild(buttonFromWorkout(entry));
    });
}

showPopularWorkouts();

function buttonFromWorkout(block){
    var button = document.createElement("button"); 
    button.type = "button";
    button.classList.add("list-group-item");
    button.innerHTML = block.name;
    button.onclick = function(){workoutPickConfirmationAlert(block)};
    return button;
}

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

function workoutPickConfirmationAlert(block){
    swal({
    title: block.name,
    text: block.desc,
    type: "input",
    showCancelButton: true,
    closeOnConfirm: true,
    animation: "slide-from-top",
    inputPlaceholder: "How much times do you want to play the workout?",
    confirmButtonText: "Add to Queue",
    cancelButtonText: "Cancel"
    },
        function(inputValue){        
            if (!isInt(inputValue)) {
                swal.showInputError("You need to write a number!");
                return false;
            }else{
                var times = parseInt(Number(inputValue));
                var workout = new Workout(block.name, block.desc, block, repeat(times));
                workoutQueue.push(workout);
                return true;
            }
        }
    );
}

workoutStartNotify.push(function(){
    //remove top row from queue table

});