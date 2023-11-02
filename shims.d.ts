declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
interface MineBlockState {
  x: number
  y: number
  revealed?: boolean
  mine?: boolean
  flagged?: boolean
  adjacentMines: number
}

type GomokuUserType = 'black' | 'white' | ''

interface GomokuBlockState {
  x: number
  y: number
  used: boolean
  user: GomokuUserType
}

interface Obj<T> {
  [key: string | number]: T
}
