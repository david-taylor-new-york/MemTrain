import React from 'react'
import { PageHeader } from '../Components'
import { ToastContainer } from 'react-toastify'
import './trainingStyles.css'

export const TrainingSummaryPage = () => {

    const PageBody = () => {
        return (
            <div className="container">
                <br />
                < ToastContainer />
            </div>
        );
    }

    return (
        <div>
            < PageHeader pageTitle="Training Summary Page" />
            < PageBody />
        </div>
    )
}
