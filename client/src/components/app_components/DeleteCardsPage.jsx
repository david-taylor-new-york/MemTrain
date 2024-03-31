import React from 'react'
import { PageHeader, CurrentCardsTable, ChooseIdWidget } from '../Components'
import { ToastContainer } from 'react-toastify'
import '../commonStyles.css'

export const DeleteCardsPage = () => {

    return (
        <div>
            < PageHeader pageTitle="Delete Card" />
            < DeleteCardsPageBody />
        </div>
    )
}

const DeleteCardsPageBody = () => {

    return (
        <div className="container">
            < ChooseIdWidget formType="delete" />
            < CurrentCardsTable />
            < ToastContainer />
        </div>
    )
}
