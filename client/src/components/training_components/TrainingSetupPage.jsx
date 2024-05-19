import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, SubmitButton } from '../Components'

export const TrainingSetupPage = () => {
    return (
        <div className="page-container">
            <div id="training-setup-page-id" style={{ display: 'none' }}> </div>
            < PageHeader />
            < TrainingSetupPageBody />
        </div>
    )
}

const TrainingSetupPageBody = () => {
    const myAppContext = useMyAppContext()

    return (
        <div className="section-container">
            <h3> Total Questions: {myAppContext.allCardsBySubject.length} </h3>
            < PracticeOrRecordedRadioButtons />
            < ButtonGroup />
        </div>
    )
}

const PracticeOrRecordedRadioButtons = () => {
    const myTrainingContext = useMyTrainingContext()
    return (
        <div className="radio-tray">
            <form ref={myTrainingContext.trainingSettingsFormRef}>
                <label className="radio-label">
                    <input id="practice-radiobutton" type="radio" name="training_type" value="practice" defaultChecked />
                    Practice
                </label>
                <label className="radio-label">
                    <input id="recorded-radiobutton" type="radio" name="training_type" value="recorded" />
                    Recorded
                </label>
            </form>
        </div>
    )
}

const ButtonGroup = () => {
    const myAppUpdateContext = useMyAppUpdateContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()
    return (
        <div className="main-menu-button-group">
            < SubmitButton id="train-button" onClick={() => myTrainingUpdateContext.startTraining()}> Train </SubmitButton>
            < SubmitButton id="cancel-button" onClick={() => myAppUpdateContext.updateCurrentPageTo("Training Menu")}> Cancel </SubmitButton>
        </div>
    )
}
