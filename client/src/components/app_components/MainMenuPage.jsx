import React from 'react'
import { useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { PageHeader } from '../Components'
import '../commonStyles.css'

export const MainMenuPage = () => {
    const myAppUpdateContext = useMyAppUpdateContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    const PageBody = () => {
        return (
            <div className="container">
                <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("SubjectPage")}>Change Subject</button>
                <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("CardMenuPage")}>Update Cards</button>
                <button className="button" onClick={() => myTrainingUpdateContext.loadTrainingMenuPage()}>Training</button>
            </div>
        );
    }

    return (
        <div>
            <PageHeader pageTitle="Main Menu" previousPage="SubjectPage" />
            <PageBody />
        </div>
    )
}
