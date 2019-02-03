const squaresArray = []

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

    if (square.state != 'free' || edge) {
      this.placePlayer()
    } else if (!checkIfPathFree(square)) {
      square.state = this.name
      this.position = { row: square.row, column: square.column }
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

let activePlayer = playerOne

/* ---------------------------------- Functions ------------------------------------ */

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
  playerOne.placePlayer()
  playerTwo.placePlayer()
  hammer.placeWeapon()
  hammer.placeWeapon()
  hammer.placeWeapon()
  hammer.placeWeapon()

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

// Eventlistener in grid-items
$('.grid-container').on('click', '.grid-item', function() {
  movePlayer($(this))
})

function movePlayer($this) {
  let squareCheck = checkBlockedSquares($this)
  console.log('squareCheck', squareCheck)

  if (checkPlayerPath(activePlayer, $this) /*&& squareCheck)*/) {
    $(`.${activePlayer.name}`)
      .addClass('free')
      .removeClass(`${activePlayer.name}`)
    // $this jquery-Node that was clicked
    $this.removeClass('free').addClass(`${activePlayer.name}`)

    activePlayer.position = {
      row: $this[0].attributes['data-row'].value,
      column: $this[0].attributes['data-column'].value,
    }
  } else {
    alert('you cannot move more than 3 squares at a time')
  }
  //startFight($this, activePlayer)
  //collectWeapon($this, player)
  checkWin()
  switchPlayers()
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
    } else {
      return false
    }
  }
}

function checkPlayerPath(player, $clickedSquare) {
  let playerRow = player.position.row
  let playerColumn = player.position.column

  let squareColumn = $clickedSquare.attr('data-column')
  let squareRow = $clickedSquare.attr('data-row')

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



// function checkDistance(distance, squareCheck, direction) {
//   console.log(
//     'squareCheck',
//     squareCheck,
//     'distance',
//     distance,
//     'direction',
//     direction,
//   )
//
//   if (direction === 'northSouth') {
//     for (let i = 0; i <= distance; i++) {
//       let isBlocked = $(
//         '[data-row=' +
//           (activePlayer.position.row - i) +
//           '][data-column=' +
//           activePlayer.position.column +
//           ']',
//       ).hasClass('blocked')
//       console.log('isBlocked', isBlocked)
//       if (isBlocked) {
//         console.log(
//           activePlayer.name,
//           `cannot move, path ${direction} not free`,
//         )
//         alert('path not free - try again')
//         squareCheck = true
//         console.log(squareCheck)
//         return true
//       } else {
//         squareCheck = false
//         console.log('test')
//       }
//     }
//   } else if (direction === 'eastWest') {
//     for (let i = 0; i <= distance; i++) {
//       if (
//         $(
//           '[data-column' +
//             (activePlayer.position.column - i) +
//             '][data-row=' +
//             activePlayer.position.row +
//             ']',
//         ).hasClass('blocked') ||
//         $(
//           '[data-column' +
//             (activePlayer.position.column + i) +
//             '][data-row=' +
//             activePlayer.position.row +
//             ']',
//         ).hasClass('blocked')
//       ) {
//         console.log(
//           activePlayer.name,
//           `cannot move, path ${direction} not free`,
//         )
//         alert('path not free - try again')
//         squareCheck = true
//         console.log(squareCheck)
//         return squareCheck
//       }
//     }
//   } else {
//     console.log('checkDistance: free path')
//   }
// }

function checkBlockedSquares($clickedSquare) {

  let squareCheck = false

  let playerRow = activePlayer.position.row
  let playerColumn = activePlayer.position.column

  let squareColumn = $clickedSquare.attr('data-column')
  let squareRow = $clickedSquare.attr('data-row')

  const northSouth = squareRow - playerRow //7 - 5 = -2
  const eastWest = squareColumn - playerColumn

  // if (northSouth >= 1 && eastWest === 0) {
  //   checkDistance(northSouth, squareCheck, 'northSouth')
  // } else if (eastWest >= 1 && northSouth === 0) {
  //   checkDistance(eastWest, squareCheck, 'eastWest')
  // }

  let traversedSquares = [];
    //if traveling north, create an array of traversed squares
    if(eastWest === 0 && parseInt(northSouth) <= 3) {
      // console.log('moving northSouth');
      if(northSouth >= 0) { //down
        // console.log('moiving down');

        //need to create an array of traversed squaresArray
        for(let i = 0; i < northSouth; i++) {
          let thisSquare =  { thisRow: playerRow + i, thisColumn: playerColumn };
          console.log('thisSquare', thisSquare);
          traversedSquares.push(thisSquare);
          console.log('traversedSquares', traversedSquares);
        }

      } else if (northSouth < 0){ //up
        // console.log('moving up');

      }
          ///call move player, passit traversedSquares
    } else if (northSouth === 0 && parseInt(eastWest) <= 3) { //else if traveling south, create an array of traversed squares
      // console.log('moving east west');
      if(eastWest >= 0) { //east

      } else if(eastWest < 0) { //west

      }
          ///call move player
    } else { console.log('moving incorrectly: more than 3 squares or vertically');}
    ///call move player

}




//function to check this array for blocked squares
let isBlocked = false;
for(//iterate over traversedarray) {
  $(["data-row"+traversedarray[i]][]).hasClass(''blocked')
  isBlocked = true
}

//return isBlocked

//Inside of Player moves function, run funciton to check blocked squares, if and only if it returns false , do you run the code that actually switches the location of the player in the HTML and player object.

//if blocked, no moves
//else move









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

//check if target square containes a weapon and if so adds it to the weapon key in player object
// function collectWeapon($clickedSquare, player) {
//   if ($clickedSquare.hasClass('hammer')) {
//     player.weapon = 'hammer'
//     console.log('player weapon', player)
//     $clickedSquare.removeClass('hammer').addClass('free')
//     console.log('player colltects weapon', player)
//   } else {
//     console.log('no weapon')
//   }
// }

// function startFight($clickedSquare, player) {
//   if (player.name === 'playerOne') {
//     activePlayer = playerOne
//     passivePlayer = playerTwo
//     console.log(activePlayer)
//   } else {
//     activePlayer = playerTwo
//     passivePlayer = playerOne
//     console.log(activePlayer)
//   }
//   console.log($clickedSquare)
//   if ($clickedSquare.hasClass('free') || $clickedSquare.hasClass('hammer')) {
//     console.log('no fight')
//     return
//   } else {
//     console.log(activePlayer, 'starts fight')
//     return
//   }
//}

createSquaresArray()
renderBoard()
