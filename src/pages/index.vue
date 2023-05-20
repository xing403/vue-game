<script setup lang="ts" generic="T extends any, O extends any">

const WIDTH = 10
const HEIGHT = 10
const dev = true
let generate = false
const directions = [
  [-1, 0],
  [-1, -1],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
]
const numberColors = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',

]
interface BlockState {
  x: number
  y: number
  revealed?: boolean
  mine?: boolean
  flagged?: boolean
  adjacentMines: number
}
const state = reactive(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH },
      (_, x): BlockState => ({
        x, y, adjacentMines: 0,
      })

    )
  )
)
function generateMines(initial: BlockState) {
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) <= 1)
        continue
      if (Math.abs(initial.y - block.y) <= 1)
        continue
      block.mine = Math.random() < 0.2
    }
  }
  updateNumbers()
}
function updateNumbers() {
  state.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine)
        return
      getSiblings(block).forEach((b) => {
        if (b.mine) {
          block.adjacentMines += 1
        }
      })
    })
  })
}
function getBlockClass(block: BlockState) {
  if (!block.revealed)
    return 'bg-gray-500/10'
  return block.mine ? "text-red" : numberColors[block.adjacentMines]
}
function onClick(block: BlockState) {
  block.revealed = true
  if (!generate) {
    generateMines(block)
    generate = true
  }
  if (block.mine)
    alert("MOOOOM!")
  expendZero(block)
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
    const dx = block.x + ox;
    const dy = block.y + oy
    if (dx < 0 || dy < 0 || dx >= WIDTH || dy >= HEIGHT)
      return undefined
    return state[dy][dx]
  }).filter(Boolean) as BlockState[]
}
</script>

<template>
  <div>
    <div>mineswepeer</div>
    <div pt-5></div>
    <div v-for="row, y in state" :key="y" flex justify-center>
      <button w-10 h-10 flex items-center justify-center v-for="item, x in row" :key="x" hover="bg-gray-400"
        :class="getBlockClass(item)" border="1 gray-500/10" @click="onClick(item)">
        <template v-if="item.revealed || dev">
          <div v-if="item.mine" i-mdi-mine>
          </div>
          <div v-else>
            {{ item.adjacentMines }}
          </div>
        </template>

      </button>
    </div>
  </div>
</template>
