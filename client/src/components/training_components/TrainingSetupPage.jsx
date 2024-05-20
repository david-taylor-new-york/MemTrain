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
            <h3> Total Cards: {myAppContext.allCardsBySubject.length} </h3>
            < PracticeOrRecordedRadioButtons />
            < ButtonGroup />
        </div>
    )
}

const PracticeOrRecordedRadioButtons = () => {
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    const handleChange = (event) => {
        myTrainingUpdateContext.setTrainingType(event.target.value);
    };

    return (
        <div className="radio-container">
            <div className="radio-row">
                <input id="practice-radiobutton" type="radio" name="training_type" value="practice" onChange={handleChange} />
                <label htmlFor="practice-radiobutton">Practice</label>
            </div>
            <div className="radio-row">
                <input id="recorded-radiobutton" type="radio" name="training_type" value="recorded" onChange={handleChange} />
                <label htmlFor="recorded-radiobutton">Recorded</label>
            </div>
        </div>
    );
};

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
