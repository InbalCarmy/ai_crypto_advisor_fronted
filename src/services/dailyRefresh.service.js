
// Service to manage daily refresh of dashboard content
export const dailyRefreshService = {
    shouldRefresh,
    markAsRefreshed,
    getStoredData,
    storeData,
    clearOldData
}


function shouldRefresh(key) {
    const today = new Date().toDateString() 
    const lastFetchDate = localStorage.getItem(`${key}_lastFetch`)

    // If never fetched or different day, should refresh
    return !lastFetchDate || lastFetchDate !== today
}


function markAsRefreshed(key) {
    const today = new Date().toDateString()
    localStorage.setItem(`${key}_lastFetch`, today)
}


function getStoredData(key) {
    try {
        const data = localStorage.getItem(`${key}_data`)
        return data ? JSON.parse(data) : null
    } catch (err) {
        console.error(`Error parsing stored data for ${key}:`, err)
        return null
    }
}


function storeData(key, data) {
    try {
        localStorage.setItem(`${key}_data`, JSON.stringify(data))
    } catch (err) {
        console.error(`Error storing data for ${key}:`, err)
    }
}


function clearOldData(key) {
    localStorage.removeItem(`${key}_data`)
    localStorage.removeItem(`${key}_lastFetch`)
}
