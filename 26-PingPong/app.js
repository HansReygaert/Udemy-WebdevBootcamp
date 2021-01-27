const buttonPlayer1 = document.querySelector('#button-player1');
const buttonPlayer2 = document.querySelector('#button-player2');
const buttonReset = document.querySelector('#button-reset');
const selectGamesToWin = document.querySelector('#gamesToWin');

//Generates a Player Object
function Player(htmlElement){
    this.isWinner = undefined;
    this.score = 0; 
    //the html scoreboard element
    this.htmlElement = htmlElement; 
}
    //Increments, then updates the html element
    Player.prototype.scores = function(){
        this.score++; 
        this.htmlElement.textContent = this.score; 
        if(this.score == game.getGamesToWin()){
            game.GameOver(); 
        }
    }
    //Toggle CSS to winner class
    Player.prototype.toggleWins = function(){
        this.htmlElement.classList.toggle('winner'); 
    }
    //Toggle CSS to loser class
    Player.prototype.toggleLoses = function(){
        this.htmlElement.classList.toggle('loser');
    }
    //Resets to default state
    Player.prototype.reset = function(){ 
        this.score = 0;
        this.htmlElement.textContent = this.score;  
        if(this.isWinner === true){
            this.toggleWins();
        } else if(this.isWinner === false){
            this.toggleLoses();
        }
        this.isWinner = undefined; 
    }

dfsfdsfdssdfdsffsd
const game = {
    isGameOver: false, 
    gamesToWin: selectGamesToWin.value, 
    controlPlayer1: document.querySelector('#button-player1'),
    controlPlayer2: document.querySelector('#button-player2'),

    player1: new Player(document.querySelector('#score-player1')),
    player2: new Player(document.querySelector('#score-player2')),

    getGamesToWin(){
        return this.gamesToWin; 
    },
    //Set Game State = GameOver
    GameOver(){
        this.isGameOver = true; 
        this.decideWinner();
        this.toggleButtonsDisabled();
    },
    //Decide The Winner and update status
    decideWinner(){
        if(this.player1.score > this.player2.score){
            this.player1.toggleWins();
            this.player1.isWinner = true; 
            this.player2.toggleLoses();
            this.player2.isWinner = false;
        } else {
            this.player1.toggleLoses();
            this.player1.isWinner = false; 
            this.player2.toggleWins();
            this.player2.isWinner = true; 
        }
    },

    //Toggle controls to be disabled or enabled
    toggleButtonsDisabled(){
        buttonPlayer1.toggleAttribute('disabled');
        buttonPlayer2.toggleAttribute('disabled');
    },
    //Reset the game state back to default
    reset(){
      this.player1.reset();
      this.player2.reset();

           
      if(game.isGameOver == true){
      game.toggleButtonsDisabled();
      }
      game.isGameOver = false; 
    }
};
//Button1 is pressed
buttonPlayer1.addEventListener('click', function(){
    game.player1.scores();
});
//Button2 is pressed
buttonPlayer2.addEventListener('click', function(){
    game.player2.scores();
});
//ResetButton is pressed
buttonReset.addEventListener('click',function(){
   game.reset();
});
//Event updates the value in case it is changed mid-game
const onGamesToWinChanged = selectGamesToWin.addEventListener('change',()=>{
   game.gamesToWin = selectGamesToWin.value;
   game.reset();
});