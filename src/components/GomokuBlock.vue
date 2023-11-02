<script setup lang="ts">
defineProps<{ block: GomokuBlockState }>()
</script>

<template>
  <button
    class="lattice" :class="{
      bl: block.x === 0,
      bt: block.y === 0,
      br: block.x === 14,
      bb: block.y === 14,
    }"
  >
    <template v-if="block.used">
      <div class="pawn" z-10 i-mdi-checkbox-blank-circle :style="{ color: block.user }" />
    </template>
    <template v-else>
      <div :style="{ color: block.user }" />
    </template>
  </button>
</template>

<style lang="postcss">
.lattice {
  @apply relative border-style-double overflow-hidden;

  &.bl {
    @apply  border-l-5;
  }

  &.br {
    @apply border-r-5;
  }

  &.bt {
    @apply border-t-5;
  }

  &.bb {
    @apply border-b-5;
  }

  &::before {
    content: '';
    position: absolute;
    top: calc(-1 * var(--border-width));
    @apply border-l-1 h-10 bg-gray-600;
  }

  &::after {
    content: '';
    position: absolute;
    left: calc(-1 * var(--border-width));
    @apply border-t-1 w-10 bg-gray-600;
  }

  &:hover {
    @apply bg-gray-400;
  }
}
</style>
