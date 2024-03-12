const board=document.getElementById('gameboard');
const instructionset=document.getElementById('instext');
const logo=document.getElementById('logo');
const score=document.getElementById('score');
const highscoretext=document.getElementById('highscore');

const gridsize=20;
let snake=[{x:10,y:10}];
let food=generatefood();
let direction='right';
let highscore=0;
let gameinterval;
let gamespeeddelay=200;
let gamestarted=false;

let audio=new Audio();
audio.src="collisionsound.mp3";
let audio2=new Audio();
audio2.src="audio.mp3";
// draw snake,food and map
function draw(){
    board.innerHTML=``;
    drawsnake();
    drawfood();
    updateScore();
    
    
}

//snake
function drawsnake(){
    snake.forEach((segment)=>{
        let snakeElement=createGameElement('div','snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement);
       
    })
    
}

//snake cube or food cube
function createGameElement(tag,className){
    const element =document.createElement(tag);
    element.className=className;
    return element;
}

function setPosition(element,position){
    element.style.gridColumn=position.x;
    element.style.gridRow=position.y;

}

// draw();

//food
//food function
function drawfood(){
    if(gamestarted){
        const foodelement=createGameElement('div','food');
        setPosition(foodelement,food);
        board.appendChild(foodelement); 
    }
    
}
//generate food
function generatefood(){
    const x=Math.floor(Math.random()*gridsize)+1;
    const y=Math.floor(Math.random()*gridsize)+1;
    return{x,y};

}

//moving the snake
function move(){
    const head={ ...snake[0] };//shallow copy
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        
    }
    snake.unshift(head);

    // snake.pop();
    //if snake and food comes in same position or axis
    if(head.x===food.x && head.y==food.y){
        food=generatefood();
        increaseSpeed();
        clearInterval(gameinterval);
        gameinterval=setInterval(() =>{
            move();
            checkcollision();
            draw();
        }, gamespeeddelay);
    }else{
        snake.pop();
    }
}

//test moving
// setInterval(()=>{
//     move();
//     draw();
// },200);

//start game function

function startgame(){
    gamestarted=true;
    instructionset.style.display='none';
    logo.style.display='none';
    gameinterval=setInterval(()=>{
        move();
        checkcollision();
        draw();
    },gamespeeddelay);
}

//keypress eventlistner
function handlekeypress(event){
    if(
        (!gamestarted && event.code === 'Space') || (!gamestarted && event.key === ' ')
    ){
        startgame();
        audio2.play();
        

    }else{
        switch (event.key) {
            case 'ArrowUp':
                direction='up';
                break;
            case 'ArrowDown':
                direction='down';
                break;
            case 'ArrowLeft':
                direction='left';
                break;
            case 'ArrowRight':
                direction='right';
                break;
        }
    }
}

document.addEventListener('keydown',handlekeypress);

function increaseSpeed(){
    console.log(gamespeeddelay);
    if(gamespeeddelay>150){
        gamespeeddelay-=5;
    }else if(gamespeeddelay>100){
        gamespeeddelay-=3;
    }else if(gamespeeddelay>50){
        gamespeeddelay-=2;
    }else if(gamespeeddelay>25){
        gamespeeddelay-=1;
    }
}

function checkcollision(){
    const head=snake[0];

    if(head.x<1||head.x>gridsize||head.y<1||head.y>gridsize){
        resetgame();
        audio.play();
        audio2.pause();
    }

    for(let i=1;i<snake.length;i++){
        if(head.x===snake[i].x && head.y===snake[i].y){
            resetgame();
            
        }
    }
    
}

function resetgame(){
    stopgame();
    updatehighscore();
    snake=[{x:10,y:10}];
    food=generatefood();
    direction='right';
    gamespeeddelay=200;
    updateScore();
}

function updateScore(){
    const currentscore=snake.length - 1;
    score.innerText=currentscore.toString().padStart(3,'0');
}

function stopgame(){
    clearInterval(gameinterval);
    gamestarted=false;
    instructionset.style.display='block';
    logo.style.display='block';
}

function updatehighscore(){
    const currentscore=snake.length-1;
    if(currentscore>highscore){
        highscore=currentscore;
        highscoretext.textContent=highscore.toString().padStart(3,'0');
    }
    highscoretext.style.display='block';
}