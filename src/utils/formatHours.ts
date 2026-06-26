export const formatHours = (seconds: number) => {
    if (!seconds || seconds == 0) return 0
    return (seconds / 3600).toFixed(2)
}