const squaresArray = []
const numOfBlockedSquaresArray = []

function createSquaresArray() {
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      let square = { row: x, column: y, state: 'free' }

      squaresArray.push(square)
    }
  }
}

function renderField() {
  blockSquares()
  const gridContainer = document.getElementById('game')
  squaresArray.map(obj => {
    let gridItem = document.createElement('div')
    gridItem.classList.add('grid-item')
    gridItem.innerHTML = 'S'
    if (obj.state === 'blocked') {
      gridItem.classList.add('blocked')
    } else {
      gridItem.classList.add('free')
    }
    gridItem.setAttribute('row', obj.row, 'column', obj.column)

    gridContainer.appendChild(gridItem)
  })
}

function createRandomNumber(min, max) {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min

  return randomNumber
}

function blockSquares(obj, index) {
  let numOfBlockedSquares = createRandomNumber(4, 12)
  console.log(numOfBlockedSquares)

  for (i = 0; i < numOfBlockedSquares; i++) {
    squaresArray[createRandomNumber(0, squaresArray.length)].state = 'blocked'
  }
}

createSquaresArray()
renderField()
