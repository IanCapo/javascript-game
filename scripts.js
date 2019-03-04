const squaresArray = createSquaresArray()
const board = document.querySelector('main')
let fightArena = ''
let form = ''

class Player {
  constructor(name, image, healthscore, weapon) {
    this.name = name
    this.image = image
    this.healthscore = healthscore
    this.weapon = weapon
  }
}

class Weapon {
  constructor(name, image, power) {
    this.name = name,
      this.power = power,
      this.image = image
  }
}

const hammer = new Weapon('hammer', 'image', 10)
const gun = new Weapon('gun', 'image', 40)
const knife = new Weapon('knife', 'image', 30)
const lasersword = new Weapon('lasersword', 'image', 60)
const playerOne = new Player('playerOne', 'image', 100, hammer)
const playerTwo = new Player('playerTwo', 'image', 100, hammer)

let activePlayer = playerOne

/* ---------------------------------- Functions ------------------------------------ */

//Create an array of object with coordinates
function createSquaresArray() {
  let squaresArray = []
  for (let x = 1; x < 11; x++) {
    for (let y = 1; y < 11; y++) {
      let square = { row: x, column: y, state: 'free' }
      squaresArray.push(square)
    }
  }
  return squaresArray
}

// combine placeItem and placeWeapon => placeItem
// 
function placeItem(item) {
  let randomSquare = createRandomNumber(0, squaresArray.length - 1)
  let square = squaresArray[randomSquare]

  const edge =
    square.row === 1 ||
    square.column === 1 ||
    square.row === 10 ||
    square.column === 10

  if (square.state != 'free' || edge) {
    placeItem(item)
  } else if (!checkIfPathFree(square)) {
    square.state = item.name
    item.position = { row: square.row, column: square.column }
  } else {
    placeItem(item)
  }
}

// Use objects from SquaresArray to render the board
let squaresCounter = createRandomNumber(10, 20)

function blockSquares() {
  let num = createRandomNumber(0, squaresArray.length - 1)
  let square = squaresArray[num]
  let check = checkIfPathFree(square)
  let checkAll = squaresArray.map(square => checkIfPathFree(square))

  if (squaresCounter >= 1) {
    if (square.state === 'blocked') {
      blockSquares()
    } else if (check) {
      blockSquares()
    } else if (checkAll) {
      square.state = 'blocked'
      squaresCounter--
      blockSquares()
    }
  } else {
  }
}

function renderBoard() {
  blockSquares()
  placeItem(playerOne)
  placeItem(playerTwo)
  placeItem(gun)
  placeItem(hammer)
  placeItem(knife)
  placeItem(lasersword)

  const gridContainer = document.getElementById('game')
  squaresArray.map(obj => {
    let gridItem = document.createElement('div')
    gridItem.classList.add('grid-item')
    gridItem.innerHTML = `row: ${obj.row} col: ${obj.column}`
    gridItem.classList.add(obj.state)

    gridItem.setAttribute('data-row', obj.row)
    gridItem.setAttribute('data-column', obj.column)

    gridContainer.appendChild(gridItem)
  })
}

// Eventlistener in grid-items
$('.grid-container').on('click', '.grid-item', function () {
  movePlayer($(this))
})

//MOVE PLAYER
function movePlayer($this) {
  let squareCheck = createTraversedSquares($this)

  if (squareCheck) {
    $(`.${activePlayer.name} `)
      .addClass('free')
      .removeClass(`${activePlayer.name} `)
    // $this jquery-Node that was clicked
    $this.removeClass('free').addClass(`${activePlayer.name} `)

    activePlayer.position = {
      row: $this[0].attributes['data-row'].value,
      column: $this[0].attributes['data-column'].value,
    }
    collectWeapon($this)
    if (checkIfFight()) {
      playerChoice()
    }
    switchPlayers()
  } else {
    alert('You can\'t jump blocked squares')
  }
}

// -------------  helper functions -------------

function createRandomNumber(min, max) {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
  return randomNumber
}

function checkIfPathFree(square) {
  let row = square.row
  let col = square.column

  let north = row - 1
  let south = row + 1
  let east = col + 1
  let west = col - 1

  function isNorth(obj) {
    return obj.row === north && obj.column === col
  }
  function isSouth(obj) {
    return obj.row === south && obj.column === col
  }
  function isEast(obj) {
    return obj.row === row && obj.column === east
  }
  function isWest(obj) {
    return obj.row === row && obj.column === west
  }
  /* at least 3 adjacent squares have to be unblocked for a square to be considered free */
  if (
    square.row === 1 ||
    square.column === 1 ||
    square.row === 10 ||
    square.column === 10
  ) {
    return true
  } else {
    if (
      square.state === 'free' &&
      ((squaresArray.find(isNorth).state === 'blocked' &&
        squaresArray.find(isEast).state === 'blocked' &&
        squaresArray.find(isWest).state === 'blocked') ||
        (squaresArray.find(isNorth).state === 'blocked' &&
          squaresArray.find(isWest).state === 'blocked' &&
          squaresArray.find(isSouth).state === 'blocked') ||
        (squaresArray.find(isNorth).state === 'blocked' &&
          squaresArray.find(isEast).state === 'blocked' &&
          squaresArray.find(isSouth).state === 'blocked') ||
        (squaresArray.find(isSouth).state === 'blocked' &&
          squaresArray.find(isWest).state === 'blocked' &&
          squaresArray.find(isEast).state === 'blocked'))
    ) {
      return true
    } else if (
      (squaresArray.find(isNorth).state === 'playerOne') ||
      (squaresArray.find(isSouth).state === 'playerOne') ||
      (squaresArray.find(isEast).state === 'playerOne') ||
      (squaresArray.find(isWest).state === 'playerOne')) {
      return true
    } else {
      return false
    }
  }
}

function createTraversedSquares($clickedSquare) {
  let playerRow = activePlayer.position.row
  let playerColumn = activePlayer.position.column

  let squareColumn = $clickedSquare.attr('data-column')
  let squareRow = $clickedSquare.attr('data-row')

  const northSouth = squareRow - playerRow
  const eastWest = squareColumn - playerColumn

  let traversedSquares = []
  let isBlocked

  //if traveling north or south, create an array of traversed squares
  if (eastWest === 0 && parseInt(northSouth) <= 3) {
    if (northSouth >= 0) {
      //south
      for (let i = 0; i <= northSouth; i++) {
        let thisSquare = { thisRow: parseInt(playerRow) + i, thisColumn: playerColumn }
        traversedSquares.push(thisSquare)
      }
    } else if (northSouth <= 0) {
      //north
      for (let i = 0; i >= northSouth; i--) {
        let thisSquare = { thisRow: parseInt(playerRow) + i, thisColumn: playerColumn }
        traversedSquares.push(thisSquare)
      }
    }
    isBlocked = checkTraversedSquares(traversedSquares)
    return isBlocked;
  } else if (northSouth === 0 && parseInt(eastWest) <= 3) {
    //east
    if (eastWest > 0) {
      for (let i = 0; i <= eastWest; i++) {
        let thisSquare = { thisRow: playerRow, thisColumn: parseInt(playerColumn) + i }
        traversedSquares.push(thisSquare)
      }
    } else if (eastWest < 0) {
      //west
      for (let i = 0; i >= eastWest; i--) {
        let thisSquare = {
          thisRow: playerRow,
          thisColumn: parseInt(playerColumn) + i,
        }
        traversedSquares.push(thisSquare)
      }
    }
    isBlocked = checkTraversedSquares(traversedSquares)
    return isBlocked;
  } else {
    console.log('moving incorrectly: more than 3 squares or diagonally')
  }

}

function checkTraversedSquares(traversedSquares) {
  let isBlocked = true
  for (let i = 0; i < traversedSquares.length; i++) {
    if ($(`[data-row= "${traversedSquares[i].thisRow}"][data-column="${traversedSquares[i].thisColumn}"]`).hasClass('blocked')) {
      isBlocked = false
      return isBlocked
    }
  }
  return isBlocked
}


function checkWin() {
  console.log('pOne', playerOne.healthscore)
  console.log('pTwo', playerTwo.healthscore)

  if (playerOne.healthscore <= 0) {
    board.innerHTML = `
    <p>Player Two won</p>
    <p>Player One lost</p>`

  } else if (playerTwo.healthscore <= 0) {
    board.innerHTML = `
    <p>Player One won</p>
    <p>Player Two lost</p>`

  } else {
    setTimeout(() =>
      fightArena.classList.add('hidden'), 3000)
  }
}

function switchPlayers() {
  if (activePlayer === playerOne) {
    activePlayer = playerTwo
    console.log('activePlayer', activePlayer.name)
  } else {
    activePlayer = playerOne
    console.log('activePlayer', activePlayer.name)
  }
}

//checks if target square contains a weapon and if so adds it to the weapon key in player object
function collectWeapon($clickedSquare) {
  if ($clickedSquare.hasClass('hammer')) {
    activePlayer.weapon = hammer
    $clickedSquare.removeClass('hammer').addClass(activePlayer.name)
  } else if ($clickedSquare.hasClass('gun')) {
    activePlayer.weapon = gun
    $clickedSquare.removeClass('gun').addClass(activePlayer.name)
  } else if ($clickedSquare.hasClass('lasersword')) {
    activePlayer.weapon = lasersword
    $clickedSquare.removeClass('lasersword').addClass(activePlayer.name)
  } else if ($clickedSquare.hasClass('knife')) {
    activePlayer.weapon = knife
    $clickedSquare.removeClass('knife').addClass(activePlayer.name)
  }
}

function updateFightArena() {
  const jsOneWeapon = document.querySelector('.js-pOneWeapon')
  const jsTwoWeapon = document.querySelector('.js-pTwoWeapon')
  const jsOne = document.querySelector('.js-pOneHealth')
  const jsTwo = document.querySelector('.js-pTwoHealth')

  jsOne.innerHTML = `healthscore: ${playerOne.healthscore}`
  jsTwo.innerHTML = `healthscore: ${playerTwo.healthscore}`
  jsOneWeapon.innerHTML = `weapon: ${playerOne.weapon.name}, power: ${playerOne.weapon.power}`
  jsTwoWeapon.innerHTML = `weapon: ${playerTwo.weapon.name}, power: ${playerTwo.weapon.power}`
}

function checkIfFight() {
  let playerOneRow = playerOne.position.row
  let playerTwoRow = playerTwo.position.row
  let playerOneColumn = playerOne.position.column
  let playerTwoColumn = playerTwo.position.column

  let conditionOne = (playerOneRow == playerTwoRow) && (playerOneColumn - playerTwoColumn === 1)
  let conditionTwo = (playerOneRow == playerTwoRow) && (playerOneColumn - playerTwoColumn === -1)
  let conditionThree = (playerOneColumn == playerTwoColumn) && (playerOneRow - playerTwoRow === 1)
  let conditionFour = (playerOneColumn == playerTwoColumn) && (playerOneRow - playerTwoRow === -1)

  let isFirstFight = (playerOne.healthscore === 100) && (playerTwo.healthscore === 100)

  if (conditionOne || conditionTwo || conditionThree || conditionFour) {
    renderFightArena(isFirstFight)
    return true
  } else {
    return false
  }
}


function playerChoice() {
  // switchPlayers()
  form = document.getElementById('choiceForm')
  $('.fight_arena').on('click', 'button', function () {
    event.preventDefault()
    let playerChoice
    playerChoice = this.value
    fight(playerChoice)
  })
}

function fight(playerChoice) {
  console.log('fight is beeing executed')
  let defendingPlayer
  let attackingPlayer
  let defendingPlayerChoice = playerChoice

  if (activePlayer === playerOne) {
    defendingPlayer = playerOne
    attackingPlayer = playerTwo
  } else {
    defendingPlayer = playerTwo
    attackingPlayer = playerOne
  }

  attackingPlayerWeapon = attackingPlayer.weapon.power
  defendingPlayerWeapon = defendingPlayer.weapon.power

  console.log('attacking player, weapon', attackingPlayerWeapon)
  console.log('defending player, weapon', defendingPlayerWeapon)

  if (defendingPlayerChoice === 'defend') {
    defendingPlayer.healthscore -= (attackingPlayerWeapon * 0.5)
  } else {
    defendingPlayer.healthscore -= attackingPlayerWeapon
  }

  attackingPlayer.healthscore -= defendingPlayerWeapon

  updateFightArena()
  checkWin()

}

function renderFightArena(isFirstFight) {
  switchPlayers()
  let playerView
  const choiceForm = `<form id="choiceForm" action="input">
    <button name="defendButton" type="submit" class="defend" value="defend">defend</button>
     <button name="attackButton "type="submit" class="attack" value="attack">attack</button>
  </form>`


  playerView =
    `<div class="fight-view ${playerOne.name}_fight">
        <h2>Player One</h2>
        <p class="js-pOneWeapon">weapon: ${playerOne.weapon.name}, power: ${playerOne.weapon.power}</p>
        <p class="js-pOneHealth">health score: ${playerOne.healthscore}</p>
      </div>
    <div class="choiceForm">
      <p>${activePlayer.name} choose:</p>
      ${choiceForm}
    </div>
      <div class="fight-view playerTwo_fight">
        <h2>Player Two</h2>
        <p class="js-pTwoWeapon">weapon: ${playerTwo.weapon.name}, power: ${playerTwo.weapon.power}</p>
        <p class="js-pTwoHealth">health score: ${playerTwo.healthscore}</p>
      </div>`

  console.log(isFirstFight)
  if (isFirstFight === true) {
    board.insertAdjacentHTML('beforeend', `<div class="fight_arena">${playerView}</div>`)
    fightArena = document.querySelector('.fight_arena')
  } else {
    updateFightArena()
    fightArena.classList.remove('hidden')

  }
}


createSquaresArray()
renderBoard()

