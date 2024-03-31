import React from 'react'
import { CurrentCardsTable, PageHeader, SubmitButton } from '../Components'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import '../commonStyles.css'


export const CardMenuPage = () => {

    return (
        <div>
            < PageHeader pageTitle="Card Menu" />
            < CardMenuPageBody />
        </div>
    )
}

const CardMenuPageBody = () => {
    const myAppUpdateContext = useMyAppUpdateContext()
    const myAppContext = useMyAppContext()
    const cardsExist = myAppContext.allCardsBySubject.length > 0

    return (
        <div className="container">
            <div className="card-menu-button-group">
                <SubmitButton onClick={() => myAppUpdateContext.updateCurrentPageTo("CreateCardsPage")}> Create </SubmitButton>
                <SubmitButton showButton={cardsExist} onClick={() => myAppUpdateContext.updateCurrentPageTo("EditCardsPage")}> Edit </SubmitButton>
                <SubmitButton showButton={cardsExist} onClick={() => myAppUpdateContext.updateCurrentPageTo("DeleteCardsPage")}> Delete </SubmitButton>
            </div>
            < CurrentCardsTable />
        </div>
    )
}
