import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, SubmitButton } from '../Components'
import '../commonStyles.css'

export const TrainingMenuPage = () => {
    return (
        <div className="page-container">
            <div className="page-section-container">
                < PageHeader pageTitle="Training Menu" />
                < TrainingMenuPageBody />
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
            <div className="page-section-container">
                <div className="main-menu-button-group">
                    <SubmitButton showButton={displayTrainingPageButton} onClick={() => myTrainingUpdateContext.loadTrainingSetupPage()}> Train </SubmitButton>
                    <SubmitButton showButton={displayTrainingSessionsButton} onClick={() => myAppUpdateContext.updateCurrentPageTo("TrainingSessionsPage")}> Training Sessions </SubmitButton>
                    {!displayTrainingPageButton && !displayTrainingSessionsButton && <SubmitButton onClick={() => myAppUpdateContext.updateCurrentPageTo("MainMenuPage")}> Create some cards! </SubmitButton>}
                    < SubmitButton onClick={() => myAppUpdateContext.updateCurrentPageTo("MainMenuPage")}> Cancel </SubmitButton>
                </div>
            </div>
        </div>
    )
}
