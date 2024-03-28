import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext } from '../../contexts/AppContextProvider'
import { PageHeader } from '../Components'
import { ToastContainer } from 'react-toastify'
import './trainingStyles.css'

export const TrainingSetupPage = () => {

    const myAppContext = useMyAppContext()
    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    const StatsWidget = () => {
        return (
            <div >
                <h3> Total Questions: {myAppContext.allCards.length} </h3>
                <h3> Questions reviewed so far: {myTrainingContext.cardsToReview.length} </h3>
                {/* <h5> Percentage Correct: { myAppContext.subjectName } </h5> */}
                {/* <h5> Trend: Positive/Negative </h5> */}
            </div>
        )
    }

    const NumberOfQuestionsToReviewInput = () => {
        return (
            <div>
                <form ref={myTrainingContext.trainingSettingsFormRef} >
                    Number of Questions to review:{" "}
                    <input id="card_id" type="number" autoComplete="off" name="numberOfCardsToReview" autoFocus required minLength="1" />
                </form>
            </div>
        )
    }

    const StartTrainingButton = () => {
        return (
            <div >
                <input className="button" type="button" order="4" defaultValue="Train" progress="10" onClick={() => { myTrainingUpdateContext.startTraining() }} />
            </div>
        )
    }

    const PageBody = () => {
        return (
            <div className="container">
                < StatsWidget />
                < NumberOfQuestionsToReviewInput />
                < StartTrainingButton />
                < ToastContainer />
            </div>
        );
    }

    return (
        <div>
            < PageHeader pageTitle="Training Setup Page" />
            < PageBody />
        </div>
    )
}
