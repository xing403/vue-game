<route lang="yaml">
meta:
  title: 扫雷
</route>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import type { GameLevel } from './main'
import {
  expendZero,
  flagNum,
  gameConfig,
  gameLevel,
  gameLevels,
  gameSettingDialog,
  gameState,
  generate,
  generateMines,
  mineNum,
  state,
} from './main'

const selectgameLevel = ref<GameLevel>(gameLevel.value)
function gameLost() {
  ElMessageBox({
    title: '游戏结束',
    showClose: false,
    showCancelButton: false,
    showConfirmButton: true,
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    center: true,
    message: h('div', {}, [
      h('div', { class: 'i-carbon-face-dizzy text-5xl ma text-red' }),
      h('div', { class: 'text-center ma' }, '你输了，继续努力吧'),
    ]),
  })
}

function reset() {
  gameState.value = 'play'
  generate.value = false
  flagNum.value = 0
  mineNum.value = gameConfig[gameLevel.value].mineNum
  state.value = Array.from({ length: gameConfig[gameLevel.value].height }, (_, y) =>
    Array.from({ length: gameConfig[gameLevel.value].width },
      (_, x): MineBlockState => ({ x, y, adjacentMines: 0 }),
    ),
  )
}
function onRightClick(block: MineBlockState) {
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

function onClick(block: MineBlockState) {
  if (gameState.value !== 'play' || block.flagged)
    return
  block.revealed = true
  if (!generate.value) {
    generateMines(state.value, block, mineNum.value)
    generate.value = true
  }
  if (block.mine) {
    gameState.value = 'lost'
    gameLost()
    showAllMines()
  }
  expendZero(block)
  checkGameState()
}

function onDoubleClick(block: MineBlockState) {
  if (block.flagged)
    return

  let aroundFlagged = 0
  Array.from({ length: 9 }).forEach((_, index: number) => {
    const y = index % 3 - 1
    const x = Math.floor(index / 3) - 1
    if (!(block.y + y < 0 || block.x + x < 0 || block.y + y >= gameConfig[gameLevel.value].height || block.x + x >= gameConfig[gameLevel.value].width)) {
      if (state.value[block.y + y][block.x + x].flagged)
        aroundFlagged++
    }
  })
  if (block.revealed && aroundFlagged === block.adjacentMines) {
    Array.from({ length: 9 }).forEach((_, index: number) => {
      const y = index % 3 - 1
      const x = Math.floor(index / 3) - 1

      if (!(block.y + y < 0 || block.x + x < 0 || block.y + y >= gameConfig[gameLevel.value].height || block.x + x >= gameConfig[gameLevel.value].width)) {
        const offset = state.value[block.y + y][block.x + x]
        if (!offset.flagged) {
          offset.revealed = true
          if (offset.adjacentMines === 0)
            expendZero(offset)
        }
      }
    })
  }
  checkGameState()
}

function checkGameState() {
  if (!generate.value || gameState.value !== 'play')
    return

  const blocks = state.value.flat()
  if (!blocks.some(block => !block.mine && !block.revealed)
    || blocks.filter(block => block.mine).every(block => block.flagged)
  ) { gameState.value = 'won' }
  else if (blocks.filter(block => block.mine).some(block => block.revealed)) {
    gameState.value = 'lost'
    gameLost()
  }
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
watchEffect(checkGameState)

reset()
function confirm() {
  gameLevel.value = selectgameLevel.value
  reset()
  gameSettingDialog.value = false
}
</script>

<template>
  <div>
    <div v-for="row, y in state" :key="y" flex justify-center>
      <MineBlock
        v-for="item, x in row" :key="x" h-10 w-10 flex items-center justify-center :block="item"
        @click="onClick(item)" @contextmenu.prevent="onRightClick(item)" @dblclick="onDoubleClick(item)"
      />
    </div>
    <div flex="~ gap-1" justify="center" pt5>
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
    <Footer>
      <template #extend>
        <button icon-btn i-carbon-settings @click="handleGameSetting()" />
      </template>
    </Footer>
    <el-dialog v-model="gameSettingDialog" title="游戏设置">
      <el-form label-position="top" label-width="100px" style="max-width: 460px">
        <el-form-item label="游戏等级">
          <el-radio-group v-model="selectgameLevel">
            <el-radio v-for="item, index in gameLevels" :key="index" :label="item">
              {{ item }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="confirm" v-text="'确定'" />
        <el-button @click="gameSettingDialog = false" v-text="'取消'" />
      </template>
    </el-dialog>
  </div>
</template>
