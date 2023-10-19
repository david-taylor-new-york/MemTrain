import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext } from '../../contexts/AppContextProvider'
import { BackButton } from '../Components'
import { ToastContainer } from 'react-toastify';
import './styles/TrainingSetupPage.css'; // Import the styles

export const TrainingSetupPage = () => {

    const myAppContext = useMyAppContext()
    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    const Header = () => {
        return (
            <div>
                <BackButton className="widget-container" previousPage="TrainingMenuPage" />
                <h5>Subject: {myAppContext.subjectName}</h5>
                <h3>Training Setup</h3>
                <hr />
            </div>
        )
    }

    const StatsWidget = () => {
        return (
            <div className="widget-container">
                <h5> Total Questions: {myAppContext.allCards.length} </h5>
                <h5> Questions reviewed so far: {myTrainingContext.cardsToReview.length} </h5>
                {/* <h5> Percentage Correct: { myAppContext.subjectName } </h5> */}
                {/* <h5> Trend: Positive/Negative </h5> */}
            </div>
        )
    }

    const NumberOfQuestionsToReviewInput = () => {
        return (
            <div className="widget-container">
                <form ref={myTrainingContext.trainingSettingsFormRef} >
                    <label>
                        Number of Questions to review:{" "}
                        <input type="number" autoComplete="off" name="numberOfCardsToReview" autoFocus required minLength="1" />
                    </label>
                </form>
            </div>
        )
    }

    const StartTrainingButton = () => {
        return (
            <div className="widget-container">
                <input type="button" className="button-main-css" order="4" defaultValue="Train" progress="10" onClick={() => { myTrainingUpdateContext.startTraining() }} />
            </div>
        )
    }

    return (
        <>
            < Header />
            < StatsWidget />
            < NumberOfQuestionsToReviewInput />
            < StartTrainingButton />
            < ToastContainer />
        </>
    )
}
