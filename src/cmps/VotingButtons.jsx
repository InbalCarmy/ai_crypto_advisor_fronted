import { useState, useEffect } from "react"
import { feedbackService } from "../services/feedback.service"

export function VotingButtons({ sectionType, userId, existingVote = null }) {
    const [userVote, setUserVote] = useState(null) //for UI
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (existingVote && existingVote.vote) {
            setUserVote(existingVote.vote)
        } else {
            setUserVote(null)
        }
    }, [existingVote])

    async function handleVote(vote) {
        const newVote = userVote === vote ? null : vote

        try {
            setIsSubmitting(true)

            const response = await feedbackService.addFeedback({
                userId,
                sectionType,
                vote: newVote
            })

            if (response && response.vote !== undefined) {
                setUserVote(response.vote)
            } else {
                setUserVote(newVote)
            }

        } catch (err) {
            console.error('Error submitting vote:', err)
        } finally {
            setIsSubmitting(false)
        }
    }
    
    

    return (
        <div className="voting-buttons">
            <button
                className={`vote-btn ${userVote === 'up' ? 'active' : ''}`}
                onClick={() => handleVote('up')}
                disabled={isSubmitting}
                aria-label="Thumbs up"
                title="Like this content"
            >
                <span className={`emoji green ${userVote === 'up' ? 'active' : ''}`}>👍</span>
               
            </button>
            <button
                className={`vote-btn ${userVote === 'down' ? 'active' : ''}`}
                onClick={() => handleVote('down')}
                disabled={isSubmitting}
                aria-label="Thumbs down"
                title="Dislike this content"
            >
                <span className={`emoji red ${userVote === 'down' ? 'active' : ''}`}>👎</span>
            </button>
        </div>
    )
}

