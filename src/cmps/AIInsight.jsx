import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { feedbackService } from "../services/feedback.service"
import { VotingButtons } from "./VotingButtons"

const API_URL = import.meta.env.VITE_API_URL


export function AIInsight({ preferences }) {
    const [insight, setInsight] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const user = useSelector(storeState => storeState.userModule.user)
    const [existingVote, setExistingVote] = useState(null)

    useEffect(() => {
        loadInsight()
    }, [preferences])

    useEffect(() => {
        loadFeedback()
    },[])

    async function loadFeedback(){
        try{
            const today = new Date().toISOString().split('T')[0]
            const votes = await feedbackService.query({
                userId: user._id,
                sectionType: "aiInsight",
                date: today
            })
            // Get the first (and only) vote for this section
            setExistingVote(votes[0] || null)
        } catch (err) {
            console.log('error load feedbacks from AIInsight', err);
        }
    }

    async function loadInsight() {
        try {
            setIsLoading(true)
            setError(null)

            const cryptoAssets = preferences?.cryptoAssets || []
            const investorType = preferences?.investorType?.[0] || 'General'

            const params = new URLSearchParams({
                assets: cryptoAssets.join(','),
                investorType: investorType,
                userId: user._id
            })

            const response = await fetch(`${API_URL}/api/ai-insight?${params}`, {
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()

            setInsight(data.insight)
        } catch (err) {
            console.error('Error loading AI insight:', err)
            setError(err.message || 'Failed to load AI insight')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="ai-insight-card">
                <h2>AI Insight of the Day</h2>
                <p>Generating personalized insight...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="ai-insight-card">
                <h2>AI Insight of the Day</h2>
                <p className="error">{error}</p>
                <button onClick={loadInsight}>Retry</button>
            </div>
        )
    }

    return (
        <div className="ai-insight-card">
        <div className="card-header">
            <h2>AI Insight of the Day</h2>
            <VotingButtons sectionType="aiInsight" userId={user._id} existingVote={existingVote} />
        </div>
        <div className="insight-content">
        <p className="insight-text">{insight}</p>
        </div>
        </div>
    )
}
