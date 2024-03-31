import React from 'react'
import { useMyTrainingContext } from '../../contexts/TrainingContextProvider'
import { useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, ChooseIdWidget } from '../Components'
import { ToastContainer } from 'react-toastify'
import './trainingStyles.css'

export const TrainingSessionsPage = () => {

    const myAppUpdateContext = useMyAppUpdateContext()
    const myTrainingContext = useMyTrainingContext()

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
                    const session_start_time = new Date(trainingSession.session_start_time)
                    const session_month = session_start_time.getMonth() + 1

                    return (
                        <tr key={trainingSession.id}>
                            <td className="center-align">{trainingSession.id}</td>
                            <td className="center-align">{session_month + "/" + session_start_time.getDate()}</td>
                            <td className="center-align">{session_start_time.getHours() + ":" + session_start_time.getMinutes()}</td>
                            <td className="center-align">{trainingSession.num_correct}</td>
                            <td className="center-align">{trainingSession.num_incorrect}</td>
                            <td className="center-align">{percentCorrect}</td>
                            <td className="center-align">NA</td>
                        </tr>
                    )
                })
        )
    }

    const TrainingSessionsPageBody = () => {
        return (
            <div className="container">
                < ChooseIdWidget formType="training_session" />
                < TrainingSessionsTable />
                <hr />
                < TrainingSummaryButton />
                < ToastContainer />
            </div>
        )
    }

    return (
        <div>
            < PageHeader pageTitle="Training Sessions" />
            < TrainingSessionsPageBody />
        </div>
    )
}
