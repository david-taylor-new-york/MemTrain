import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, CurrentCardsTable, ChooseIdWidget } from '../Components'

export const DeleteCardsPage = () => {
    return (
        <div className="page-container">
            <div id="delete-cards-page-id" style={{ display: 'none' }}> </div>
            <div className="section-container">
                <PageHeader/>
                <DeleteCardsPageBody/>
            </div>
        </div>
    )
}

const DeleteCardsPageBody = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    return (
        <div>
            <ChooseIdWidget formRef={myAppContext.deleteCardFormRef} buttonLabel={'Delete Card'} submitCall={myAppUpdateContext.handleDeleteCard} idLabel={'CARD:'}/>
            <CurrentCardsTable/>
        </div>
    )
}
