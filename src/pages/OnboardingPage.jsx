import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { updateUser } from "../store/user/user.actions"
import { Link } from "react-router-dom"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

export function OnboardingPage(){
    const user = useSelector(storeState => storeState.userModule.user)
    const [preferences, setPreferences] = useState({
        cryptoAssets: [],
        investorType: [],
        contentKind: []
    })
    const navigate = useNavigate()

    useEffect(()=> {
        if(user?.isOnboarded){
            navigate('/dashboard')
        }       
    })


    function handleCheckboxChange(ev) {
        const { name, value, checked } = ev.target

        setPreferences(prev => {
            const currentArray = prev[name] || []

            if (checked) {
                return {
                    ...prev,
                    [name]: [...currentArray, value]
                }
            } else {
                return {
                    ...prev,
                    [name]: currentArray.filter(item => item !== value)
                }
            }
        })
    }

    async function handleSubmit(ev) {
        ev.preventDefault()
        console.log('Selected preferences:', preferences)

        try{
            const updatedUser = {
                ...user,
                preferences: preferences,
                isOnboarded: true
            }
            
            await updateUser(updatedUser)
            navigate('/dashboard')
            showSuccessMsg('Youwr preferences have been saved')
        } catch (err){
            showErrorMsg('Can not save preferences')
            console.log('Faild to save preferences', err);

            
        }
    }

    if(!user){
        return(
            <section>
                <div>
                    <h1>Please log in</h1>
                <Link to='/'>
                <button> login page </button>
                </Link>
                </div>
            </section>
        )
    }

    return(
        <section className="onboarding-page">
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>What crypto assets are you interested in?</legend>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="bitcoin"
                            name="cryptoAssets"
                            value="bitcoin"
                            checked={preferences.cryptoAssets.includes('bitcoin')}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="bitcoin">Bitcoin (BTC)</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="ethereum"
                            name="cryptoAssets"
                            value="ethereum"
                            checked={preferences.cryptoAssets.includes('ethereum')}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="ethereum">Ethereum (ETH)</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="cardano"
                            name="cryptoAssets"
                            value="cardano"
                            checked={preferences.cryptoAssets.includes('cardano')}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="cardano">Cardano (ADA)</label>
                    </div>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="solana"
                            name="cryptoAssets"
                            value="solana"
                            checked={preferences.cryptoAssets.includes('solana')}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="solana">Solana (SOL)</label>
                    </div>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="polygon"
                            name="cryptoAssets"
                            value="polygon"
                            checked={preferences.cryptoAssets.includes('polygon')}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="polygon">Polygon (MATIC)</label>
                    </div>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="ripple"
                            name="cryptoAssets"
                            value="ripple"
                            checked={preferences.cryptoAssets.includes('ripple')}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="ripple">Ripple (XRP)</label>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>What type of investor are you?</legend>
                    <div className="checkbox-group">
                        <input 
                            type="checkbox"
                            id="hodler"
                            name="investorType"
                            value="HODLer"
                            checked={preferences.investorType.includes('HODLer')}
                            onChange={handleCheckboxChange} />
                            <label htmlFor="hodler">HODLer</label>
                    </div>
                        <div className="checkbox-group">
                        <input 
                            type="checkbox"
                            id="day-trader"
                            name="investorType"
                            value="Day Trader"
                            checked={preferences.investorType.includes('Day Trader')}
                            onChange={handleCheckboxChange} />
                            <label htmlFor="day-trader">Day Trader</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="nft-collector"
                            name="investorType"
                            value="NFT Collector"
                            checked={preferences.investorType.includes('NFT Collector')}
                            onChange={handleCheckboxChange} />
                            <label htmlFor="nft-collector">NFT Collector</label>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>What kind of content would you like to see?</legend>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="market-news"
                            name="contentKind"
                            value="Market News"
                            checked={preferences.contentKind.includes('Market News')}
                            onChange={handleCheckboxChange}/>
                            <label htmlFor="market-news">Market News</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="charts"
                            name="contentKind"
                            value="Charts"
                            checked={preferences.contentKind.includes('Charts')}
                            onChange={handleCheckboxChange}/>
                            <label htmlFor="charts">Charts</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="social"
                            name="contentKind"
                            value="Social"
                            checked={preferences.contentKind.includes('Social')}
                            onChange={handleCheckboxChange}/>
                            <label htmlFor="social">Social</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="fun"
                            name="contentKind"
                            value="Fun"
                            checked={preferences.contentKind.includes('Fun')}
                            onChange={handleCheckboxChange}/>
                            <label htmlFor="fun">Fun</label>
                    </div>

                </fieldset>


                <button type="submit">Continue</button>
            </form>

        </section>
    )
}