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
    <div v-if="gameState === 'over'" text-50px text="center" ml-50px>
      <div>游戏结束</div>
      <div v-text="`${winner === 'black' ? '黑' : '白'}方 获胜`" />
    </div>
    <div bg-gray-400>
      <div v-for="row, y in state" :key="y" flex justify-center>
        <GomokuBlock
          v-for="item, x in row" :key="x" h-10 w-10 flex items-center justify-center :block="item"
          @click="handleClick(item)"
        />
      </div>
    </div>
    <div v-if="gameState === 'over'" text-50px text="center" mr-50px>
      <div>游戏结束</div>
      <div v-text="`${winner === 'black' ? '黑' : '白'}方 获胜`" />
    </div>
  </div>
  <Confetti :is-passed="gameState === 'over'" />
  <nav mt-6 inline-flex gap-2 text-xl>
    <go-back />
    <button icon-btn i-mdi-refresh @click="reset" />
    <button icon-btn i-carbon-sun dark:i-carbon-moon @click="toggleDark()" />
    <div>当前执棋者: {{ winner === 'black' ? '黑' : '白' }}方</div>
  </nav>
</template>
