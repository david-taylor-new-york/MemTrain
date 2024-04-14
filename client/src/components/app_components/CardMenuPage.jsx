import React from 'react'
import { CurrentCardsTable, PageHeader, SubmitButton } from '../Components'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import '../commonStyles.css'


export const CardMenuPage = () => {

    return (
        <div className="page-container">
            <div id="card-menu-page-id" style={{ display: 'none' }}> </div>
            <div className="section-container">
                < PageHeader />
                < CardMenuPageBody />
            </div>
        </div>
    )
}

const CardMenuPageBody = () => {
    return (
        <div className="section-container">
            < MenuButtons />
            < CurrentCardsTable />
        </div>
    )
}

const MenuButtons = () => {
    const myAppUpdateContext = useMyAppUpdateContext()
    const myAppContext = useMyAppContext()
    const cardsExist = myAppContext.allCardsBySubject.length > 0

    return (
        <div className="main-menu-button-group">
            <SubmitButton id="create-cards-button" onClick={() => myAppUpdateContext.updateCurrentPageTo("Create Cards")}> Create </SubmitButton>
            <SubmitButton id="edit-cards-button" showButton={cardsExist} onClick={() => myAppUpdateContext.handleLoadEditCardPage()}> Edit </SubmitButton>
            <SubmitButton id="delete-cards-button" showButton={cardsExist} onClick={() => myAppUpdateContext.updateCurrentPageTo("Delete Cards")}> Delete </SubmitButton>
            <SubmitButton id="cancel-button" onClick={() => myAppUpdateContext.updateCurrentPageTo("Main Menu")}> Cancel </SubmitButton>
        </div>
    )
}