import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext } from '../../contexts/AppContextProvider'
import { BackButton, LogOutButton } from '../Components'

export const TrainingMenuPage = () => {
    const myAppContext = useMyAppContext()
    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    const displayTrainingPageButton = myAppContext.allCards.length > 0
    const displayTrainingSessionsButton = myTrainingContext.allTrainingSessions.length > 0

    const TrainingPageButton = () => {
        return (
            <input type="button" className="button-main-css" order="4" defaultValue="Train" progress="10" onClick={ () => { myTrainingUpdateContext.loadTrainingSetupPage()  }} />
        )
    }
    
    const TrainingSessionsPageButton = () => {
        return (
            <input type="button" className="button-main-css" order="5" defaultValue="Training Sessions" onClick={ () => { myTrainingUpdateContext.loadTrainingSessionsPage() }} />
        )
    }

    return (
        <>
            < BackButton previousPage="MainMenuPage" />
            < LogOutButton />
            <h5> Subject: { myAppContext.subjectName } </h5>
            <h3> Training Menu </h3>
            <hr/>
            <br/>
            <div>
                { displayTrainingPageButton ? < TrainingPageButton /> : null }
                { displayTrainingSessionsButton > 0 ? < TrainingSessionsPageButton /> : null }
                { !displayTrainingPageButton > 0 && !displayTrainingSessionsButton ? "Create some cards!" : null }
            </div>
        </>
    )
}
