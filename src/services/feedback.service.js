import { httpService } from './http.service'

export const feedbackService = {
    addFeedback,
    query
}

async function addFeedback(voteData) {
    try {
        const response = await httpService.post('feedback', voteData)
        return response
    } catch (err) {
        console.error('Error submitting vote:', err)
        throw err
    }
}


async function query(filterBy = {userId: '', sectionType: ''}){
    return httpService.get('feedback', filterBy)
}