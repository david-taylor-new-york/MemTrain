import React from 'react'
import { CurrentCardsTable, BackButton, LogOutButton } from '../Components'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import './styles/CardMenuPage.css'

export const CardMenuPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    return (
        <div className="container">
            <div className="button-group-top">
                <BackButton previousPage="MainMenuPage" />
                <LogOutButton />
            </div>
            <h5 className="sub-header">Subject: {myAppContext.subjectName}</h5>
            <h3 className="header">Card Menu</h3>
            <hr />
            <div className="button-group">
                <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("CreateCardsPage")}>Create</button>
                <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("EditCardsPage")}>Edit</button>
                <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("DeleteCardsPage")}>Delete</button>
            </div>
            <div>
                <CurrentCardsTable />
            </div>
        </div>
    )
}
