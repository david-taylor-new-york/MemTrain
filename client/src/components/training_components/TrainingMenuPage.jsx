import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext } from '../../contexts/AppContextProvider'
import { BackButton, LogOutButton } from '../Components'
import './styles/TrainingMenuPage.css' // Import styles

export const TrainingMenuPage = () => {
    const myAppContext = useMyAppContext()
    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    const displayTrainingPageButton = myAppContext.allCards.length > 0
    const displayTrainingSessionsButton = myTrainingContext.allTrainingSessions.length > 0

    const TrainingPageButton = () => {
        return (
            <input 
                type="button" 
                className="button-main-css" 
                defaultValue="Train" 
                onClick={() => { myTrainingUpdateContext.loadTrainingSetupPage() }} 
            />
        )
    }
    
    const TrainingSessionsPageButton = () => {
        return (
            <input 
                type="button" 
                className="button-main-css" 
                defaultValue="Training Sessions" 
                onClick={() => { myTrainingUpdateContext.loadTrainingSessionsPage() }} 
            />
        )
    }

    return (
        <>
            <BackButton previousPage="MainMenuPage" />
            <LogOutButton />
            <h5> Subject: { myAppContext.subjectName } </h5>
            <h3> Training Menu </h3>
            <hr />
            <br />
            <div>
                { displayTrainingPageButton && <TrainingPageButton /> }
                { displayTrainingSessionsButton && <TrainingSessionsPageButton /> }
                { !displayTrainingPageButton && !displayTrainingSessionsButton && "Create some cards!" }
            </div>
        </>
    )
}
