import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, CurrentCardsTable, ChooseIdWidget } from '../Components'
import '../commonStyles.css'

export const DeleteCardsPage = () => {

    return (
        <div className="page-container">
            <div className="page-section-container">
                < PageHeader pageTitle="Delete Card" />
                < DeleteCardsPageBody />
            </div>
        </div>
    )
}

const DeleteCardsPageBody = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    return (
        <div>
            < ChooseIdWidget formRef={myAppContext.deleteCardFormRef} buttonLabel={'Delete Card'} submitCall={myAppUpdateContext.handleDeleteCard} />
            < CurrentCardsTable />
        </div>
    )
}
