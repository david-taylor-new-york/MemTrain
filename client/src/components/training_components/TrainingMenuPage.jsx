import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader } from '../Components'
import './trainingStyles.css'

export const TrainingMenuPage = () => {
    const myAppContext = useMyAppContext()
    const myTrainingContext = useMyTrainingContext()
    const myAppUpdateContext = useMyAppUpdateContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    const displayTrainingPageButton = myAppContext.allCards.length > 0
    const displayTrainingSessionsButton = myTrainingContext.allTrainingSessions.length > 0

    const TrainingPageButton = () => {
        if (displayTrainingPageButton) {
            return (
                <input type="button" className="button" defaultValue="Train" onClick={() => { myTrainingUpdateContext.loadTrainingSetupPage() }} />
            )
        }
    }
    
    const TrainingSessionsPageButton = () => {
        if (displayTrainingSessionsButton) {
            return (
                <input type="button" className="button" defaultValue="Training Sessions" onClick={() => { myAppUpdateContext.updateCurrentPageTo("TrainingSessionsPage") }}  />
            )
        }
    }

    const PageBody = () => {
        return (
            <div className="container">
                < TrainingPageButton />
                < TrainingSessionsPageButton />
                { !displayTrainingPageButton && !displayTrainingSessionsButton && "Create some cards!" }
            </div>
        );
    }

    return (
        <div>
            < PageHeader pageTitle="Training Menu" />
            < PageBody />
        </div>
    )
}
