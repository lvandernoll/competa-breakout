var canvas;
var pen;
var fieldRadius;
var keyState = {};
var paddleWidth = 70;
var paddleHeight = 15;
var paddleColor = 'purple';
var paddlePosition = 0 - (paddleWidth / 2);
var paddleSpeed = 10;
var blockWidth = 50;
var blockHeight = 25;
var blockColor = 'green';
var blockArray = {};
var ballRadius = 10;
var ballColor = 'yellow';
var ballXpos = 0;
var ballYpos = 200;
var ballDirection = 1;
var ballSpeed = 5;

function startup() {
    canvas = document.getElementById('canvas');
    pen = canvas.getContext("2d");
    fieldRadius = canvas.height / 2;
    pen.translate(fieldRadius, fieldRadius);

    addEventListeners();
    fillBlockArray();

    var interval = setInterval(function () {
        listenToKeypress();
        pen.clearRect(0 - fieldRadius, 0 - fieldRadius, fieldRadius * 2, fieldRadius * 2);
        moveBall();
        if (!checkWallCollision()) {
            clearInterval(interval);
        }
        checkBlockCollision();
        checkPaddleCollision();
        if (checkVictory()) {
            clearInterval(interval);
        }
        drawBall();
        drawPaddle();
        drawBlocks();
    }, 20);

    listenToKeypress();
}

function addEventListeners() {
    window.addEventListener('keydown', function (e) {
        keyState[e.keyCode || e.which] = true;
    }, true);
    window.addEventListener('keyup', function (e) {
        keyState[e.keyCode || e.which] = false;
    }, true);
}

function fillBlockArray() {
    for (let i = 0; i < 45; i++) {
        blockArray[i] = true;
    }
}

function listenToKeypress() {
    if (!keyState[39] && keyState[37] && paddlePosition > -fieldRadius) {
        paddlePosition -= paddleSpeed;
    } else if (!keyState[37] && keyState[39] && paddlePosition + paddleWidth < fieldRadius) {
        paddlePosition += paddleSpeed;
    }
}

function checkVictory() {
    let victory = true;
    for (let i = 0; i < 45; i++) {
        if (blockArray[i] === true) {
            victory = false;
        }
    }
    if (victory) {
        ballSpeed = 0;
        paddleSpeed = 0;
        window.alert("Victory!");
    }
    return victory;
}

function checkPaddleCollision() {
    //Left
    if (ballYpos + ballRadius > fieldRadius - paddleHeight
        && ballXpos + ballRadius > paddlePosition
        && ballXpos - ballRadius < paddlePosition + paddleWidth / 2) {
        ballDirection = 4;
    }
    //Right
    if (ballYpos + ballRadius > fieldRadius - paddleHeight
        && ballXpos + ballRadius > paddlePosition + paddleWidth / 2
        && ballXpos - ballRadius < paddlePosition + paddleWidth) {
        ballDirection = 1;
    }
}

function checkBlockCollision() {
    for (let x = 1; x <= 9; x++) {
        for (let y = 1; y <= 5; y++) {
            if (blockArray[x - 1 + ((y - 1) * 9)] === true) {

                //Top
                if (ballXpos + ballRadius > -fieldRadius + 25 + (blockWidth * (x - 1))
                    && ballXpos - ballRadius < -fieldRadius + 25 + (blockWidth * (x - 1)) + blockWidth
                    && ballYpos + ballRadius === -fieldRadius + 50 + (blockHeight * (y - 1))) {
                    if (ballDirection === 2) {
                        ballDirection = 1;
                    } else {
                        ballDirection = 4;
                    }

                    blockArray[x - 1 + ((y - 1) * 9)] = false;
                }
                //Right
                if (ballXpos - ballRadius === -fieldRadius + 25 + (blockWidth * (x - 1))
                    && ballYpos - ballRadius > -fieldRadius + 50 + (blockHeight * (y - 1))
                    && ballYpos + ballRadius < -fieldRadius + 50 + (blockHeight * (y - 1)) - blockHeight) {
                    if (ballDirection === 3) {
                        ballDirection = 2;
                    } else {
                        ballDirection = 1;
                    }
                    blockArray[x - 1 + ((y - 1) * 9)] = false;
                }
                //Bottom
                if (ballXpos + ballRadius > -fieldRadius + 25 + (blockWidth * (x - 1))
                    && ballXpos - ballRadius < -fieldRadius + 25 + (blockWidth * (x - 1)) + blockWidth
                    && ballYpos - ballRadius === -fieldRadius + 50 + (blockHeight * (y - 1)) + blockHeight) {
                    if (ballDirection === 4) {
                        ballDirection = 3;
                    } else {
                        ballDirection = 2;
                    }
                    blockArray[x - 1 + ((y - 1) * 9)] = false;
                }
                //Left
                if (ballXpos - ballRadius === -fieldRadius + 25 + (blockWidth * (x - 1))
                    && ballYpos + ballRadius > -fieldRadius + 50 + (blockHeight * (y - 1))
                    && ballYpos - ballRadius < -fieldRadius + 50 + (blockHeight * (y - 1)) + blockHeight) {
                    if (ballDirection === 1) {
                        ballDirection = 4;
                    } else {
                        ballDirection = 3;
                    }
                    blockArray[x - 1 + ((y - 1) * 9)] = false;
                }
            }
        }
    }
}

function checkWallCollision() {
    //Top
    if (ballYpos < -fieldRadius + ballRadius && ballDirection === 1) {
        ballDirection = 2;
    }
    if (ballYpos < -fieldRadius + ballRadius && ballDirection === 4) {
        ballDirection = 3;
    }
    //Left
    if (ballXpos < -fieldRadius + ballRadius && ballDirection === 4) {
        ballDirection = 1;
    }
    if (ballXpos < -fieldRadius + ballRadius && ballDirection === 3) {
        ballDirection = 2;
    }
    //Bottom
    if (ballYpos - ballRadius > fieldRadius - ballRadius) {
        ballSpeed = 0;
        window.alert("Game Over");
        return false;
    }
    //Right
    if (ballXpos > fieldRadius - ballRadius && ballDirection === 1) {
        ballDirection = 4;
    }
    if (ballXpos > fieldRadius - ballRadius && ballDirection === 2) {
        ballDirection = 3;
    }
    return true;
}

function moveBall() {
    if (ballDirection === 1 || ballDirection === 2) {
        ballXpos += ballSpeed;
    }
    if (ballDirection === 3 || ballDirection === 4) {
        ballXpos -= ballSpeed;
    }
    if (ballDirection === 2 || ballDirection === 3) {
        ballYpos += ballSpeed;
    }
    if (ballDirection === 1 || ballDirection === 4) {
        ballYpos -= ballSpeed;
    }
}

function drawPaddle() {
    pen.fillStyle = paddleColor;
    pen.fillRect(paddlePosition, fieldRadius - paddleHeight, paddleWidth, paddleHeight);
}

function drawBall() {
    pen.fillStyle = ballColor;
    pen.beginPath();
    pen.arc(ballXpos, ballYpos, ballRadius, 0, 2 * Math.PI);
    pen.fill()
}

function drawBlocks() {
    pen.fillStyle = blockColor;

    for (let x = 1; x <= 9; x++) {
        for (let y = 1; y <= 5; y++) {
            if (blockArray[x - 1 + ((y - 1) * 9)] === true) {
                pen.fillRect(-fieldRadius + 25 + ((x - 1) * 50), -fieldRadius + 50 + ((y - 1) * 25), 50, 25);
            }
        }
    }
}