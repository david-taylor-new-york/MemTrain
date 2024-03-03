import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { LogOutButton } from '../Components'
import '../commonStyles.css'

export const MainMenuPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()
    
    return (
        <div className="container">
            <LogOutButton />
            <h4 className="subject-sub-header">Subject: {myAppContext.subjectName}</h4>
            <h3 className="page-title">Main Menu</h3>
            <hr />
            <div className="button-group">
                <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("SubjectPage")}>Change Subject</button>
                <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("CardMenuPage")}>Update Cards</button>
                <button className="button" onClick={() => myTrainingUpdateContext.loadTrainingMenuPage()}>Training</button>
            </div>
        </div>
    )
}
