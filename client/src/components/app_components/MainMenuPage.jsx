import React from 'react'
import { SubmitButton, PageHeader } from '../Components'
import { useMyAppUpdateContext } from '../../contexts/AppContextProvider' // Import the app context hook
import { useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider' // Import the training context hook

export const MainMenuPage = () => {

    return (
        <div className="page-container">
            <div className="page-section-container">
                < PageHeader pageTitle="Main Menu" />
                < MainMenuPageBody />
            </div>
        </div>
    )
}

const MainMenuPageBody = () => {
    const myAppUpdateContext = useMyAppUpdateContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    return (
        <div>
            <div className="page-section-container">
                <div className="main-menu-button-group">
                    <SubmitButton onClick={() => myAppUpdateContext.updateCurrentPageTo("SubjectPage")}>Change Subject</SubmitButton>
                    <SubmitButton onClick={() => myAppUpdateContext.updateCurrentPageTo("CardMenuPage")}>Update Cards</SubmitButton>
                    <SubmitButton onClick={() => myTrainingUpdateContext.loadTrainingMenuPage()}>Training</SubmitButton>
                </div>
            </div>
        </div>
    )
}

