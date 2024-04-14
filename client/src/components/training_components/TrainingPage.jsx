import React, { useEffect } from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { PageHeader, SubmitButton } from '../Components'
import '../commonStyles.css'

export const TrainingPage = () => {

    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    const TrainingWidget = () => {

        switch (myTrainingContext.currentTrainingState) {

            case "NotStarted":
                return (< StartTrainingWidget />)

            case "Training":
                return (< AnswerCardWidget />)

            case "FinishedTrainingRound":
                return (< FinishedTrainingRoundWidget />)

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
        const card = myTrainingContext.trainingCards[myTrainingContext.currentCardIndex]
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
                        <input id="answer-response" type="text" autoComplete="off" name="answer" autoFocus required minLength="2" />
                        {"    "} [ Enter ]
                    </label>
                    <br />
                    <button type="text" hidden onClick={myTrainingUpdateContext.answerQuestion} > Start Training </button>
                </form>
                <hr />
                {/* <h4> Time To Answer: { Math.round( myTrainingContext.secondsToAnswerCurrentCard * 10 ) / 10 } seconds </h4> */}
                <h4> Correct: [{myTrainingContext.numberCorrect}] - Incorrect: [{myTrainingContext.numberIncorrect}] </h4>
                <h4> Remaining: {myTrainingContext.numberRemaining} </h4>
                <div className="login-button-group">
                    < SubmitButton id="submit-answer-button" onClick={() => myTrainingUpdateContext.answerQuestion()}> Submit </SubmitButton>
                    < SubmitButton id="cancel-button" onClick={() => myTrainingUpdateContext.cancelTraining()}> Cancel </SubmitButton>
                </div>
            </div>
        )
    }

    const FinishedTrainingRoundWidget = () => {

        useEffect(() => {
            document.addEventListener('keydown', myTrainingUpdateContext.finishTrainingRound)
            return () => { document.removeEventListener('keydown', myTrainingUpdateContext.finishTrainingRound) }
        },)

        return (
            <div >
                <h2 id="done-with-round-text"> DONE with Round {myTrainingContext.trainingRounds}! </h2>
                <h4> Correct: [{myTrainingContext.numberCorrect}] - Incorrect: [{myTrainingContext.numberIncorrect}] </h4>
                <h4> Total Time: {Math.round(myTrainingContext.cumulativeTrainingSessionTimeInSeconds * 10) / 10} seconds </h4>
                <h4> [ Enter ] to Continue </h4>
                <button id="click-enter" className="button" onClick={myTrainingUpdateContext.finishTrainingRound}>Continue</button>
                <input type="text" autoComplete="off" hidden />
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
                <h2 id="done-with-training-text"> DONE with TRAINING! </h2>
                <h4> Correct: [{myTrainingContext.numberCorrect}] - Incorrect: [{myTrainingContext.numberIncorrect}] </h4>
                <h4> Total Rounds: {myTrainingContext.trainingRounds} </h4>
                <h4> [ Enter ] to Continue </h4>
                <button id="click-enter" className="button" onClick={myTrainingUpdateContext.finishTraining}>Continue</button>
                <input type="text" autoComplete="off" hidden />
            </div>
        )
    }

    const TrainingPageBody = () => {
        return (
            <div className="page-container">
                <div>
                    Progress:
                    <progress className="progress-bar" value={myTrainingContext.progressValue} />
                </div>
                < TrainingWidget />
            </div>
        )
    }

    return (
        <div>
            <div id="training-page-id" style={{ display: 'none' }}> </div>
            < PageHeader />
            < TrainingPageBody />
        </div>
    )
}
