import React from 'react'
import { SubmitButton, PageHeader } from '../Components'
import { useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'

export const MainMenuPage = () => {
    return (
        <div className="page-container">
            <div id="main-menu-page-id" style={{ display: 'none' }}> </div>
            <div className="section-container">
                <PageHeader/>
                <MainMenuPageBody/>
            </div>
        </div>
    )
}

const MainMenuPageBody = () => {
    const myAppUpdateContext = useMyAppUpdateContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    return (
        <div>
            <div className="section-container">
                <div className="main-menu-button-group">
                    <SubmitButton id="change-subject-button" onClick={() => myAppUpdateContext.updateCurrentPageTo("Subject")}>Change Subject</SubmitButton>
                    <SubmitButton id="update-cards-button" onClick={() => myAppUpdateContext.updateCurrentPageTo("Card Menu")}>Update Cards</SubmitButton>
                    <SubmitButton id="training-menu-button" onClick={() => myTrainingUpdateContext.loadTrainingMenuPage()}>Training</SubmitButton>
                </div>
            </div>
        </div>
    )
}

