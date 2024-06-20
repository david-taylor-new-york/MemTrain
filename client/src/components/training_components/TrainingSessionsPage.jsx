import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, ChooseIdWidget } from '../Components'
import { DAYS_OF_WEEK, formatDate, formatTime, calculatePercentCorrect } from '../../utils/utils'

export const TrainingSessionsPage = () => {
    return (
        <div className="page-container">
            <div id="training-sessions-page-id" style={{ display: 'none' }}> </div>
            <PageHeader/>
            <TrainingSessionsPageBody/>
        </div>
    )
}

const TrainingSessionsPageBody = () => {
    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    return (
        <div className="section-container">
            <ChooseIdWidget formRef={myTrainingContext.trainingSessionsFormRef} buttonLabel={'View Session'} submitCall={myTrainingUpdateContext.loadTrainingSessionPage} idLabel={'ID:'}/>
            <TrainingSummaryButton/>
            <TrainingSessionsTable/>
        </div>
    )
}

const TrainingSessionsTable = () => {
    return (
        <div>
            <table className="table-container training-session-table-container">
                <TrainingSessionsTableHeader/>
                <TrainingSessionsList/>
            </table>
        </div>
    )
}

const TrainingSessionsTableHeader = () => {
    return (
        <thead>
            <tr>
                <th>ID</th>
                <th>DAY</th>
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
        [...localTrainingSessions].sort((a, b) => a.session_number - b.session_number)
            .map((trainingSession) => {
                const percentCorrect = calculatePercentCorrect(trainingSession)
                const sessionStart = new Date(trainingSession.session_start_time)
                const sessionStartDateString = formatDate(sessionStart)
                const sessionStartTime = formatTime(sessionStart)

                return (
                    <tbody>
                        <tr key={trainingSession.session_number}>
                            <td>{trainingSession.session_number}</td>
                            <td>{DAYS_OF_WEEK[sessionStart.getDay()]}</td>
                            <td>{sessionStartDateString}</td>
                            <td>{sessionStartTime}</td>
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

