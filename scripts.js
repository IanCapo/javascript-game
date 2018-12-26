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
function renderBoard() {
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

let squaresCounter = createRandomNumber(10, 20)
let counter = 0
function blockSquares(squaresCounter) {
  if (counter > squaresCounter) {
    let check = checkIfFree(
      squaresArray[createRandomNumber(0, squaresArray.length)],
    )
    let num = createRandomNumber(0, squaresArray.length - 1) // recheck
    console.log(check)
    // console.log(squaresArray[num])
    if (squaresArray[num].state === 'blocked') {
      console.log('taken', i)
      blockSquares(squaresCounter)
    } else if (!check) {
      console.log('path not free')
      blockSquares(squaresCounter)
    } else {
      console.log(squaresCounter)
      squaresArray[num].state = 'blocked'
      // squaresCounter--
      counter++
    }
  } else {
    console.log('not working')
  }
}

// -------------  helper functions -------------

function createRandomNumber(min, max) {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
  return randomNumber
}

function checkIfFree(obj) {
  let row = obj.row
  let col = obj.column
  let state = obj.state
  let counter = 0
  console.log('my object', row, col, state)

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
blockSquares(squaresCounter)
