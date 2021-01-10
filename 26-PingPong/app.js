const buttonPlayer1 = document.querySelector('#button-player1');
const buttonPlayer2 = document.querySelector('#button-player2');
const buttonReset = document.querySelector('#button-reset');

const gamesToWin = document.querySelector('#gamesToWin').value;

const txtScorePlayer1 = document.querySelector('#score-player1');
const txtScorePlayer2 = document.querySelector('#score-player2');

let scorePlayer1 = 0; 
let scorePlayer2 = 0; 
let GameOver = false; 

function setText(element, value){
    element.textContent = value; 
}

function togglePlayerButtons()
{
    buttonPlayer1.toggleAttribute('disabled');
    buttonPlayer2.toggleAttribute('disabled');
}

buttonPlayer1.addEventListener('click', function(){
    console.log(gamesToWin);
    scorePlayer1++;
    setText(txtScorePlayer1, scorePlayer1);
    if(scorePlayer1 == gamesToWin){
        gameOver = true;
        togglePlayerButtons();
    }
});
buttonPlayer2.addEventListener('click', function(){
    scorePlayer2++;
    setText(txtScorePlayer2, scorePlayer2);
});

buttonReset.addEventListener('click',function(){
    scorePlayer1 = 0; 
    scorePlayer2 = 0; 
    txtScorePlayer1.textContent = scorePlayer1; 
    txtScorePlayer2.textContent = scorePlayer2;


});