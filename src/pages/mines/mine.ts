import {
  directions,
  gameConfig,
  gameLevel,
  state,
} from './main'

export function generateMines(state: BlockState[][], initial: BlockState, length: number) {
  generateMine(state, initial, length)
  updateNumbers(state)
}
export function generateMine(state: BlockState[][], initial: BlockState, length: number) {
  if (length === 0)
    return
  const x = randomInt(0, gameConfig[gameLevel.value].width)
  const y = randomInt(0, gameConfig[gameLevel.value].height)
  if (Math.abs(initial.x - x) <= 1 && Math.abs(initial.y - y) <= 1) {
    generateMine(state, initial, length)
  }
  else if (!state[y][x].mine) {
    state[y][x].mine = true
    generateMine(state, initial, length - 1)
  }
  else {
    generateMine(state, initial, length)
  }
}
export function updateNumbers(state: BlockState[][]) {
  state.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine)
        return
      getSiblings(block).forEach((b) => {
        if (b.mine)
          block.adjacentMines += 1
      })
    })
  })
}

export function getSiblings(block: BlockState) {
  return directions.map(([ox, oy]) => {
    const dx = block.x + ox
    const dy = block.y + oy
    if (dx < 0 || dy < 0 || dx >= gameConfig[gameLevel.value].width || dy >= gameConfig[gameLevel.value].height)
      return undefined
    return state.value[dy][dx]
  }).filter(Boolean) as BlockState[]
}
export function expendZero(block: BlockState) {
  if (block.adjacentMines)
    return
  getSiblings(block).forEach((s) => {
    if (!s.revealed) {
      s.revealed = true
      expendZero(s)
    }
  })
}
