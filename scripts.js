const squaresArray = []

//Create an array of object with coordinates
function createSquaresArray() {
  for (let x = 1; x < 11; x++) {
    for (let y = 1; y < 11; y++) {
      let square = { row: x, column: y, state: 'free' }

      squaresArray.push(square)
    }
  }
}

// Use objects from SquaresArray to render the board
let squaresCounter = createRandomNumber(10, 20)
// console.log(squaresCounter)

// function blockSquares() {
//   let row = createRandomNumber(1, 10)
//   let column = createRandomNumber(1, 10)
//   let square = $("[data-row=" + row + "][data-col=" + column + "]").hasClass('free')
//   console.log('square', square)

// }
function blockSquares() {
  // console.log('start of iteration', squaresCounter)
  let num = createRandomNumber(0, squaresArray.length - 1)
  let square = squaresArray[num]
  // console.log('square, square.state', square, square.state)
  let check = checkIfPathFree(square)
  let checkAll = squaresArray.map(square => checkIfPathFree(square))

  // console.log('check', check)
  // console.log(squaresArray[num])
  if (squaresCounter >= 1) {
    // console.log('inside outter if');
    if (square.state === 'blocked') {
      // console.log('already blocked')
      blockSquares()
    } else if (check) {
      // console.log('path not free', squaresCounter, square)
      blockSquares()
    } else if (checkAll) {
      // console.log('>>>>>>>>>>>>squaresCounter', squaresCounter)
      square.state = 'blocked'
      squaresCounter--
      // console.log('>>>>>>>>>>>>squaresCounter', squaresCounter)
      // square.state = 'blocked'
      blockSquares()
    }
  } else {
  }
}

function renderBoard() {
  blockSquares()
  playerOne.placePlayer()
  playerTwo.placePlayer()
  hammer.placeWeapon()
  hammer.placeWeapon()
  hammer.placeWeapon()
  hammer.placeWeapon()
  // movePlayer(playerOne)

  const gridContainer = document.getElementById('game')
  squaresArray.map(obj => {
    let gridItem = document.createElement('div')
    gridItem.classList.add('grid-item')
    gridItem.innerHTML = squaresArray.indexOf(obj)
    gridItem.classList.add(obj.state)

    gridItem.setAttribute('data-row', obj.row)
    gridItem.setAttribute('data-column', obj.column)

    gridContainer.appendChild(gridItem)
  })
}

function movePlayer(activePlayer, $this) {
  let player = activePlayer

  checkPlayerPath(player, $this)
  checkBlockedSquares(player, $this)
  if (checkPlayerPath(player, $this)) {
    $(`.${player.name}`)
      .addClass('free')
      .removeClass(`${player.name}`)
    // $this jquery-Node that was clicked
    $this.removeClass('free').addClass(`${player.name}`)

    player.position = {
      row: $this[0].attributes['data-row'].value,
      column: $this[0].attributes['data-column'].value,
    }
    console.log(player.position)
  } else {
    alert('you cannot move more than 3 squares at a time')
  }
  // startFight($this, activePlayer)
  // collectWeapon($this, player)
  checkWin()
  switchPlayers()
}

// Eventlistener in grid-items
$('.grid-container').on('click', '.grid-item', function() {
  movePlayer(activePlayer, $(this))
})

class Player {
  constructor(name, image, healthscore, weapon, position) {
    this.name = name
    this.image = image
    this.healthscore = healthscore
    this.weapon = weapon
    this.position = position
  }

  placePlayer() {
    let randomSquare = createRandomNumber(0, squaresArray.length - 1)
    let square = squaresArray[randomSquare]

    const edge =
      square.row === 1 ||
      square.column === 1 ||
      square.row === 10 ||
      square.column === 10

    // console.log('player', square)

    if (square.state != 'free' || edge) {
      randomSquare
      // console.log('square is blocked')
      this.placePlayer()
    } else if (!checkIfPathFree(square)) {
      // console.log('path free')
      // console.log('state', square.state)
      square.state = this.name
      this.position = { row: square.row, column: square.column }
      // console.log('this', this)
      // console.log('position', this.position)
    }
  }
}

class Weapon {
  constructor(name, image, power, position) {
    ;(this.name = name),
      (this.power = power),
      (this.position = position),
      (this.image = image)
  }

  placeWeapon() {
    let randomSquare = createRandomNumber(0, squaresArray.length - 1)
    let square = squaresArray[randomSquare]

    const edge =
      square.row === 1 ||
      square.column === 1 ||
      square.row === 10 ||
      square.column === 10

    if (square.state != 'free' || edge) {
      randomSquare
      this.placeWeapon()
    } else if (!checkIfPathFree(square)) {
      square.state = this.name
      this.position = square
    }
  }
}

const playerOne = new Player('playerOne', 'image', 100, 'knife')
const playerTwo = new Player('playerTwo', 'image', 100, 'knife')
const hammer = new Weapon('hammer', 'image', 10)
const gun = new Weapon('gun', 'image', 80)
const knife = new Weapon('knife', 'image', 50)

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
    } else {
      return false
    }
  }
}

function checkPlayerPath(player, clickedSquare) {
  let playerRow
  let playerColumn

  let squareColumn = clickedSquare.attr('data-column')
  let squareRow = clickedSquare.attr('data-row')

  if (player === playerOne) {
    playerRow = playerOne.position.row
    playerColumn = playerOne.position.column
  } else {
    playerRow = playerTwo.position.row
    playerColumn = playerTwo.position.column
  }

  const northSouth = Math.abs(squareRow - playerRow)
  const eastWest = Math.abs(squareColumn - playerColumn)
  console.log('NS', northSouth, 'EW', eastWest)

  if (
    (northSouth <= 3 && eastWest === 0) ||
    (northSouth === 0 && eastWest <= 3)
  ) {
    console.log(`${player.name} moves`)
    return true
  } else {
    console.log(`${player.name} cannot move`)
    return false
  }
}

function checkWin() {
  let win = false
  let lost = false

  if (win) {
    console.log('wins')
    return 'win'
  }

  if (lost) {
    console.log('lost')
    return 'lost'
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

function checkBlockedSquares(player, clickedSquare) {
  let playerRow
  let playerColumn

  let squareColumn = clickedSquare.attr('data-column')
  let squareRow = clickedSquare.attr('data-row')

  if (player === playerOne) {
    playerRow = playerOne.position.row
    playerColumn = playerOne.position.column
  } else {
    playerRow = playerTwo.position.row
    playerColumn = playerTwo.position.column
  }

  const north = Math.abs(squareRow - playerRow)
  const south = Math.abs(squareRow - playerRow)
  const east = Math.abs(squareColumn - playerColumn)
  const west = Math.abs(squareColumn - playerColumn)

  if (north >= 1) {
    console.log('player moving north')
    for (let i = 0; i <= north; i++) {
      if (
        $(
          '[data-row=' +
            (playerColumn - i) +
            '][data-column=' +
            player.position.row +
            ']',
        ).hasClass('blocked')
      ) {
        console.log(activePlayer.name, 'cannot move, path north not free')
      } else {
        console.log('free path')
      }
    }
  } else if (south >= 1) {
    for (let i = 0; i <= south; i++) {
      if (
        $(
          '[data-row=' +
            (playerColumn - i) +
            '][data-column=' +
            player.position.row +
            ']',
        ).hasClass('blocked')
      ) {
        console.log('path not free')
      } else {
        console.log('path free')
      }
    }
  }
}

// check if target square containes a weapon and if so adds it to the weapon key in player object
// function collectWeapon(clickedSquare, player) {
//   let playerNow = player

//   if (playerNow === 'playerOne') {
//     playerNow = playerOne
//   } else {
//     playerNow = playerTwo
//   }
//   console.log(playerNow)
//   console.log(clickedSquare)

//   if (clickedSquare.hasClass('hammer')) {
//     playerNow.weapon = 'hammer'
//     console.log('player weapon', playerNow)
//     clickedSquare.removeClass('hammer').addClass('free')
//   } else {
//     console.log('no weapon')
//   }
// }

// function startFight(clickedSquare, player) {
//   let playerActiveNow = player
//   // console.log('active player: ', playerActiveNow)
//   // console.log(clickedSquare)

//   if (playerActiveNow === 'playerOne') {
//     playerActiveNow = playerOne
//     passivePlayer = playerTwo
//     console.log(playerActiveNow)
//   } else {
//     playerActiveNow = playerTwo
//     passivePlayer = playerOne
//     console.log(playerActiveNow)
//   }

//   if (clickedSquare.hasClass('free') || clickedSquare.hasClass('hammer')) {
//     console.log('no fight')
//     return
//   } else {
//     console.log(playerActiveNow, 'starts fight')
//     return
//   }
// }

let activePlayer = playerOne

createSquaresArray()
renderBoard()
