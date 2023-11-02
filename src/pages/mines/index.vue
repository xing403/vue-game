<route lang="yaml">
meta:
  title: 扫雷
</route>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
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
      h('div', { class: 'text-center ma' }, '你输了'),
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
      (_, x): BlockState => ({ x, y, adjacentMines: 0 }),
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

function onClick(block: BlockState) {
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

function checkGameState() {
  if (!generate.value || gameState.value !== 'play')
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

reset()
</script>

<template>
  <div>
    <div v-for="row, y in state" :key="y" flex justify-center>
      <MineBlock
        v-for="item, x in row" :key="x" h-10 w-10 flex items-center justify-center :block="item"
        @click="onClick(item)" @contextmenu.prevent="onRightClick(item)"
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
    <nav mt-6 inline-flex gap-2 text-xl>
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
