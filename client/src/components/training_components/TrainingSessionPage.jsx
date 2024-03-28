import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { PageHeader } from '../Components'
import { ToastContainer } from 'react-toastify'
import './trainingStyles.css'

export const TrainingSessionPage = () => {

    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    const PageBody = () => {
        const trainingSessionCardResults = myTrainingContext.currentCardResults

        return (
            <div className="container">
                <h4> Correct: {myTrainingContext.numberCorrect} - Incorrect: {myTrainingContext.numberIncorrect} </h4>
                <table className="content-table">
                    <tbody>
                        < ResultsHeader />
                        < TrainingSessionCardResultsList trainingResults={trainingSessionCardResults} />
                    </tbody>
                </table>
                <hr />

                <form ref={myTrainingContext.trainingSessionFormRef}>
                    view all Answers for Card:{" "}
                    <input id="card_id" type="number" name="cardId" autoFocus required minLength="1" />
                    <button className="button" id="add-button" type="submit" onClick={myTrainingUpdateContext.loadTrainingCardResultsPage}>
                        View
                    </button>
                </form>
            </div>
        );
    }

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
                <div>
                    < PageHeader pageTitle="Training Session Results" />
                    < PageBody />
                </div>
            )
        }
    }

    const ResultsHeader = () => {
        return (
            <tr>
                <th> Card </th>
                <th> Question </th>
                <th> Given Answer </th>
                <th> Correct Answer</th>
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
                                <td> {result.card_id} </td>
                                <td> {result.question} </td>
                                <td> {result.guess} </td>
                                <td> &#10003; </td>
                                <td> {secToAnswer} </td>
                            </tr>
                        )

                    } else {

                        return (
                            <tr key={result.id} >
                                <td> {result.card_id} </td>
                                <td> {result.question} </td>
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
        <div>
            < TrainingSessionTable />
            < ToastContainer />
        </div>
    )
}
