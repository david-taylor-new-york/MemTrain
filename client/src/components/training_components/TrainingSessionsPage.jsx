import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader } from '../Components'
import { ToastContainer } from 'react-toastify'
import './trainingStyles.css'

export const TrainingSessionsPage = () => {

    const myAppUpdateContext = useMyAppUpdateContext()
    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    const TrainingSummaryButton = () => {

        return (
            <input className="button" type="button" defaultValue="Training Summary" onClick={() => { myAppUpdateContext.updateCurrentPageTo("TrainingSummaryPage") }} />
        )
    }

    const TrainingSessionsTable = () => {
        const trainingSessions = myTrainingContext.allTrainingSessions

        if ((trainingSessions === null) || (trainingSessions.length === 0)) {
            return (
                <tr>
                    <td> No training sessions exist </td>
                </tr>
            )
        } else {
            return (
                <div >
                    <table className="content-table">
                        <tbody>
                        < TrainingSessionsTableHeader />
                        < TrainingSessionsList trainingSessions={trainingSessions} />
                        </tbody>
                    </table>
                </div>
            )
        }
    }

    const TrainingSessionsTableHeader = () => {

        return (
            <tr>
                <th>Session</th>
                <th>Date</th>
                <th>Time</th>
                <th>Correct</th>
                <th>Incorrect</th>
                <th>First Pass %</th>
                <th>Rounds to Complete</th>
            </tr>
        )
    }

    const TrainingSessionsList = (props) => {
        let localTrainingSessions = props.trainingSessions

        return (
            localTrainingSessions.sort((a, b) => a.id - b.id)
                .map((trainingSession) => {
                    let percentCorrect = 100
                    if (trainingSession.num_incorrect !== 0) {
                        percentCorrect = Math.trunc(trainingSession.num_correct / (trainingSession.num_correct + trainingSession.num_incorrect) * 100)
                    }
                    percentCorrect = "(" + percentCorrect.toString() + "%)"
                    let session_start_timee = new Date(trainingSession.session_start_time)

                    return (
                        <tr key={trainingSession.id}>
                        <td className="center-align">{trainingSession.id}</td>
                        <td className="center-align">{session_start_timee.getMonth() + "/" + session_start_timee.getDate()}</td>
                        <td className="center-align">{session_start_timee.getHours() + ":" + session_start_timee.getMinutes()}</td>
                        <td className="center-align">{trainingSession.num_correct}</td>
                        <td className="center-align">{trainingSession.num_incorrect}</td>
                        <td className="center-align">{percentCorrect}</td>
                        <td className="center-align">NA</td>
                    </tr>
                    )
                })
        )
    }

    const ViewTrainingSessionById = () => {

        return (
            <div>
                <form ref={myTrainingContext.trainingSessionsFormRef} >
                    <label >
                        Session:{" "}
                        <input id="card_id" type="number" name="sessionId" autoFocus required minLength="1" />
                    </label>
                    <br />
                    <button className="button" type="submit" onClick={myTrainingUpdateContext.loadTrainingSessionPage}>
                        View Session
                    </button>
                </form>
                <hr />
            </div>
        )
    }

    const PageBody = () => {
        return (
            <div className="container">
                 < TrainingSummaryButton />
                 <hr />
                 < TrainingSessionsTable />
                 <hr />
                 < ViewTrainingSessionById />
                 < ToastContainer />
            </div>
        );
    }

    return (
        <div>
            < PageHeader pageTitle="Training Sessions" />
            < PageBody />
        </div>
    )
}
