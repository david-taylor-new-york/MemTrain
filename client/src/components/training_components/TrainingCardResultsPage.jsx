import React from 'react'
import { useMyTrainingContext } from '../../contexts/TrainingContextProvider'
import { useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader } from '../Components'
import '../commonStyles.css'

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
    const myTrainingContext = useMyTrainingContext()

    return (
        <div className="section-container">
            < TrainingSessionsSummary />
            <button id="cancel-button" className="button" type="button" onClick={myAppUpdateContext.handleCancel}>Cancel</button>
            <table className="table-container">
                < TrainingCardResultsTableHeader />
                < TrainingCardResultsList trainingResults={myTrainingContext.currentCardResults} />
            </table>
        </div>
    )
}

const TrainingSessionsSummary = () => {
    const myTrainingContext = useMyTrainingContext()

    return (
        <div className="section-container">
            <h4 class="results-header"> Card Id: {myTrainingContext.currentCardResults[0].card_id} </h4>
            <h4 class="results-header"> Question: {myTrainingContext.currentCardResults[0].question} </h4>
            <h4 class="results-header"> Correct Answer: {myTrainingContext.currentCardResults[0].answer} </h4>
            <h4 class="results-header"> Correct ({myTrainingContext.numberCorrect})   Incorrect ({myTrainingContext.numberIncorrect}) </h4>
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

const TrainingCardResultsList = (props) => {
    const myTrainingContext = useMyTrainingContext()
    const trainingSessions = myTrainingContext.allTrainingSessions

    let trainingCardResults = props.trainingResults
    return (
        trainingCardResults.sort((a, b) => a.id - b.id)
            .map((cardResult) => {
                const secToAnswer = Math.round(cardResult.seconds_to_answer * 10) / 10
                const trainingSessionIndex = trainingSessions.findIndex(trainingSession => trainingSession.id === cardResult.training_session_id)
                const inputDate = trainingSessions[trainingSessionIndex].session_start_time
                const dateOfAnswer = new Date(inputDate)
                const formattedDate = `${dateOfAnswer.getMonth() + 1}/${dateOfAnswer.getDate()}/${dateOfAnswer.getFullYear().toString().slice(-2)}`
                const formattedTime = `${dateOfAnswer.getHours() + 1}:${dateOfAnswer.getMinutes().toString().padStart(2, '0')}`

                if (cardResult.is_correct) {

                    return (
                        <tr key={cardResult.id} >
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
