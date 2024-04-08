import React from 'react'
import { CurrentCardsTable, PageHeader, SubmitButton } from '../Components'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import '../commonStyles.css'


export const CardMenuPage = () => {

    return (
        <div className="page-container">
            <div className="page-section-container">
                < PageHeader pageTitle="Card Menu" />
                < CardMenuPageBody />
            </div>
        </div>
    )
}

const CardMenuPageBody = () => {
    return (
        <div className="page-section-container">
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
            <SubmitButton onClick={() => myAppUpdateContext.updateCurrentPageTo("CreateCardsPage")}> Create </SubmitButton>
            <SubmitButton showButton={cardsExist} onClick={() => myAppUpdateContext.handleLoadEditCardPage()}> Edit </SubmitButton>
            <SubmitButton showButton={cardsExist} onClick={() => myAppUpdateContext.updateCurrentPageTo("DeleteCardsPage")}> Delete </SubmitButton>
            <SubmitButton onClick={() => myAppUpdateContext.updateCurrentPageTo("MainMenuPage")}> Cancel </SubmitButton>
        </div>
    )
}