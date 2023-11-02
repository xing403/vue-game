export type GameLevel = 'simple' | 'general' | 'difficult' | 'hell'

export const generate = ref<boolean>(false)
export const mineNum = ref<number>(15)
export const flagNum = ref<number>(0)
export const gameState = ref<'play' | 'won' | 'lost'>('play')
export const gameLevel = ref<GameLevel>('general')
export const gameSettingDialog = ref(false)
export const state = ref<MineBlockState[][]>([])

export const gameLevels: string[] = ['simple', 'general', 'difficult', 'hell']
export const gameConfig: Obj<Obj<number>> = {
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
export const directions: number[][] = [
  [-1, 0],
  [-1, -1],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]
