import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { BackButton } from '../Components'
import { ToastContainer } from 'react-toastify'
import './styles/TrainingSessionsPage.css' // Import the styles

export const TrainingSessionsPage = () => {

    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()
    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    const TrainingSummaryButton = () => {

        return (
            <input type="button" defaultValue="Training Summary" onClick={() => { myAppUpdateContext.updateCurrentPageTo("TrainingSummaryPage") }} />
        )
    }

    const TrainingSessionsHeader = () => {

        return (
            <>
                <h5> Subject: {myAppContext.subjectName} </h5>
                <h3> Training Sessions </h3>
                <hr />
            </>
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
                <table className="table-wrapper">
                <tbody>
                        < TrainingSessionsTableHeader />
                        < TrainingSessionsList trainingSessions={trainingSessions} />
                    </tbody>
                </table>
            )
        }
    }

    const TrainingSessionsTableHeader = () => {

        return (
            <tr>
                <th>Id</th>
                <th>Date</th>
                <th>Time</th>
                <th>Correct</th>
                <th>Incorrect</th>
                {/* <th>%</th> */}
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
                        <td>{percentCorrect}</td>
                    </tr>
                    )
                })
        )
    }

    const ViewTrainingSessionById = () => {

        return (
            <>
                <form ref={myTrainingContext.trainingSessionsFormRef} >
                <label className="input-label">
                        Session Id:{" "}
                        <input type="number" name="sessionId" autoFocus required minLength="1" />
                    </label>
                    <br />
                    <button type="submit" className="input-button" onClick={myTrainingUpdateContext.loadTrainingSessionPage}>
                        View Session
                    </button>
                </form>
                <hr />
            </>
        )
    }

    return (
        <>
            < BackButton previousPage="TrainingMenuPage" />
            < TrainingSessionsHeader />
            < TrainingSummaryButton />
            <hr />
            < TrainingSessionsTable />
            <hr />
            < ViewTrainingSessionById />
            < ToastContainer />
        </>
    )
}
