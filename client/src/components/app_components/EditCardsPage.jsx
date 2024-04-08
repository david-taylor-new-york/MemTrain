import React from 'react'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { PageHeader, CurrentCardsTable, ChooseIdWidget, CardForm } from '../Components'
import '../commonStyles.css'

export const EditCardsPage = () => {
    return (
        <div className="page-container">
            <div className="page-section-container">
                < PageHeader pageTitle="Edit Card" />
                < EditCardsPageBody />
            </div>
        </div>
    )
}

const EditCardsPageBody = () => {
    return (
        <div >
            < EditPageWidget />
            < CurrentCardsTable />
        </div>
    )
}

const EditPageWidget = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()
    const cardToEdit = myAppContext.allCardsBySubject[myAppContext.cardToEditIndex]

    if (myAppContext.cardToEditIndex === null) {
        return (
            < ChooseIdWidget formRef={myAppContext.editCardFormRef} buttonLabel={'Edit Card'} submitCall={myAppUpdateContext.handleSetCardToEditId} />
        )
    } else {
        return (
            < CardForm formRef={myAppContext.editCardWidgetFormRef} onSubmit={myAppUpdateContext.handleEditCard} defaultValue={cardToEdit} />
        )
    }
}
