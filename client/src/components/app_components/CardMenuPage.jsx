import React from 'react'
import { CurrentCardsTable, PageHeader } from '../Components'
import { useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import '../commonStyles.css'

export const CardMenuPage = () => {
    const myAppUpdateContext = useMyAppUpdateContext()

    const PageBody = () => {
        return (
            <div className="container">
                <div className="button-group">
                    <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("CreateCardsPage")}>Create</button>
                    <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("EditCardsPage")}>Edit</button>
                    <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("DeleteCardsPage")}>Delete</button>
                </div>
                <CurrentCardsTable />
            </div>
        );
    }

    return (
        <div>
            <PageHeader pageTitle="Card Menu" previousPage="MainMenuPage"/>
            <PageBody />
        </div>
    );
}
