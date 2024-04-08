import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, CurrentCardsTable, CardForm } from '../Components'
import '../commonStyles.css'

export const CreateCardsPage = () => {

    return (
        <div className="page-container">
            <div className="page-section-container">
                < PageHeader pageTitle="Create Card" />
                < CreateCardsPageBody />
            </div>
        </div>
    )
}

const CreateCardsPageBody = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    return (
        <div >
            < CardForm formRef={myAppContext.createCardFormRef} onSubmit={myAppUpdateContext.handleCreateCard} defaultValue={null} />
            < CurrentCardsTable />
        </div>
    )
}
