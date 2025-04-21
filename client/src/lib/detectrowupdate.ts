export function hasRowChanged(original: any, updated: any) {
    return JSON.stringify(original) !== JSON.stringify(updated)
}