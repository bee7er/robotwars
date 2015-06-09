

var robots = [];
var maxX = 0;
var maxY = 0;

function startTheWar() {

    robots = [];
    if (buildTheGrid() && loadRobots()) {
                
        printStatus('Initial starting point');
        
        setInterval(moveRobots, 400);
    }
}

function showMessage(msg) {
    $('#msg').text(msg).show(1000).delay(3000).hide(1000);
}

function printStatus(title) {
    // Outputs the status of each robot
    $('#status').html(' ');
    var html = ('<h3>'+title+'</h3>');
    for (var i=0; i<robots.length; i++) {
        var robot = robots[i];
        html += ("<p>Robot "+robot.id+" is at "+robot.x+" "+robot.y+" heading "+robot.orientation+"</p>");
    }
    $('#status').html(html);
}

function moveRobots() {
	if (robots == null || robots.length <= 0) {
        showMessage('There are no robots!');
		return;
	}
	for (var i=0; i<robots.length; i++) {
		var currentRobot = robots[i];
		// Move the current robot
		var movements = currentRobot.movements.split(',');
		if (currentRobot.moveIndex >= movements.length) {
			// End of the moves for this robot
		} else {
			var movement = movements[currentRobot.moveIndex];
			currentRobot.moveIndex += 1;
			unplotRobotPosition(currentRobot);
			switch(movement) {
					case "L":
							rotateLeft(currentRobot);
							break;
					case "R":
							rotateRight(currentRobot);
							break;
					case "M":
							moveRobot(currentRobot);
							break;
			}
			plotRobotPosition(currentRobot);
			checkForCollision(currentRobot);
		}
	}
}

function checkForCollision(currentRobot) {
    for (var i=0; i<robots.length; i++) {
        var robot = robots[i];
        if (robot.id != currentRobot.id) {
            if (robot.x == currentRobot.x && robot.y == currentRobot.y) {
                showMessage('Collision. Robot '+currentRobot.id+' wins');
            }
        }
    }
}

function plotRobotPosition(robot) {
    $("#cell-"+robot.x+"-"+robot.y).html("<img src=\"img/"+robot.orientation+".png\" width=\"40\" border=\"0\" title=\"I am robot "+robot.id+"\" >");
}

function unplotRobotPosition(robot) {
    $("#cell-"+robot.x+"-"+robot.y).empty();
}
function moveRobot(robot) {

    switch(robot.orientation) {
        case "north":
        	if (robot.y + 1 <= maxY) {
                robot.y += 1;
        	}
          break;
        case "south":
        	if (robot.y - 1 >= 0) {
                robot.y -= 1;
        	}
          break;
        case "east":
        	if (robot.x + 1 <= maxX) {
                robot.x += 1;
        	}
          break;
        case "west":
        	if (robot.x - 1 >= 0) {
                robot.x -= 1;
        	}
          break;
    }
}
function rotateLeft(robot) {
    switch(robot.orientation) {
        case "north":
            robot.orientation = "west";
            break;
        case "south":
            robot.orientation = "east";
            break;
        case "east":
            robot.orientation = "north";
            break;
        case "west":
            robot.orientation = "south";
            break;
    }
}
function rotateRight(robot) {
    switch(robot.orientation) {
        case "north":
            robot.orientation = "east";
            break;
        case "south":
            robot.orientation = "west";
            break;
        case "east":
            robot.orientation = "south";
            break;
        case "west":
            robot.orientation = "north";
            break;
    }
}

function loadRobots() {
    var errorMsg = '';
    var sep = '';
    if ($('#start_1_x').val() < 0) {
        errorMsg += (sep + "Robot 1 x position must be greater than zero");
        sep = "\n";
    }
    if ($('#start_1_y').val() < 0) {
        errorMsg += (sep + "Robot 1 y position must be greater than zero");
        sep = "\n";
    }
    if ($('#start_2_x').val() < 0) {
        errorMsg += (sep + "Robot 2 x position must be greater than zero");
        sep = "\n";
    }
    if ($('#start_2_y').val() < 0) {
        errorMsg += (sep + "Robot 2 y position must be greater than zero");
        sep = "\n";
    }
    if ($('#start_1_x').val() > maxX) {
        errorMsg += (sep + "Robot 1 x position is too large");
        sep = "\n";
    }
    if ($('#start_1_y').val() > maxY) {
        errorMsg += (sep + "Robot 1 y position is too large");
        sep = "\n";
    }
    if ($('#start_2_x').val() > maxX) {
        errorMsg += (sep + "Robot 2 x position is too large");
        sep = "\n";
    }
    if ($('#start_2_y').val() > maxY) {
        errorMsg += (sep + "Robot 2 y position is too large");
        sep = "\n";
    }
    if (errorMsg != '') {
        showMessage(errorMsg);
        return false;
    }
    var robot1 = {
        id:"1",
        x:Number($('#start_1_x').val()),
        y:Number($('#start_1_y').val()),
        orientation:$('#orientation_1').val(),
        movements:$('#movements_1').text(),
        moveIndex: 0
    };

    robots[robots.length] = robot1;

    var robot2 = {
        id:"2",
        x:Number($('#start_2_x').val()),
        y:Number($('#start_2_y').val()),
        orientation:$('#orientation_2').val(),
        movements:$('#movements_2').text(),
        moveIndex: 0
    };

    robots[robots.length] = robot2;

    return true;
}

function buildTheGrid() {
    $('#grid').empty();
    var dimensionX = $('#dimension_x').val();
    var dimensionY = $('#dimension_y').val();
    maxX = dimensionX;
		maxY = dimensionY;
    if (dimensionX=='' || dimensionY=='') {
        showMessage('Please enter a value for both the width and height of the grid');
        return false;
    }
    var html = generateGridTable(dimensionX, dimensionY);
    $('#grid').html(html);
    return true;
}

function generateGridTable(dimensionX, dimensionY) {
    var html = '<table id="grid-container" class="grid-table"><tbody>';
    for (var i=dimensionY; i>=0; i--) {
        html += ("<tr>");
        html += ("<td class=\"grid-elem\">"+i+"</td>");
        for (var j=0; j<=dimensionX; j++) {
            html += ("<td class=\"cell grid-elem\" id=\"cell-"+j+"-"+i+"\">&nbsp;</td>");
        }
        html += ("</tr>");
    }
    // Generate a row exclusively for the column numbers
    html += ("<tr>");
    html += ("<td class=\"grid-elem\">&nbsp;</td>");
    for (var j=0; j<=dimensionX; j++) {
        html += ("<td class=\"grid-elem\">"+j+"</td>");
    }
    html += ("</tr>");
    html += ("</tbody></table>");
    return html;
}

function addRotateLeft(elemId) {
    addAction(elemId, 'L');
}
function addRotateRight(elemId) {
    addAction(elemId, 'R');
}
function addMoveForward(elemId) {
    addAction(elemId, 'M');
}
function addAction(elemId, action) {
    var text = $('#'+elemId).text();
    var separator = '';
    if (text.length>0) {
        separator = ',';
    }
    $('#'+elemId).text(text+separator+action);
}
function deleteLast(elemId) {
    var text = $('#'+elemId).text();
    if (text.length>2) {
        $('#'+elemId).text(text.substr(0,text.length-2));
    } else {
        $('#'+elemId).text('');
    }

}