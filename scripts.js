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
// console.log('squaresCounter', squaresCounter)

function blockSquares() {
  let num = createRandomNumber(0, squaresArray.length - 1)
  // console.log('num', num)
  let square = squaresArray[num]
  // console.log('square, square.state', square, square.state)
  let check = checkIfFree(square)
  // console.log('check', check)
  // console.log(squaresArray[num])
  if (squaresCounter >= 1) {
    // console.log('inside outter if');
    if (square.state === 'blocked') {
      console.log('taken')
      blockSquares()
    } else if (!check) {
      console.log('path not free')
      blockSquares()
    } else {
      // console.log('>>>>>>>>>>>>squaresCounter', squaresCounter)
      square.state = 'blocked'
      squaresCounter--
      // console.log('>>>>>>>>>>>>squaresCounter', squaresCounter)
      square.state = 'blocked'
      blockSquares()
    }
  } else {
    console.log('no more squares to place')
  }
}

function renderBoard() {
  blockSquares()
  const gridContainer = document.getElementById('game')
  squaresArray.map(obj => {
    let gridItem = document.createElement('div')
    gridItem.classList.add('grid-item')
    gridItem.innerHTML = squaresArray.indexOf(obj)

    if (obj.state === 'blocked') {
      gridItem.classList.add('blocked')
    } else {
      gridItem.classList.add('free')
    }
    gridItem.setAttribute('data-row', obj.row)
    gridItem.setAttribute('data-column', obj.column)

    gridContainer.appendChild(gridItem)
  })
}

// -------------  helper functions -------------

function createRandomNumber(min, max) {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
  return randomNumber
}

function checkIfFree(obj) {
  console.log('obj', obj)
  let row = obj.row
  let col = obj.column
  let state = obj.state
  let counter = 0
  //console.log('my object', row, col, state)

  for (let i = 0; i < squaresArray.length; i++) {
    let east = squaresArray[i].column === col && squaresArray[i].row === row + 1
    let west = squaresArray[i].column === col && squaresArray[i].row === row - 1
    let south =
      squaresArray[i].column === col - 1 && squaresArray[i].row === row
    let north =
      squaresArray[i].column === col + 1 && squaresArray[i].row === row

    if (east || west || south || north) {
      if (squaresArray[i].state === 'blocked') {
        counter++
        console.log(counter, 'blocked')
        if (counter > 1) {
          return false
        }
      }
    }
  }
  return true
}

createSquaresArray()
renderBoard()
