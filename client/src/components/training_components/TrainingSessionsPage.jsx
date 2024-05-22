import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, ChooseIdWidget } from '../Components'

export const TrainingSessionsPage = () => {

    return (
        <div className="page-container">
            <div id="training-sessions-page-id" style={{ display: 'none' }}> </div>
            < PageHeader />
            < TrainingSessionsPageBody />
        </div>
    )
}

const TrainingSessionsPageBody = () => {
    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    return (
        <div className="section-container">
            < ChooseIdWidget formRef={myTrainingContext.trainingSessionsFormRef} buttonLabel={'View Session'} submitCall={myTrainingUpdateContext.loadTrainingSessionPage} idLabel={'ID:'} />
            < TrainingSummaryButton />
            < TrainingSessionsTable />
        </div>
    )
}

const TrainingSessionsTable = () => {
    return (
        <div >
            <table className="table-container training-session-table-container">
                < TrainingSessionsTableHeader />
                < TrainingSessionsList />
            </table>
        </div>
    )
}

const TrainingSessionsTableHeader = () => {
    return (
        <thead >
            <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TIME</th>
                <th>CORRECT</th>
                <th>INCORRECT</th>
                <th>1ST PASS %</th>
                <th>ROUNDS</th>
            </tr>
        </thead>
    )
}

const TrainingSessionsList = () => {
    const myTrainingContext = useMyTrainingContext()
    const localTrainingSessions = myTrainingContext.allTrainingSessions

    return (
        localTrainingSessions.sort((a, b) => a.session_number - b.session_number)
            .map((trainingSession) => {
                let percentCorrect = 100
                if (trainingSession.first_pass_incorrect !== 0) {
                    percentCorrect = Math.trunc(trainingSession.first_pass_correct / (trainingSession.first_pass_correct + trainingSession.first_pass_incorrect) * 100)
                }
                percentCorrect = "(" + percentCorrect.toString() + "%)"
                const session_start_time = new Date(trainingSession.session_start_time)
                const session_month = session_start_time.getMonth() + 1

                return (
                    <tbody>
                        <tr key={trainingSession.session_number}>
                            <td>{trainingSession.session_number}</td>
                            <td>{session_month + "/" + session_start_time.getDate() + "/" + session_start_time.getFullYear().toString().slice(-2)}</td>
                            <td>{session_start_time.getHours() + ":" + session_start_time.getMinutes().toString().padStart(2, '0')}</td>
                            <td>{trainingSession.first_pass_correct}</td>
                            <td>{trainingSession.first_pass_incorrect}</td>
                            <td>{percentCorrect}</td>
                            <td>{trainingSession.rounds_to_finish}</td>
                        </tr>
                    </tbody>
                )
            })
    )
}

const TrainingSummaryButton = () => {
    const myAppUpdateContext = useMyAppUpdateContext()

    return (
        <div className="section-container">
            <div className="view-sessions-button-group">
                <input className="button" type="button" defaultValue="View Training Summary" onClick={() => { myAppUpdateContext.updateCurrentPageTo("Training Summary") }} />
            </div>
        </div>
    )
}

