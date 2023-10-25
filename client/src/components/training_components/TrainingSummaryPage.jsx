import React from 'react'
import { useMyAppContext } from '../../contexts/AppContextProvider'
import { BackButton, LogOutButton } from '../Components'
import { ToastContainer } from 'react-toastify'

export const TrainingSummaryPage = () => {
    const myAppContext = useMyAppContext()

    return (
        <>
            <div>
                < BackButton previousPage="TrainingSessionsPage" />
                < LogOutButton />
                <h5> Subject: {myAppContext.subjectName} </h5>
                <h3> Training Summary </h3>
                <hr />
                <br />
                < ToastContainer />
            </div>
        </>
    )
}
