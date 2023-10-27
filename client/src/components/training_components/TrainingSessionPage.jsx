import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext } from '../../contexts/AppContextProvider'
import { BackButton } from '../Components'
import { ToastContainer } from 'react-toastify'
import './styles/TrainingSessionPage.css'

export const TrainingSessionPage = () => {

    const myAppContext = useMyAppContext()
    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    const TrainingSessionTable = () => {
        const trainingSessionCardResults = myTrainingContext.currentCardResults

        if ((trainingSessionCardResults === null) || (trainingSessionCardResults.length === 0)) {

            return (
                <div>
                    No card results exist!
                </div>
            )

        } else {

            return (
                <>
                    <h5> Subject: {myAppContext.subjectName} </h5>
                    <h3> Training Session Results ({myTrainingContext.currentTrainingSession.session_start_time.toLocaleDateString()}) </h3>

                    <hr />
                    <h4> Correct: {myTrainingContext.numberCorrect} - Incorrect: {myTrainingContext.numberIncorrect} </h4>
                    <table className="table-wrapper">
                        <tbody>
                            < ResultsHeader />
                            < TrainingSessionCardResultsList trainingResults={trainingSessionCardResults} />
                        </tbody>
                    </table>
                    <hr />

                    <form ref={myTrainingContext.trainingSessionFormRef}>
                        <label className="input-label">
                            Card Id:{" "}
                            <input type="number" name="cardId" autoFocus required minLength="1" />
                        </label>
                        <br />
                        <button type="submit" className="input-button" onClick={myTrainingUpdateContext.loadTrainingCardResultsPage}>
                            View All Answers
                        </button>
                    </form>
                </>
            )
        }

    }

    const ResultsHeader = () => {
        return (
            <tr>
                <th> Card </th>
                <th> Answer </th>
                <th> Correct </th>
                <th> Sec </th>
            </tr>
        )
    }

    const TrainingSessionCardResultsList = (props) => {
        let trainingSessionCardResults = props.trainingResults

        return (
            trainingSessionCardResults.sort((a, b) => a.card_id - b.card_id)
                .map((result) => {
                    const secToAnswer = Math.round(result.seconds_to_answer * 10) / 10

                    if (result.is_correct) {

                        return (
                            <tr key={result.id} className="correct-row">
                                <td style={{ textAlign: 'center' }}> {result.card_id} </td>
                                <td> {result.guess} </td>
                                <td> &#10003; </td>
                                <td> {secToAnswer} </td>
                            </tr>
                        )

                    } else {

                        return (
                            <tr key={result.id} >
                                <td style={{ textAlign: 'center' }}> {result.card_id} </td>
                                <td className="incorrect-guess">{result.guess}</td>
                                <td> {result.answer} </td>
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
                < BackButton previousPage="TrainingSessionsPage" />
                < TrainingSessionTable />
                < ToastContainer />
            </div>
        </>
    )
}
