import { useState, useEffect } from "react"
import { feedbackService } from "../services/feedback.service"

export function VotingButtons({ sectionType, contentId = '', userId, metadata = {}, existingVote = null }) {
    const [userVote, setUserVote] = useState(null) // 'up', 'down', or null
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (existingVote && existingVote.vote) {
            setUserVote(existingVote.vote)
        } else {
            setUserVote(null)
        }
    }, [existingVote])

    async function handleVote(vote) {
        // If user clicks the same vote, remove it (toggle off)
        const newVote = userVote === vote ? null : vote

        try {
            setIsSubmitting(true)

            await feedbackService.addFeedback({
                userId,
                sectionType,
                contentId,
                vote: newVote,
                metadata,
                timestamp: new Date().toISOString()
            })

            setUserVote(newVote)

        } catch (err) {
            console.error('Error submitting vote:', err)
            // Optionally show error to user
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
