import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, SubmitButton } from '../Components'

export const TrainingMenuPage = () => {
    return (
        <div className="page-container">
            <div id="training-menu-page-id" style={{ display: 'none' }}> </div>
            <div className="section-container">
                <PageHeader/>
                <TrainingMenuPageBody/>
            </div>
        </div>
    )
}

const TrainingMenuPageBody = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()
    const myTrainingContext = useMyTrainingContext()

    const displayTrainingPageButton = myAppContext.allCardsBySubject.length > 0
    const displayTrainingSessionsButton = myTrainingContext.allTrainingSessions.length > 0

    return (
        <div>
            <div className="section-container">
                <div className="main-menu-button-group">
                    <SubmitButton id="menu-train-button" showButton={displayTrainingPageButton} onClick={() => myTrainingUpdateContext.loadTrainingSetupPage()}> Train </SubmitButton>
                    <SubmitButton id="training-sessions-button" showButton={displayTrainingSessionsButton} onClick={() => myAppUpdateContext.updateCurrentPageTo("Training Sessions")}> Training Sessions </SubmitButton>
                    {!displayTrainingPageButton && !displayTrainingSessionsButton && <SubmitButton id="create-some-cards-text" onClick={() => myAppUpdateContext.updateCurrentPageTo("Main Menu")}> Create some cards! </SubmitButton>}
                    <SubmitButton id="cancel-button" onClick={() => myAppUpdateContext.updateCurrentPageTo("Main Menu")}> Cancel </SubmitButton>
                </div>
            </div>
        </div>
    )
}
