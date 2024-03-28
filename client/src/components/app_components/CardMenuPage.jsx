import React from 'react'
import { CurrentCardsTable, PageHeader } from '../Components'
import { useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import '../commonStyles.css'

const CardMenuPageBody = () => {
    const myAppUpdateContext = useMyAppUpdateContext()

    return ( // CardMenuPageBody
        <div className="container">
            <div className="button-group">
                <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("CreateCardsPage")}>Create</button>
                <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("EditCardsPage")}>Edit</button>
                <button className="button" onClick={() => myAppUpdateContext.updateCurrentPageTo("DeleteCardsPage")}>Delete</button>
            </div>
            < CurrentCardsTable />
        </div>
    );
}

export const CardMenuPage = () => {
    return (
        <div>
            < PageHeader pageTitle="Card Menu" />
            < CardMenuPageBody />
        </div>
    );
}
