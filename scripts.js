const squaresArray = []
let activePlayer = 'playerOne'

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
console.log(squaresCounter)
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
    console.log('end of iteration')
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

function movePlayer(player, $this) {
  // find html entity with old position
  $(`.${player}`)
    .addClass('free')
    .removeClass(player)
  // $this jquery-Node that was clicked
  $this.removeClass('free').addClass(player)

  checkWin()
}

$('.grid-container').on('click', '.grid-item', function() {
  movePlayer(activePlayer, $(this))
})

function checkWin() {
  let win = false
  let lost = false

  if (win) {
    console.log('player wins')
  } else if (lost) {
    console.log('player lost')
  } else {
    if (activePlayer === 'playerOne') {
      activePlayer = 'playerTwo'
      console.log('activePlayer', activePlayer)
    } else {
      activePlayer = 'playerOne'
      console.log('activePlayer', activePlayer)
    }
  }
}

// -------- TODO: add position to players
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

    console.log('player', square)

    if (square.state != 'free' || edge) {
      randomSquare
      console.log('square is blocked')
      this.placePlayer()
    } else if (!checkIfPathFree(square)) {
      console.log('path free')
      // console.log('state', square.state)
      square.state = this.name
      this.position = square
      console.log('positon', this.position)
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
      console.log('square is blocked')
      this.placeWeapon()
    } else if (!checkIfPathFree(square)) {
      console.log('path free')
      // console.log('state', square.state)
      square.state = this.name
      this.position = square
    }
  }
}

const playerOne = new Player('playerOne', 'image', 100, 'hammer')
const playerTwo = new Player('playerTwo', 'image', 100, 'hammer')
const hammer = new Weapon('hammer', 'image', 10)

// -------------  helper functions -------------

function createRandomNumber(min, max) {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
  return randomNumber
}

// function checkIfFree(obj) {
//   //console.log('obj', obj)
//   let row = obj.row
//   let col = obj.column
//   let state = obj.state
//   let counter = 0
//   //console.log('my object', row, col, state)
//   for (let i = 0; i < squaresArray.length; i++) {
//     let east = squaresArray[i].column === col && squaresArray[i].row === row + 1
//     let west = squaresArray[i].column === col && squaresArray[i].row === row - 1
//     let south =
//       squaresArray[i].column === col - 1 && squaresArray[i].row === row
//     let north =
//       squaresArray[i].column === col + 1 && squaresArray[i].row === row
//     if (
//       (north.state === 'free' && east.state === 'free') ||
//       (north.state === 'free' && west.state === 'free') ||
//       (south.state === 'free' && east.state === 'free') ||
//       (south.state === 'free' && west.state === 'free')
//     ) {
//       if (squaresArray[i].state === 'blocked') {
//         console.log('sqauresArray', squaresArray[i])
//         counter++
//         console.log(counter, 'blocked')
//         if (counter > 1) {
//           return false
//         }
//       }
//     }
//   }
//   return true
// }

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

createSquaresArray()
renderBoard()

// if (
//   squaresArray.find(isSouth).state === 'free' &&
//   squaresArray.find(isEast).state === 'free'
// ) {
//   console.log('row: 1, col: 1')
//   return true
// }
//   } else if (square.row === 1 && square.column === 10) {
//   if (
//     squaresArray.find(isSouth).state === 'free' &&
//     squaresArray.find(isWest).state === 'free'
//   ) {
//     console.log('row: 1, col: 10')
//     return true
//   }
// } else if (square.row === 10 && square.column === 1) {
//   if (
//     squaresArray.find(isNorth).state === 'free' &&
//     squaresArray.find(isEast).state === 'free'
//   ) {
//     console.log('row: 10, col: 1')
//     return true
//   } else if (square.row === 10 && square.column === 10) {
// if (
//   squaresArray.find(isNorth).state === 'free' &&
//   squaresArray.find(isEast).state === 'free'
// ) {
//   console.log('row: 10, col: 10')
//   return true
// }
//   }
