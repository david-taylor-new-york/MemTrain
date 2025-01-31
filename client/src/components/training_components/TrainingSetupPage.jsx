import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, SubmitButton } from '../Components'

export const TrainingSetupPage = () => {
    return (
        <div className="page-container">
            <div id="training-setup-page-id" style={{ display: 'none' }}> </div>
            <PageHeader/>
            <TrainingSetupPageBody/>
        </div>
    )
}

const TrainingSetupPageBody = () => {
    const myAppContext = useMyAppContext()
    const myTrainingContext = useMyTrainingContext()

    return (
        <div className="section-container">
            <h3> Total Cards: {myAppContext.allCardsBySubject.length} </h3>
            <h3> Active Cards: {myTrainingContext.currentTrainingRecords.length} (reviewed at least once)</h3>
            <h3> Cards Due For Review: {myTrainingContext.dueCards.length} </h3>
            <NumberOfQuestionsToReviewInput/>
            <PracticeOrRecordedRadioButtons/>
            <ButtonGroup/>
        </div>
    )
}

const NumberOfQuestionsToReviewInput = () => {
    const myTrainingContext = useMyTrainingContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            const form = myTrainingContext.trainingSettingsFormRef.current
            const input = form.elements['numberOfCardsToReview']

            if (input.checkValidity()) {
                myTrainingUpdateContext.startTraining()
            } else {
                input.reportValidity()
            }
        }
    }

    return (
        <div>
            <form ref={myTrainingContext.trainingSettingsFormRef}>
                <label>
                    Number of Cards to review:{" "}
                    <input name="numberOfCardsToReview" id="id-input-field" type="text" autoComplete="off" autoFocus required minLength="1" onKeyPress={handleKeyPress} />
                </label>
            </form>
        </div>
    )
}

const PracticeOrRecordedRadioButtons = () => {
    return (
        <div>
            <h3> Training Type: </h3>
            <RadioButtons />
        </div>
    )
}

const RadioButtons = () => {
    const myTrainingUpdateContext = useMyTrainingUpdateContext()
    const handleChange = (event) => { myTrainingUpdateContext.setTrainingType(event.target.value) }

    return (
        <div className="radio-container">
            <div className="radio-row">
                <input id="practice-radiobutton" type="radio" name="training_type" value="practice" onChange={handleChange} defaultChecked/>
                <label htmlFor="practice-radiobutton">Practice</label>
            </div>
            <div className="radio-row">
                <input id="recorded-radiobutton" type="radio" name="training_type" value="recorded" onChange={handleChange}/>
                <label htmlFor="recorded-radiobutton">Recorded</label>
            </div>
        </div>
    )
}

const ButtonGroup = () => {
    const myAppUpdateContext = useMyAppUpdateContext()
    const myTrainingUpdateContext = useMyTrainingUpdateContext()

    return (
        <div className="main-menu-button-group">
            <SubmitButton id="setup-train-button" onClick={() => myTrainingUpdateContext.startTraining()}> Train </SubmitButton>
            <SubmitButton id="cancel-button" onClick={() => myAppUpdateContext.updateCurrentPageTo("Training Menu")}> Cancel </SubmitButton>
        </div>
    )
}
