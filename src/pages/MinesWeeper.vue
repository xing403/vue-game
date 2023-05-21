<script setup lang="ts">
import type { BlockState } from '~/type'

// 更换页面标题
useTitle('MinesWeeper')

const WIDTH = 10
const HEIGHT = 10

let generate = false
const mineNum = ref(0)
const gameState = ref<'play' | 'won' | 'lost'>('play')
const directions = [
  [-1, 0],
  [-1, -1],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

const state = ref<BlockState[][]>([])
function reset() {
  gameState.value = 'play'
  generate = false
  state.value = Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH },
      (_, x): BlockState => ({
        x, y, adjacentMines: 0,
      }),

    ),
  )
}
function onRightClick(block: BlockState) {
  if (block.revealed)
    return
  block.flagged = !block.flagged
  checkGameState()
}
function generateMines(state: BlockState[][], initial: BlockState) {
  mineNum.value = 0
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) <= 1 && Math.abs(initial.y - block.y) <= 1)
        continue
      if (Math.random() < 0.2) {
        mineNum.value += 1
        block.mine = true
      }
    }
  }
  if (!mineNum.value)
    generateMines(state, initial)

  updateNumbers(state)
}
function updateNumbers(state: BlockState[][]) {
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
function onClick(block: BlockState) {
  if (gameState.value !== 'play')
    return
  block.revealed = true
  if (!generate) {
    generateMines(state.value, block)
    generate = true
  }
  if (block.mine) {
    gameState.value = 'lost'
    alert(gameState.value)
    showAllMines()
  }
  expendZero(block)
  checkGameState()
}
function expendZero(block: BlockState) {
  if (block.adjacentMines)
    return
  getSiblings(block).forEach((s) => {
    if (!s.revealed) {
      s.revealed = true
      expendZero(s)
    }
  })
}
function getSiblings(block: BlockState) {
  return directions.map(([ox, oy]) => {
    const dx = block.x + ox
    const dy = block.y + oy
    if (dx < 0 || dy < 0 || dx >= WIDTH || dy >= HEIGHT)
      return undefined
    return state.value[dy][dx]
  }).filter(Boolean) as BlockState[]
}
function checkGameState() {
  if (!generate || gameState.value !== 'play')
    return

  const blocks = state.value.flat()
  if (!blocks.some(block => !block.mine && !block.revealed))
    gameState.value = 'won'
}
function showAllMines() {
  state.value.flat().forEach((i) => {
    if (i.mine)
      i.revealed = true
  })
}
watchEffect(checkGameState)
reset()
</script>

<template>
  <div>
    <div pt5 pb5>
      minesweeper
    </div>
    <div v-for="row, y in state" :key="y" flex justify-center>
      <MineBlock
        v-for="item, x in row" :key="x" h-10 w-10 flex items-center justify-center
        :block="item"
        @click="onClick(item)"
        @contextmenu.prevent="onRightClick(item)"
      />
    </div>
    <div flex="~ gap-1" justify="center" pt5>
      <button btn @click="toggleDev()">
        {{ isDev }}
      </button>
      <button btn @click="reset">
        reset
      </button>
      <template v-if="gameState === 'play'">
        <button>剩余数量：{{ mineNum }}</button>
      </template>
      <template v-else>
        <div>游戏结束: {{ gameState.toLocaleUpperCase() }}</div>
      </template>
    </div>
    <Confetti :is-passed="gameState === 'won'" />
  </div>
</template>
