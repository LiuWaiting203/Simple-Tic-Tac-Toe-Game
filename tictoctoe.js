// 定義X和O的class
const X_CLASS = 'x';
const O_CLASS = 'o';

// 定義勝利的組合
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // 橫排
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // 直排
  [0, 4, 8], [2, 4, 6] // 斜排
]

// 取得html裡的元素
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const reBtn = document.getElementById('reBtn');
const xWinsEle = document.getElementById('xWins');
const oWinsEle = document.getElementById('oWins');
const currentPlayerID = document.getElementById('currentPlayerID');

let oTurn // 判斷是O還是X的回合

let xWins = 0 // X勝利次數
let oWins = 0 // O勝利次數

startGame() // 開始遊戲
loadWins() // 載入勝利次數

reBtn.addEventListener('click', startGame) // 重新開始遊戲

// 開始遊戲
function startGame() {
  console.log('遊戲開始');
  oTurn = false // 預設是X的回合
  setCurrentPlayerDisplay()
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS)
    cell.classList.remove(O_CLASS)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true }) // 點擊一次後就不能再點
  })
  setBoardHoverClass()
}

// 放置O或X
function handleClick(e) {
  const cell = e.target
  const currentClass = oTurn ? O_CLASS : X_CLASS // 判斷是O還是X
  placeMark(cell, currentClass) // 放置O或X
  // 判斷是否勝利
  if (checkWin(currentClass)) {
    endGame(false, currentClass)
  } else if (isDraw()) {
    endGame(true)
  } else {
    swapTurns()
    setBoardHoverClass()
    setCurrentPlayerDisplay()
  }
}

// 結束遊戲
function endGame(draw, currentClass) {
  if (draw) {
    alert('平手')
  } else {
    alert(`${currentClass === O_CLASS ? "O" : "X"}勝利`)
    updateWins(currentClass)
  }
  // 清除所有格子的事件
  cellElements.forEach(cell => {
    cell.removeEventListener('click', handleClick)
  })
  // 延遲1秒後重新開始遊戲
  setTimeout(startGame, 1000)
}

// 檢查是否平局
function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS) // 所有的cell都有X或O
  })
}

// 放置O或X
function placeMark(cell, currentClass) {
  console.log('放置標記');
  cell.classList.add(currentClass)
}

// 換回合
function swapTurns() {
  oTurn = !oTurn
}

// 設定hover的class
function setBoardHoverClass() {
  board.classList.remove(X_CLASS)
  board.classList.remove(O_CLASS)
  if (oTurn) {
    board.classList.add(O_CLASS)
  } else {
    board.classList.add(X_CLASS)
  }
}

// 檢查是否勝利
function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass) // 有一組合符合就回傳true
    })
  })
}

// 更新勝利次數然後計入在localStorage
function updateWins(currentClass) {
  if (currentClass === X_CLASS) {
    xWins++
    xWinsEle.textContent = xWins
  } else {
    oWins++
    oWinsEle.textContent = oWins
  }
  localStorage.setItem('xWins', xWins)
  localStorage.setItem('oWins', oWins)
}

// 從localStorage裡載入勝利次數
function loadWins() {
  const storedXWins = localStorage.getItem('xWins')
  const storedOWins = localStorage.getItem('oWins')
  if (storedXWins !== null) {
    xWins = parseInt(storedXWins)
    xWinsEle.textContent = xWins
  }
  if (storedOWins !== null) {
    oWins = parseInt(storedOWins)
    oWinsEle.textContent = oWins
  }
}

// 設定當前玩家的顯示
function setCurrentPlayerDisplay() {
  if (oTurn) {
    currentPlayerID.textContent = 'O'
    currentPlayerID.style.color = 'blue'
  } else {
    currentPlayerID.textContent = 'X'
    currentPlayerID.style.color = 'red'
  }
}