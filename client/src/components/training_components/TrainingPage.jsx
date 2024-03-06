import React, { useEffect } from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext } from '../../contexts/AppContextProvider'
import { PageHeader } from '../Components'
import { ToastContainer } from 'react-toastify'
import '../commonStyles.css'

export const TrainingPage = () => {

    const myAppContext = useMyAppContext()
    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    const TrainingWidget = () => {

        switch (myTrainingContext.currentTrainingState) {

            case "NotStarted":
                return (< StartTrainingWidget />)

            case "Training":
                return (< AnswerCardWidget />)

            case "FinishedTraining":
                return (< FinishedTrainingWidget />)

            default:
                return (<div> UNKNOWN TRAINING STATE! </div>)
        }
    }

    const StartTrainingWidget = () => {

        useEffect(() => {
            // keydown has a bug where it repeats
            document.addEventListener('keyup', myTrainingUpdateContext.startTraining)
            return () => { document.removeEventListener('keyup', myTrainingUpdateContext.startTraining) }
        },)

        return (
            <div >
                 <h4 className="center-align">[ Enter ] to Start Training</h4>
                 <input type="text" className="hidden-input" autoComplete="off" />
            </div>
        )
    }

    const AnswerCardWidget = () => {

        const card = myAppContext.allCards[myTrainingContext.currentCardIndex]
        return (
            <div >
                <h5>
                    Question:
                </h5>
                <div> {card.question} </div>
                <br />
                <form ref={myTrainingContext.submitAnswerFormRef} >
                    <label>
                        Answer:{" "}
                        <input type="text" autoComplete="off" name="answer" autoFocus required minLength="2" />
                        {"    "} [ Enter ]
                    </label>
                    <br />
                    <button type="text" hidden onClick={myTrainingUpdateContext.train} > Start Training </button>
                </form>
                <hr />
                {/* <h4> Time To Answer: { Math.round( myTrainingContext.secondsToAnswerCurrentCard * 10 ) / 10 } seconds </h4> */}
                <h4> Correct: [{myTrainingContext.numberCorrect}] - Incorrect: [{myTrainingContext.numberIncorrect}] </h4>
                <h4> Remaining: {myTrainingContext.numberRemaining} </h4>
            </div>
        )
    }

    const FinishedTrainingWidget = () => {

        useEffect(() => {
            document.addEventListener('keydown', myTrainingUpdateContext.finishTraining)
            return () => { document.removeEventListener('keydown', myTrainingUpdateContext.finishTraining) }
        },)

        return (
            <div >
                <h2> DONE! </h2>
                <h4> Correct: [{myTrainingContext.numberCorrect}] - Incorrect: [{myTrainingContext.numberIncorrect}] </h4>
                <h4> Total Time: {Math.round(myTrainingContext.cumulativeTrainingSessionTimeInSeconds * 10) / 10} seconds </h4>
                <h4> [ Enter ] to Continue </h4>
                <input type="text" autoComplete="off" hidden />
            </div>
        )
    }

    const PageBody = () => {
        return (
            <div className="container">
                <div>
                    Progress:
                    <progress className="progress-bar" value={myTrainingContext.progressValue} />
                </div>
                < TrainingWidget />
                < ToastContainer />
            </div>
        );
    }

    return (
        <div>
            <PageHeader pageTitle="Train" previousPage="TrainingSetupPage" />
            <PageBody />
        </div>
    )
}
