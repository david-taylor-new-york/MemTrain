import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, CurrentCardsTable, CardForm } from '../Components'

export const CreateCardsPage = () => {
    return (
        <div className="page-container">
            <div id="create-cards-page-id" style={{ display: 'none' }}> </div>
            <div className="section-container">
                <PageHeader/>
                <CreateCardsPageBody/>
            </div>
        </div>
    )
}

const CreateCardsPageBody = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    return (
        <div>
            <CardForm formRef={myAppContext.createCardFormRef} onSubmit={myAppUpdateContext.handleCreateCard} defaultValue={null}/>
            <CurrentCardsTable/>
        </div>
    )
}
