/*
 * List of Variables for the game.
 * Declaration of variables setting them to 0;
 */

const cardsList = [
  {_id: 1, type: 'fa-diamond'},
  {_id: 2, type: 'fa-paper-plane-o'},
  {_id: 3, type: 'fa-anchor'},
  {_id: 4, type: 'fa-bolt'},
  {_id: 5, type: 'fa-cube'},
  {_id: 6, type: 'fa-leaf'},
  {_id: 7, type: 'fa-bicycle'},
  {_id: 8, type: 'fa-bomb'}
];

let openList = [];
let count = 0;
let moves = 0;
let countMatched = 0;

let minutes = 0;
let seconds = 0;
let totalSeconds = 0;

let timer = setInterval(setTime, 1000);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function resetGame() {
  moves = 0;
  countMatched = 0;
  minutes = 0;
  seconds = 0;
  totalSeconds = 0;
  document.getElementById('moves').innerHTML = 0 + " Moves";
  document.getElementById('star-1').className = "fa fa-star";
  document.getElementById('star-2').className = "fa fa-star";
  const deck = document.getElementById('deck');
  deck.innerHTML = ""; // It clears the items before the shuffle
}

function displayCards() {
  resetGame();
  const cards = cardsList.concat(cardsList);
  const shuffledCards = shuffle(cards);

  for (let i = 0; i < shuffledCards.length; i++) {
    deck.innerHTML += '<li class="card" onclick="selectCard(this)" id="c-' + i + '">' +
                        '<i class="fa ' + shuffledCards[i].type + '" id="i-' + shuffledCards[i]._id + '"></i>' +
                        '</li>';
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 * ok  - display the card's symbol (put this functionality in another function that you call from this one)
 * ok - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 * ok - if the list already has another card, check to see if the two cards match
 * ok   + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 * ok   + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 * ok   + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 * ok   + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function selectCard(obj) {
  const icon = showCard(obj);
  count = addCardToOpenList(icon);
  if(openList[0] !== openList[1]) moveCounter();
  if(count == 2){
    stopClick(true);
    checkCards(openList[0], openList[1]);
  }
}

function showCard(obj) {
  const cardID = document.getElementById(obj.id);
  cardID.className += ' open show ';
  return cardID;
}

function addCardToOpenList(card) {
  let cardCount = openList.push(card);
  return cardCount;
}

function checkCards(card1, card2) {
  if((card1.id != card2.id) && (card1.childNodes[0].id === card2.childNodes[0].id)){
    cardsMatch(card1, card2);
  }else{
    setTimeout(function(){
      closeCard(card1, card2);
    }, 1000);
  }
}

function cardsMatch(card1, card2) {
  card1.className = 'card match';
  card2.className = 'card match';
  card1.removeAttribute("onclick");
  card2.removeAttribute("onclick");
  openList.splice(0,2);
  countMatched++;
  playerWins(countMatched);
  stopClick(false);
}

function closeCard(card1, card2) {
  card1.className = 'card';
  card2.className = 'card';
  openList.splice(0,2);
  stopClick(false);
}

function playerWins(pmatched) {
  if(pmatched === 8){
    setTimeout(function(){
      let c = confirm("You win! \n" +
              "It took " + minutes + " minute(s) and " +  seconds + " seconds \n" +
              "Your score was: " + moves / 2 + " moves \n" +
              "Do you wanna play again?"
              );
      if(c){
        displayCards();
      }
    }, 200);
  }
}

function moveCounter() {
    moves++;
    let moveDouble = moves / 2;
    document.getElementById('moves').innerHTML = Math.floor(moveDouble) + " Moves";
    removeStar(moveDouble);
}

function removeStar(pmoves) {
  switch (pmoves) {
    case 13:
      document.getElementById('star-1').className = "fa fa-star-o";
      break;
    case 16:
      document.getElementById('star-2').className = "fa fa-star-o";
      break;
  }
}

function stopClick(boo) {
  if (boo) {
    document.addEventListener("click", handler, true);
  }else{
    document.removeEventListener("click", handler, true);
  }
}

function handler(e) {
  if(e.target.className == "card" ) {
    e.stopPropagation();
    e.preventDefault();
  }
}

function setTime() {
    totalSeconds++;
    seconds = pad(totalSeconds%60);
    minutes = pad(parseInt(totalSeconds/60));
    document.getElementById('time').innerHTML = minutes + " : " + seconds;
}

function pad(val) {
    let valString = val + "";
    if(valString.length < 2) {
      return "0" + valString;
    }else{
      return valString;
    }
}

displayCards();
