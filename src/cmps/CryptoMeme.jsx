import { useState, useEffect } from "react"
import { VotingButtons } from "./VotingButtons"
import { useSelector } from "react-redux"
import { feedbackService } from "../services/feedback.service"

const API_URL = import.meta.env.VITE_API_URL


export function CryptoMeme() {
    const [currentMeme, setCurrentMeme] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const user = useSelector(storeState => storeState.userModule.user)
    const [existingVote, setExistingVote] = useState(null)

    useEffect(() => {
        loadRandomMeme()
    }, [])

    useEffect(() => {
        loadFeedback()
    }, [])

    async function loadFeedback(){
        try{
            const today = new Date().toISOString().split('T')[0]
            const votes = await feedbackService.query({
                userId: user._id,
                sectionType: "cryptoMeme",
                date: today
            })
            // Get the first (and only) vote for this section today
            setExistingVote(votes[0] || null)
        } catch (err) {
            console.log('error load feedbacks from CryptoMeme', err);
        }
    }

    async function loadRandomMeme() {
        
        try {
            setIsLoading(true)
            setError(null)


            const response = await fetch(`${API_URL}/api/meme`, {
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()
            setCurrentMeme(data.url)
        } catch (err) {
            console.error('Error loading meme:', err)
            setError(err.message || 'Failed to load meme')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="crypto-meme-card">
                <h2>Crypto Meme</h2>
                <p>Loading meme...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="crypto-meme-card">
                <h2>Crypto Meme of the Day</h2>
                <button onClick={loadRandomMeme} className="refresh-btn">
                     Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="crypto-meme-card">
            <div className="title-meme">
                <h2>Crypto Meme of the Day</h2>
                <VotingButtons sectionType="cryptoMeme" userId={user._id} existingVote={existingVote} />
            </div>
            <div className="meme-container">
                    <img
                        src={currentMeme}
                        alt="Crypto meme"
                        className="meme-image"
                    />
            </div>
            <button onClick={loadRandomMeme} className="refresh-btn">
                Get Another Meme
            </button>
        </div>
    )
}
