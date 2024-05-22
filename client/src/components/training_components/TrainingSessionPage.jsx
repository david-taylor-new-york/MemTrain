import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext } from '../../contexts/AppContextProvider'
import { PageHeader, ChooseIdWidget } from '../Components'

export const TrainingSessionPage = () => {
    return (
        <div className="page-container">
            <div id="training-session-page-id" style={{ display: 'none' }}> </div>
            <PageHeader/>
            <TrainingSessionPageBody/>
        </div>
    )
}

const TrainingSessionPageBody = () => {
    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    return (
        <div className="section-container">
            <TrainingSessionSummary/>
            <ChooseIdWidget formRef={myTrainingContext.trainingSessionFormRef} buttonLabel={'View All Answers'} submitCall={myTrainingUpdateContext.loadTrainingCardResultsPage} idLabel={'CARD:'}/>
            <TrainingSessionTable/>
        </div>
    )
}

const TrainingSessionSummary = () => {
    const myTrainingContext = useMyTrainingContext()
    const session_start_time = new Date(myTrainingContext.currentTrainingSession.session_start_time)
    const session_month = session_start_time.getMonth() + 1

    return (
        <div className="section-container">
            <h4 className="results-header"> Training Session: {myTrainingContext.currentTrainingSession.session_number} </h4>
            <h4 className="results-header"> Date: {session_month + "/" + session_start_time.getDate()} </h4>
            <h4 className="results-header"> Time: {session_start_time.getHours() + ":" + session_start_time.getMinutes().toString().padStart(2, '0')} </h4>
            <h4 className="results-header"> First Round: Correct ({myTrainingContext.currentTrainingSession.first_pass_correct}) Incorrect ({myTrainingContext.currentTrainingSession.first_pass_incorrect}) </h4>
            <h4 className="results-header"> Rounds to Complete: ({myTrainingContext.currentTrainingSession.rounds_to_finish}) </h4>
        </div>
    )
}

const TrainingSessionTable = () => {
    return (
        <div>
            <table className="table-container">
                <TrainingSessionTableHeader/>
                <TrainingSessionList/>
            </table>
        </div>
    )
}

const TrainingSessionTableHeader = () => {
    return (
        <thead>
            <tr>
                <th>CARD</th>
                <th>QUESTION</th>
                <th>RESPONSE</th>
                <th>CORRECT ANSWER</th>
                <th>SECONDS</th>
            </tr>
        </thead>
    )
}

const TrainingSessionList = () => {
    const myTrainingContext = useMyTrainingContext()
    const myAppContext = useMyAppContext()
    const currentSessionResults = myTrainingContext.currentSessionResults
    const currentCards = myAppContext.allCardsBySubject

    return (
        currentSessionResults.sort((a, b) => a.card_id - b.card_id)
            .map((card_result) => {
                const secToAnswer = Math.round(card_result.seconds_to_answer * 10) / 10
                const cardIndexAssociatedWithResult = currentCards.findIndex(card => card.id === card_result.card_id)
                const card = currentCards[cardIndexAssociatedWithResult]

                if (card_result.is_correct) {
                    return (
                        <tbody>
                            <tr key={card_result.card_id}>
                                <td> {card.card_number} </td>
                                <td> {card_result.question} </td>
                                <td> {card_result.guess} </td>
                                <td className="correct-row"> &#10003; </td>
                                <td> {secToAnswer} </td>
                            </tr>
                        </tbody>
                    )
                } else {
                    return (
                        <tbody>
                            <tr key={card_result.id}>
                                <td> {card.card_number} </td>
                                <td> {card_result.question} </td>
                                <td className="incorrect-guess">{card_result.guess}</td>
                                <td> {card_result.answer} </td>
                                <td> {secToAnswer} </td>
                            </tr>
                        </tbody>
                    )
                }
            })
    )
}
