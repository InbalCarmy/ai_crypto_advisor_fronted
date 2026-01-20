
// Service to manage daily refresh of dashboard content
export const dailyRefreshService = {
    shouldRefresh,
    markAsRefreshed,
    getStoredData,
    storeData,
    clearOldData,
}


function shouldRefresh(key, userId = null) {
    const storageKey = userId ? `${userId}_${key}` : key
    const today = new Date().toDateString()
    const lastFetchDate = localStorage.getItem(`${storageKey}_lastFetch`)

    // If never fetched or different day, should refresh
    return !lastFetchDate || lastFetchDate !== today
}


function markAsRefreshed(key, userId = null) {
    const storageKey = userId ? `${userId}_${key}` : key
    const today = new Date().toDateString()
    localStorage.setItem(`${storageKey}_lastFetch`, today)
}


function getStoredData(key, userId = null) {
    const storageKey = userId ? `${userId}_${key}` : key
    try {
        const data = localStorage.getItem(`${storageKey}_data`)
        return data ? JSON.parse(data) : null
    } catch (err) {
        console.error(`Error parsing stored data for ${key}:`, err)
        return null
    }
}


function storeData(key, data, userId = null) {
    const storageKey = userId ? `${userId}_${key}` : key
    try {
        localStorage.setItem(`${storageKey}_data`, JSON.stringify(data))
    } catch (err) {
        console.error(`Error storing data for ${key}:`, err)
    }
}


function clearOldData(key, userId = null) {
    const storageKey = userId ? `${userId}_${key}` : key
    localStorage.removeItem(`${storageKey}_data`)
    localStorage.removeItem(`${storageKey}_lastFetch`)
}



