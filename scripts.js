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

const wrench = new Weapon('wrench', 'image', 10)
const rocket = new Weapon('rocket', 'image', 40)
const fire = new Weapon('fire', 'image', 30)
const thunderbolt = new Weapon('thunderbolt', 'image', 60)
const playerOne = new Player('playerOne', 'image', 100, wrench)
const playerTwo = new Player('playerTwo', 'image', 100, wrench)

let activePlayer = playerOne

/* ---------------------------------- Functions ------------------------------------ */

/* --------------- Create Board ------------------ */

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

// placeItem and placeWeapon
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
  createSquaresArray()
  blockSquares()
  placeItem(playerOne)
  placeItem(playerTwo)
  placeItem(rocket)
  placeItem(wrench)
  placeItem(fire)
  placeItem(thunderbolt)

  const gridContainer = document.getElementById('game')
  squaresArray.map(obj => {
    let gridItem = document.createElement('div')
    gridItem.classList.add('grid-item')
    /*gridItem.innerHTML = `row: ${obj.row} col: ${obj.column}`*/
    gridItem.classList.add(obj.state)

    gridItem.setAttribute('data-row', obj.row)
    gridItem.setAttribute('data-column', obj.column)

    gridContainer.appendChild(gridItem)
  })
}

/* Player movement */

// Eventlistener in grid-items for player movement
$('.grid-container').on('click', '.grid-item', function () {
  movePlayer($(this))
})

/* ------- MOVE PLAYER -------- */
function movePlayer($this) {
  let squareCheck = createTraversedSquares($this)
  if (squareCheck) {
    $(`.grid-item.${activePlayer.name} `)
      .addClass('free')
      .removeClass(`${activePlayer.name} `)
    $this.removeClass('free').addClass(`${activePlayer.name} `)

    activePlayer.position = {
      row: $this[0].attributes['data-row'].value,
      column: $this[0].attributes['data-column'].value,
    }
    collectWeapon($this)
    startFightLogic()
    // const allPossibleSquares = document.querySelectorAll('.possible')
    // allPossibleSquares.forEach(square => square.classList.remove('possible'))
    switchPlayers()
  } else {
    alert('You can\'t move diagonally or jump blocked squares')
  }
}

/* ------------ Collect Weapon  ------------- */
//checks if target square contains a weapon and if so adds it to the weapon key in player object
function collectWeapon($clickedSquare) {
  weaponSwitch = (weaponString, weapon) => {
    $clickedSquare.removeClass(weaponString)
    $clickedSquare.addClass(activePlayer.weapon.name)
    activePlayer.weapon = weapon
    $clickedSquare.addClass(activePlayer.name)
    updateFightArena()
  }

  if ($clickedSquare.hasClass('wrench')) {
    weaponSwitch('wrench', wrench)
  } else if ($clickedSquare.hasClass('rocket')) {
    weaponSwitch('rocket', rocket)
  } else if ($clickedSquare.hasClass('thunderbolt')) {
    weaponSwitch('thunderbolt', thunderbolt)
  } else if ($clickedSquare.hasClass('fire')) {
    weaponSwitch('fire', fire)
  }
}

/* -------------- Fight Logic ---------------- */

function startFightLogic() {
  if (checkIfFight()) {
    playerChoice()
  }
}
// check if players are on adjacent squares
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

// Create Pop-up fight arena
function renderFightArena(isFirstFight) {
  checkWhoAttacks()
  let defendingPlayer

  if (playerOne.status === 'defending') {
    defendingPlayer = playerOne
  } else {
    defendingPlayer = playerTwo
  }
  let fightArenaHTML =
    `<div class="fight-view">
        <h4>DEFEND</h4>
        <p> lower the attacks impact by 50%</p> 
      </div>
    <div class="choiceForm">
      <h2 class="js-defending-player">${defendingPlayer.name} choose:</h2>
      <form id = "choiceForm" action = "input" >
      <button name="defendButton" type="submit" class="defend" value="defend">defend</button>
      <button name="attackButton " type="submit" class="attack" value="attack">attack</button>
  </form >
    </div>
  <div class="fight-view">
    <h4>ATTACK</h4>
       <p> attack back with 100% impact </p>
  </div>`

  if (isFirstFight === true) {
    board.insertAdjacentHTML('beforeend', `<div class="fight_arena">${fightArenaHTML}</div>`)
    fightArena = document.querySelector('.fight_arena')
  } else {
    updateFightArena(defendingPlayer)
    fightArena.classList.remove('hidden')
  }
}

// check which player attacks
function checkWhoAttacks() {
  if (activePlayer === playerOne) {
    playerOne.status = 'attacking'
    playerTwo.status = 'defending'
  } else {
    playerTwo.status = 'attacking'
    playerOne.status = 'defending'
  }
}

// get value from clicked button in order to determine wether the attacked player defends or attacks back
function playerChoice() {
  form = document.getElementById('choiceForm')
  $('#choiceForm').on('click', 'button', function () {
    event.preventDefault()
    let playerChoice = this.value
    fight(playerChoice)
    $("#choiceForm").unbind("click")
  })
}

// execute fight after playerChoice
function fight(playerChoice) {
  console.log('fight is beeing executed')
  let defendingPlayer
  let attackingPlayer
  let defendingPlayerChoice = playerChoice

  if (playerOne.status === 'defending') {
    defendingPlayer = playerOne
    attackingPlayer = playerTwo
  } else {
    defendingPlayer = playerTwo
    attackingPlayer = playerOne
  }

  attackingPlayerWeapon = attackingPlayer.weapon.power
  defendingPlayerWeapon = defendingPlayer.weapon.power

  if (defendingPlayerChoice === 'defend') {
    defendingPlayer.healthscore -= (attackingPlayerWeapon * 0.5)
  } else {
    defendingPlayer.healthscore -= attackingPlayerWeapon
    attackingPlayer.healthscore -= defendingPlayerWeapon
  }
  updateFightArena(defendingPlayer)
  checkWin()
}

// Updates values in the fight arena pop-up
function updateFightArena(defendingPlayer) {
  const jsOneWeapon = document.querySelector('.js-pOneWeapon')
  const jsOneWeaponPower = document.querySelector('.js-pOneWeaponPower')
  const jsTwoWeapon = document.querySelector('.js-pTwoWeapon')
  const jsTwoWeaponPower = document.querySelector('.js-pTwoWeaponPower')
  const jsOne = document.querySelector('.js-pOneHealth')
  const jsTwo = document.querySelector('.js-pTwoHealth')
  const jsPlayerChoiceForm = document.querySelector('.js-defending-player')

  if (defendingPlayer) {
    jsPlayerChoiceForm.innerHTML = `${defendingPlayer.name} choose:`
  }

  jsOne.innerHTML = playerOne.healthscore
  jsTwo.innerHTML = playerTwo.healthscore
  jsOneWeapon.innerHTML = playerOne.weapon.name
  jsOneWeaponPower.innerHTML = playerOne.weapon.power
  jsTwoWeapon.innerHTML = playerTwo.weapon.name
  jsTwoWeaponPower.innerHTML = playerTwo.weapon.power
}

function checkWin() {
  console.log('pOne', playerOne.healthscore)
  console.log('pTwo', playerTwo.healthscore)

  if (playerOne.healthscore <= 0) {
    board.innerHTML = `
    <p class="win">Player Two won</p>
    <p>Player One lost</p>
    <button class="restart">Play again</button>`
    $('.restart').click(function () {
      location.reload();
    });

  } else if (playerTwo.healthscore <= 0) {
    board.innerHTML = `
    <p class="win">Player One won</p>
    <p>Player Two lost</p>
    <button class="restart">Play again</button>`
    $('.restart').click(function () {
      location.reload();
    });

  } else {
    setTimeout(() =>
      fightArena.classList.add('hidden'), 2000)
  }
}

/* -------------------------  helper functions ------------------------ */

// function showWay() {
//   let currentRow = activePlayer.position.row
//   let currentColumn = activePlayer.position.column

//   // show way south
//   for (let i = 0; i < 3; i++) {
//     // if square does not have class .free
//     if (!$(`[data-row= "${currentRow}"][data-column="${currentColumn + i}"]`).hasClass('free')) {
//       console.log(`south ${i} not free`)
//       // return out of for loop
//     } else {
//       $(`[data-row= "${currentRow}"][data-column="${currentColumn + i}"]`).addClass('possible')
//     }
//     // check next direction
//   }

//   // show way north
//   for (let i = 3; i >= 0; i--) {
//     // if square does not have class .free
//     if (!$(`[data-row= "${currentRow}"][data-column="${currentColumn - i}"]`).hasClass('free')) {
//       console.log('not free')
//       // return out of for loop
//     } else {
//       $(`[data-row= "${currentRow}"][data-column="${currentColumn - i}"]`).addClass('possible')
//     }
//   }

//   // show way west
//   for (let i = 0; i <= 3; i++) {
//     // if square does not have class .free
//     if (!$(`[data-row= "${currentRow + i}"][data-column="${currentColumn}"]`).hasClass('free')) {
//       console.log('not free')
//       // return out of for loop
//     } else {
//       $(`[data-row= "${currentRow + i}"][data-column="${currentColumn}"]`).addClass('possible')
//     }
//   }

//   // show way east
//   for (let i = 3; i >= 0; i--) {
//     // if square does not have class .free
//     if (!$(`[data-row= "${currentRow - i}"][data-column="${currentColumn}"]`).hasClass('free')) {
//       console.log('not free')
//       // return out of for loop
//     } else {
//       $(`[data-row= "${currentRow - i}"][data-column="${currentColumn}"]`).addClass('possible')
//     }
//   }
// }


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

// switches the activePlayer
function switchPlayers() {
  if (activePlayer === playerOne) {
    activePlayer = playerTwo
    // showWay()
    $('.js-playerTwo_fight').addClass('active')
    $('.js-playerOne_fight').removeClass('active')

    console.log('activePlayer', activePlayer.name)
  } else {
    activePlayer = playerOne
    // showWay()
    $('.js-playerOne_fight').addClass('active')
    $('.js-playerTwo_fight').removeClass('active')
    console.log('activePlayer', activePlayer.name)
  }
}

renderBoard()