import React from 'react'
import { PageHeader } from '../Components'
import '../commonStyles.css'

export const TrainingSummaryPage = () => {

    const TrainingSummaryPageBody = () => {
        return (
            <div className="page-container">
                <br />
            </div>
        )
    }

    return (
        <div>
            < PageHeader pageTitle="Training Summary Page" />
            < TrainingSummaryPageBody />
        </div>
    )
}
