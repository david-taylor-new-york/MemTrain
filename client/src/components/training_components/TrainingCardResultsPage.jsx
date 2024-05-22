import React from 'react'
import { useMyTrainingContext } from '../../contexts/TrainingContextProvider'
import { useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, SubmitButton } from '../Components'

export const TrainingCardResultsPage = () => {

    return (
        <div className="page-container">
            <div id="training-card-results-page-id" style={{ display: 'none' }}> </div>
            < PageHeader />
            < TrainingCardResultsPageBody />
        </div>
    )
}

const TrainingCardResultsPageBody = () => {
    const myAppUpdateContext = useMyAppUpdateContext()

    return (
        <div className="section-container">
            < TrainingSessionsSummary />
            < SubmitButton id="cancel-button" onClick={myAppUpdateContext.handleCancel}> Cancel </SubmitButton>
            < TrainingCardResultsTable />
        </div>
    )
}

const TrainingSessionsSummary = () => {
    const myTrainingContext = useMyTrainingContext()

    return (
        <div className="section-container">
            <h4 className="results-header"> Card Id: {myTrainingContext.currentCardResults[0].card_id} </h4>
            <h4 className="results-header"> Question: {myTrainingContext.currentCardResults[0].question} </h4>
            <h4 className="results-header"> Correct Answer: {myTrainingContext.currentCardResults[0].answer} </h4>
            <h4 className="results-header"> Correct ({myTrainingContext.numberCorrect})   Incorrect ({myTrainingContext.numberIncorrect}) </h4>
        </div>
    )
}

const TrainingCardResultsTable = () => {
    return (
        <div >
            <table className="table-container">
                < TrainingCardResultsTableHeader />
                < TrainingCardResultsList />
            </table>
        </div>
    )
}

const TrainingCardResultsTableHeader = () => {
    return (
        <thead >
            <tr>
                <th>DATE</th>
                <th>TIME</th>
                <th>ANSWER GIVEN</th>
                <th>SECONDS</th>
            </tr>
        </thead>
    )
}

const TrainingCardResultsList = () => {
    const myTrainingContext = useMyTrainingContext()
    const trainingSessions = myTrainingContext.allTrainingSessions
    const currentCardResults = myTrainingContext.currentCardResults

    return (
        currentCardResults.sort((a, b) => a.card_id - b.card_id)
            .map((cardResult) => {
                const secToAnswer = Math.round(cardResult.seconds_to_answer * 10) / 10
                const trainingSessionIndex = trainingSessions.findIndex(trainingSession => trainingSession.id === cardResult.training_session_id)
                const inputDate = trainingSessions[trainingSessionIndex].session_start_time
                const dateOfAnswer = new Date(inputDate)
                const formattedDate = `${dateOfAnswer.getMonth() + 1}/${dateOfAnswer.getDate()}/${dateOfAnswer.getFullYear().toString().slice(-2)}`
                const formattedTime = `${dateOfAnswer.getHours() + 1}:${dateOfAnswer.getMinutes().toString().padStart(2, '0')}`

                if (cardResult.is_correct) {

                    return (
                        <tr key={cardResult.card_id} >
                            <td> {formattedDate} </td>
                            <td> {formattedTime} </td>
                            <td className="correct-row"> {cardResult.guess} </td>
                            <td> {secToAnswer} </td>
                        </tr>
                    )

                } else {

                    return (
                        <tr key={cardResult.id} >
                            <td> {formattedDate} </td>
                            <td> {formattedTime} </td>
                            <td className="incorrect-guess"> {cardResult.guess} </td>
                            <td> {secToAnswer} </td>
                        </tr>
                    )

                }
            }
            )
    )
}
