export const isDark = useDark()
export const toggleDark = useToggle(isDark)
// 作弊模式
export const isDev = ref(false)
export const toggleDev = useToggle(isDev)
