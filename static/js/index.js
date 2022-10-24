const gameNode = document.getElementById('game');
const containerNode = document.getElementById('gemPuzzle');
const itemNodes = Array.from(containerNode.querySelectorAll('.item'));
const countItems = 16;

/*********/
itemNodes[countItems -1].style.display = 'none';

let matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
setLocationItems(matrix);

function getMatrix(arr) {
  const matrix = [[], [], [], []];
  let y = 0;
  let x = 0;

  for (let i =0; i < arr.length; i++) {
    if (x >= 4) {
      y++;
      x = 0;
    }
    matrix[y][x] = arr[i];
    x++;
  }
  return matrix;
}

function setLocationItems(matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const value = matrix[y][x];
      const node = itemNodes[value - 1];
      setNodeStyles(node, x, y);
    }
  }
}

function setNodeStyles(node, x, y) {
  const shiftPs = 100;
  node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%, 0)`;
}


const maxShuffleCount = 50;
let timer;
const shuffledClassName = 'gameShuffle';
document.getElementById('shuffle').addEventListener('click', () => {
  //randomSwap(matrix);
  //setLocationItems(matrix);

  let shuffleCount = 0;
  clearInterval(timer);
  gameNode.classList.add(shuffledClassName);

  if (shuffleCount === 0) {
    timer = setInterval(() => {
      randomSwap(matrix);
      setLocationItems(matrix);

      shuffleCount += 1;

      if (shuffleCount >= maxShuffleCount) {
        gameNode.classList.remove(shuffledClassName);
        clearInterval(timer);
      }
    }, 10);
  }
})

let blockCoords = null;
function randomSwap(matrix) {
  const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
  const validCoords = findValidCoords({
    blankCoords,
    matrix
  })

  const swapCoords = validCoords[
    Math.floor(Math.random() * validCoords.length)
  ];
  swap(blankCoords, swapCoords, matrix);
  blockCoords = blankCoords;
}
function findValidCoords({blankCoords, matrix, blockCoords}) {
  const validCoords = [];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (isValidForSwap({x, y}, blankCoords)) {
        if (!blockCoords || (
          blockCoords.x === x && blankCoords.y === y
        )) {
        validCoords.push({x, y});
        }
      }
    }
  }
  return validCoords;
}

/*********/
const blankNumber = 16;
let move = 0;
containerNode.addEventListener('click', (event) => {
  move +=1;
  console.log(move);
  const buttonNode = event.target.closest('button');
  if (!buttonNode) {
    return move;
  }
  const buttonNumber = Number(buttonNode.dataset.matrixId);
  const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix);
  const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
  const isValid = isValidForSwap(buttonCoords, blankCoords);
  if (isValid) {
    swap(blankCoords, buttonCoords, matrix);
    setLocationItems(matrix);
  }
})

function findCoordinatesByNumber(number, matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === number) {
        return {x, y};
      }
    }
  }
  return null;
}

function isValidForSwap(coords1, coords2) {
  const diffX = Math.abs(coords1.x - coords2.x);
  const diffY = Math.abs(coords1.y - coords2.y);
  return (diffX === 1 || diffY === 1) && (coords1.x === coords2.x || coords1.y === coords2.y);
}

function swap(coords1, coords2, matrix) {
  const coords1Number = matrix[coords1.y][coords1.x];
  matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
  matrix[coords2.y][coords2.x] = coords1Number;

  if (isWon(matrix)) {
    addWonClass();
  }
}

const winFlatArr = new Array(16).fill(0).map((_item, i) => i + 1);
function isWon(matrix) {
  const flatMatrix = matrix.flat();
  for (let i = 0; i < winFlatArr.length; i++) {
    if (flatMatrix[i] !== winFlatArr[i]) {
      return false;
    }
  }
  return true;
}

const wonClass = 'gemPuzzleWon';
function addWonClass () {
  setTimeout(() => {
    containerNode.classList.add(wonClass);
    alert('Hooray! You solved the puzzle!')

    setTimeout(() => {
      containerNode.classList.remove(wonClass);
    }, 1000);
  }, 200);
}

/********/
window.addEventListener('keydown', (event) => {
  if (!event.key.includes('Arrow')) {
    return;
  }
  const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
  const buttonCoords = {
    x: blankCoords.x,
    y: blankCoords.y,
  };

  const direction = event.key.split('Arrow')[1].toLowerCase();
  const maxIndexMatrix = matrix.length;

  switch (direction) {
    case 'up':
      buttonCoords.y += 1;
      break;
    case 'down':
      buttonCoords.y -= 1;
      break;
    case 'left':
      buttonCoords.x += 1;
      break;
    case 'right':
      buttonCoords.x -= 1;
      break;
  }

  if (buttonCoords.y >= maxIndexMatrix || buttonCoords.y < 0 || buttonCoords.x >= maxIndexMatrix || buttonCoords.x < 0) {
    return;
  }

  swap(blankCoords, buttonCoords, matrix);
  setLocationItems(matrix);
})

const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
const buttons = document.querySelectorAll(".item");

buttons.forEach(button => {
  button.addEventListener("click", () => {
  audio.play();
  });
});

document.getElementById('move').textContent = `Moves: ${move}`;

let time = 0;
document.getElementById('time').textContent = `Time: ${time}`;
