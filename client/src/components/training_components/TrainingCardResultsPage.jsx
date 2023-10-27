import React from 'react'
import { useMyTrainingContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext } from '../../contexts/AppContextProvider'
import { BackButton } from '../Components'
import './styles/TrainingCardResultsPage.css'

export const TrainingCardResultsPage = () => {

    const myAppContext = useMyAppContext()
    const myTrainingContext = useMyTrainingContext()

    const TrainingCardResultsTable = () => {

        const trainingCardResults = myTrainingContext.currentCardResults

        if ((trainingCardResults === null) || (trainingCardResults.length === 0)) {
            return (
                <div>
                    No card results exist!
                </div>
            )
        } else {
            return (
                <>
                    <h5> Subject: {myAppContext.subjectName} </h5>
                    <h3> Training Card Results (card: {trainingCardResults[0].card_id}) </h3>
                    <hr />
                    <h4> Correct: {myTrainingContext.numberCorrect} - Incorrect: {myTrainingContext.numberIncorrect} </h4>
                    <table className="training-results-table">
                        <tbody>
                            < ResultsHeader />
                            < TrainingCardResultsList trainingResults={trainingCardResults} />
                        </tbody>
                    </table>
                    <hr />
                </>
            )
        }

    }

    const ResultsHeader = () => {
        return (
            <tr>
                <th> Date </th>
                <th> Answer </th>
                <th> Correct </th>
                <th> Sec </th>
            </tr>
        )
    }

    const TrainingCardResultsList = (props) => {
        const trainingSessions = myTrainingContext.allTrainingSessions

        let trainingCardResults = props.trainingResults
        return (
            trainingCardResults.sort((a, b) => a.id - b.id)
                .map((cardResult) => {
                    const secToAnswer = Math.round(cardResult.seconds_to_answer * 10) / 10
                    const trainingSessionIndex = trainingSessions.findIndex(trainingSession => trainingSession.id === cardResult.training_session_id)
                    const inputDate = trainingSessions[trainingSessionIndex].session_start_time
                    const dateOfAnswer = new Date(inputDate)
                    const formattedDate = `${dateOfAnswer.getMonth() + 1}-${dateOfAnswer.getDate()}-${dateOfAnswer.getFullYear()}`

                    if (cardResult.is_correct) {

                        return (
                            <tr key={cardResult.id} className="correct-answer">
                                <td> {formattedDate} </td>
                                <td> {cardResult.guess} </td>
                                <td> &#10003; </td>
                                <td> {secToAnswer} </td>
                            </tr>
                        )

                    } else {

                        return (
                            <tr key={cardResult.id} >
                                <td> {formattedDate} </td>
                                <td className="incorrect-answer"> {cardResult.guess} </td>
                                <td> {cardResult.answer} </td>
                                <td> {secToAnswer} </td>
                            </tr>
                        )
                        
                    }
                }
                )
        )
    }

    return (
        <>
            <div>
                < BackButton previousPage="TrainingSessionPage" />
                < TrainingCardResultsTable />
            </div>
        </>
    )
}