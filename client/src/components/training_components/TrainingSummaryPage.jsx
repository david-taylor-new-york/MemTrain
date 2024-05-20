import React from 'react'
import { PageHeader } from '../Components'

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
            <div id="training-summary-page-id" style={{ display: 'none' }}> </div>
            < PageHeader />
            < TrainingSummaryPageBody />
        </div>
    )
}
