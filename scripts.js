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
    gridItem.setAttribute('row', obj.row, 'column', obj.column)

    gridContainer.appendChild(gridItem)
  })
}

function blockSquares() {
  let numOfBlockedSquares = createRandomNumber(10, 20)
  console.log('num of squares', numOfBlockedSquares)
  let i = 0
  for (i; i < numOfBlockedSquares; i++) {
    let num = createRandomNumber(0, squaresArray.length - 1)
    if (squaresArray[num].state === 'blocked') {
      console.log('taken', i)
      i--
    } else {
      squaresArray[num].state = 'blocked'
    }
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

  console.log(row, col, state)

  let newObj = { row: row + 2, column: col }

  console.log(newObj)

  // switch (num) {
  //   case row === 1:
  //     return (
  //       (squaresArray[num + 10].state === 'free' &&
  //         squaresArray[num + 1].state === 'free') ||
  //       (squaresArray[num + 10].state === 'free' &&
  //         squaresArray[num - 1].state === 'free') ||
  //       (squaresArray[num + 1].state === 'free' &&
  //         squaresArray[num - 1].state === 'free')
  //     )
  //   case num > 10:
  //     return (
  //       (squaresArray[num - 10].state === 'free' &&
  //         squaresArray[num + 1].state === 'free') ||
  //       (squaresArray[num - 10].state === 'free' &&
  //         squaresArray[num - 1].state === 'free') ||
  //       (squaresArray[num + 1].state === 'free' &&
  //         squaresArray[num - 1].state === 'free')
  //     )
  // }
}

createSquaresArray()
renderBoard()
checkIfFree(squaresArray[1])
