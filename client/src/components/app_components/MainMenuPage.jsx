import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { LogOutButton } from '../Components'
import './styles/MainMenuPage.css'

export const MainMenuPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()
    
    return (
        <div className="container">
            <LogOutButton />
            <h5 className="sub-header">Subject: {myAppContext.subjectName}</h5>
            <h3 className="header">Main Menu</h3>
            <hr />
            <div className="button-group">
                <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("SubjectPage")}>Change Subject</button>
                <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("CardMenuPage")}>Update Cards</button>
                <button className="button" onClick={() => myTrainingUpdateContext.loadTrainingMenuPage()}>Training</button>
            </div>
        </div>
    )
}
