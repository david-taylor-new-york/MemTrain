import React from 'react'
import { useMyTrainingContext, useMyTrainingUpdateContext } from '../../contexts/TrainingContextProvider'
import { useMyAppContext } from '../../contexts/AppContextProvider'
import { PageHeader } from '../Components'
import { ToastContainer } from 'react-toastify'
import './trainingStyles.css'

export const TrainingSetupPage = () => {

  const myAppContext = useMyAppContext()
  const myTrainingContext = useMyTrainingContext()
  const myTrainingUpdateContext = useMyTrainingUpdateContext()

  const PracticeOrRecordedRadioButtons = () => {

    return (
      <div>
        <form ref={myTrainingContext.trainingSettingsFormRef}>
          <label> <input type="radio" name="trainingType" value="practice" defaultChecked /> Practice </label>
          <label> <input type="radio" name="trainingType" value="recorded" /> Recorded </label>
          <br />
          <br />
          <button className="button" type="button" order="4" defaultValue="Train" progress="10" onClick={() => { myTrainingUpdateContext.startTraining() }} > Train </button>
        </form>
      </div>
    )
  }

  const TrainingSetupPageBody = () => {
    return (
      <div className="container">
        <h3> Total Questions: {myAppContext.allCardsBySubject.length} </h3>
        < PracticeOrRecordedRadioButtons />
        < ToastContainer />
      </div>
    )
  }

  return (
    <div>
      < PageHeader pageTitle="Training Setup Page" />
      < TrainingSetupPageBody />
    </div>
  )
}
