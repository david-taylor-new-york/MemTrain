import { React, useState, useEffect } from 'react'
import { PageHeader, SubmitButton } from '../Components'
import { useMyAppContext, useMyAppUpdateContext } from '../../contexts/AppContextProvider'
import { getSubjectsBy } from '../../utils/httpClient'

export const SubjectPage = () => {
    return (
        <div className="page-container">
            <div id="subject-page-id" style={{ display: 'none' }}> </div>
            <div className="section-container">
                <PageHeader/>
                <SubjectPageBody/>
            </div>
        </div>
    )
}

const SubjectPageBody = () => {
    const myAppContext = useMyAppContext()
    const myAppUpdateContext = useMyAppUpdateContext()
    const showSubmitButton = (myAppContext.currentSubjectName !== "unselected")

    return (
        <div>
            <div className="section-container">
                <SubjectsDropdown/>
                <SubmitButton id="select-subject-button" showButton={showSubmitButton} onClick={() => myAppUpdateContext.updateCurrentPageTo("Main Menu")}> Select </SubmitButton>
                <br/>
                <CreateSubjectForm/>
            </div>
        </div>
    )
}

const SubjectsDropdown = () => {
    const myAppUpdateContext = useMyAppUpdateContext() // Use the app context hook directly
    const myAppContext = useMyAppContext()
    const [subjects, setSubjects] = useState([])
    const defaultValue = myAppContext.currentSubjectName === "unselected" ? 'Select a subject' : myAppContext.currentSubjectName

    useEffect(() => {
        const subjects = []

        async function fetchData() {

            try {
                const response = await getSubjectsBy("user_id", myAppContext.userId)
                response.forEach((value) => {
                    subjects.push({
                        key: value.id,
                        value: value.subject_name,
                    })
                })

                setSubjects([
                    { key: new Date().getTime(), value: 'Select a subject' },
                    ...subjects
                ])

            } catch (error) {
                console.error('Error fetching subjects:', error)
            }
        }
        fetchData()
    }, [myAppContext.userId])

    return (
        <div>
            <label>
                <select
                    id="subjects-dropdown"
                    value={defaultValue}
                    onChange={myAppUpdateContext.handleSubjectChange}
                    className="select">
                    {subjects.map((subject) => (
                        <option key={subject.key}> {subject.value} </option>
                    ))}
                </select>
            </label>
        </div>
    )
}

const CreateSubjectForm = () => {
    const myAppUpdateContext = useMyAppUpdateContext()
    const myAppContext = useMyAppContext()

    return (
        <div>
            <form ref={myAppContext.newSubjectNameFormRef} onSubmit={myAppUpdateContext.handleCreateSubject}>
                <label>
                    or create new:{" "}
                    <input id="new-subject-name" name="new_subject_name" className="half-width" type="text" autoComplete="off" autoFocus required minLength="1"/>
                </label>
                <button id="new-subject-button" className="button" type="submit"> Add </button>
            </form>
        </div>
    )
}
