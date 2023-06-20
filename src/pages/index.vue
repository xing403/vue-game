<script setup lang="ts">
import type { BlockState } from '~/type'

// 更换页面标题
useTitle('MinesWeeper')

let generate = false
const mineNum = ref(15)
const flagNum = ref(0)
const gameState = ref<'play' | 'won' | 'lost'>('play')
const gameLevel = ref<'simple' | 'general' | 'difficult' | 'hell'>('general')
const gameLevels = ['simple', 'general', 'difficult', 'hell']
const gameConfig = {
  simple: {
    mineNum: 10,
    width: 5,
    height: 5,
  },
  general: {
    mineNum: 40,
    width: 15,
    height: 15,
  },
  difficult: {
    mineNum: 60,
    width: 15,
    height: 15,
  },
  hell: {
    mineNum: 80,
    width: 15,
    height: 15,
  },

}
const gameSettingDialog = ref(false)
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
  flagNum.value = 0
  mineNum.value = gameConfig[gameLevel.value].mineNum
  state.value = Array.from({ length: gameConfig[gameLevel.value].height }, (_, y) =>
    Array.from({ length: gameConfig[gameLevel.value].width },
      (_, x): BlockState => ({
        x, y, adjacentMines: 0,
      }),

    ),
  )
}
function onRightClick(block: BlockState) {
  if (block.revealed)
    return
  if (flagNum.value === mineNum.value && block.flagged) {
    block.flagged = !block.flagged
    flagNum.value += block.flagged ? 1 : -1
  }
  else if (flagNum.value < mineNum.value) {
    block.flagged = !block.flagged
    flagNum.value += block.flagged ? 1 : -1
  }
  checkGameState()
}
function generateMines(state: BlockState[][], initial: BlockState, length: number) {
  flagNum.value = 0
  generateMine(state, initial, length)
  updateNumbers(state)
}
function generateMine(state: BlockState[][], initial: BlockState, length: number) {
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
  if (gameState.value !== 'play' || block.flagged)
    return
  block.revealed = true
  if (!generate) {
    generateMines(state.value, block, mineNum.value)
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
    if (dx < 0 || dy < 0 || dx >= gameConfig[gameLevel.value].width || dy >= gameConfig[gameLevel.value].height)
      return undefined
    return state.value[dy][dx]
  }).filter(Boolean) as BlockState[]
}
function checkGameState() {
  if (!generate || gameState.value !== 'play')
    return

  const blocks = state.value.flat()
  if (!blocks.some(block => !block.mine && !block.revealed)
    || blocks.filter(block => block.mine).every(block => block.flagged)
  )
    gameState.value = 'won'
}
function showAllMines() {
  state.value.flat().forEach((i) => {
    if (i.mine)
      i.revealed = true
  })
}
function handleGameSetting() {
  gameSettingDialog.value = true
}
function handleChangeGameSetting() {
  gameSettingDialog.value = false
  reset()
}
watchEffect(checkGameState)
function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function randomInt(min: number, max: number) {
  return Math.floor(random(min, max))
}

reset()
</script>

<template>
  <div>
    <div pt5 pb5>
      minesweeper
    </div>
    <div v-for="row, y in state" :key="y" flex justify-center>
      <MineBlock
        v-for="item, x in row" :key="x" h-10 w-10 flex items-center justify-center :block="item"
        @click="onClick(item)" @contextmenu.prevent="onRightClick(item)"
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
        <button>剩余数量：{{ mineNum - flagNum }}</button>
      </template>
      <template v-else>
        <div>游戏结束: {{ gameState.toLocaleUpperCase() }}</div>
      </template>
    </div>
    <Confetti :is-passed="gameState === 'won'" />

    <nav mt-6 inline-flex gap-2 text-xl>
      <button icon-btn i-carbon-sun dark:i-carbon-moon @click="toggleDark()" />
      <button icon-btn i-carbon-settings @click="handleGameSetting()" />
    </nav>
    <el-dialog v-model="gameSettingDialog" title="游戏设置">
      <el-form label-position="top" label-width="100px" style="max-width: 460px">
        <el-form-item label="游戏等级">
          <el-radio-group v-model="gameLevel">
            <el-radio v-for="item, index in gameLevels" :key="index" :label="item" @change="handleChangeGameSetting">
              {{ item }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="gameSettingDialog = false">
          取消
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
