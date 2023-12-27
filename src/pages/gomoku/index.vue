<route lang="yaml">
meta:
  title: 五子棋
</route>

<script setup lang="ts">
import {
  checkGameState,
  currentPlayer,
  gameState,
  generateMap,
  reset,
  state,
  winner,
} from './main'

generateMap()
function handleClick(block: GomokuBlockState) {
  if (block.used || gameState.value === 'over')
    return
  block.used = true
  block.user = currentPlayer.value
  currentPlayer.value = currentPlayer.value === 'black' ? 'white' : 'black'
  checkGameState()
}
</script>

<template>
  <div flex="~ row gap-1 items-center" justify="center">
    <div bg-gray-400>
      <div v-for="row, y in state" :key="y" flex justify-center>
        <GomokuBlock
          v-for="item, x in row" :key="x" h-10 w-10 flex items-center justify-center :block="item"
          @click="handleClick(item)"
        />
      </div>
    </div>
  </div>
  <Confetti :is-passed="gameState === 'over'" />
  <Footer>
    <template #extend>
      <button icon-btn i-mdi-refresh @click="reset" />
      <button icon-btn i-carbon-sun dark:i-carbon-moon @click="toggleDark()" />
      <div>当前执棋者: {{ winner !== 'black' ? '黑' : '白' }}方</div>
    </template>
  </Footer>
  <div
    v-if="gameState === 'over'" text-50px text="center" mr-50px
    v-text="`游戏结束 ${winner === 'black' ? '黑' : '白'}方 获胜`"
  />
</template>
