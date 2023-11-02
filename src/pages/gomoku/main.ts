export const state = ref<GomokuBlockState[][]>([])
export const currentPlayer = ref<GomokuUserType>('black')
export const gameState = ref<'play' | 'over'>('play')
export const winner = ref<GomokuUserType>('')

export function generateMap() {
  state.value = Array.from({ length: 15 }, (_, y) =>
    Array.from({ length: 15 },
      (_, x): GomokuBlockState => ({ x, y, used: false, user: '' }),
    ),
  )
}

export function checkGameState() {
  let count = 0
  // l t r
  for (let y = 0; y < state.value.length; y++) {
    count = 0
    for (let x = 0; x < state.value[y].length; x++) {
      if (!state.value[y][x].used) {
        count = 0
      }
      else {
        count++
        if (count === 1) {
          winner.value = state.value[y][x].user
        }
        else if (state.value[y][x].user !== state.value[y][x - 1].user) {
          count = 1
        }
        else if (count >= 5) {
          gameState.value = 'over'
          return
        }
      }
    }
  }
  // t t b
  for (let x = 0; x < state.value.length; x++) {
    count = 0
    for (let y = 0; y < state.value[x].length; y++) {
      if (!state.value[y][x].used) {
        count = 0
      }
      else {
        count++
        if (count === 1) {
          winner.value = state.value[y][x].user
        }
        else if (state.value[y][x].user !== state.value[y - 1][x].user) {
          count = 1
        }
        else if (count >= 5) {
          gameState.value = 'over'
          return
        }
      }
    }
  }
  // lt t rb
  for (let y = 0; y < state.value.length; y++) {
    count = 0
    for (let x = 0; x < state.value[y].length; x++) {
      for (let j = x, k = y; j < state.value[y].length && k < state.value.length; j++) {
        if (!state.value[k][j].used) {
          count = 0
        }
        else {
          count++
          if (count === 1) {
            winner.value = state.value[k][j].user
          }
          else if (state.value[k][j].user !== state.value[k - 1][j - 1].user) {
            count = 1
          }
          else if (count >= 5) {
            gameState.value = 'over'
            return
          }
        }
        k++
      }
    }
  }
  // rt t lb
  for (let y = 0; y < state.value.length; y++) {
    count = 0
    for (let x = state.value[y].length - 1; x >= 0; x--) {
      for (let j = x, k = y; j >= 0 && k < state.value.length; j--) {
        if (!state.value[k][j].used) {
          count = 0
        }
        else {
          count++
          if (count === 1) {
            winner.value = state.value[k][j].user
          }
          else if (state.value[k][j].user !== state.value[k - 1][j + 1].user) {
            count = 1
          }
          else if (count >= 5) {
            gameState.value = 'over'
            return
          }
        }
        k++
      }
    }
  }
}

export function reset() {
  winner.value = ''
  gameState.value = 'play'
  currentPlayer.value = 'black'
  generateMap()
}
