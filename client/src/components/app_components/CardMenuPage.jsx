import React from 'react'
import { CurrentCardsTable, BackButton, LogOutButton } from '../Components'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import '../commonStyles.css'

export const CardMenuPage = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()

    return (
        <div className="container">
            <div className="button-group-top">
                <BackButton previousPage="MainMenuPage" />
                <LogOutButton />
            </div>
            <h4 className="subject-sub-header"> Subject: {myAppContext.subjectName}</h4>
            <h3 className="page-title">Card Menu</h3>
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
