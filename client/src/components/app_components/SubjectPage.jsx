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
    const [selectedSharedSubject, setSelectedSharedSubject] = useState('Select a subject')
    const showSharedSubmitButton = (selectedSharedSubject !== "Select a subject")

    const handleSharedSubjectChange = (sharedSubject) => {
        setSelectedSharedSubject(sharedSubject)
    }

    return (
        <div>
            <div className="section-container">
                <SubjectsDropdown/>
                <SubmitButton id="select-subject-button" showButton={showSubmitButton} onClick={() => myAppUpdateContext.updateCurrentPageTo("Main Menu")}> Select </SubmitButton>
                <br/>
                <CreateSubjectForm/>
                <br/>
                <CopySharedCardsDropDown selectedSubject={selectedSharedSubject} onSharedSubjectChange={handleSharedSubjectChange} />
                <br/>
                <SubmitButton id="select-shared-subject-button" showButton={showSharedSubmitButton} onClick={() => myAppUpdateContext.handleSharedSubjectCopy(selectedSharedSubject)}> Copy Cards </SubmitButton>
                <br/>
            </div>
        </div>
    )
}

const SubjectsDropdown = () => {
    const myAppUpdateContext = useMyAppUpdateContext()
    const myAppContext = useMyAppContext()
    const [subjects, setSubjects] = useState([])
    const defaultValue = myAppContext.currentSubjectName === "unselected" ? 'Select a subject' : myAppContext.currentSubjectName

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getSubjectsBy("user_id", myAppContext.userId)
                const subjectOptions = response.map(value => ({
                    key: value.id,
                    value: value.subject_name,
                }))
                setSubjects(prevSubjects => [
                    { key: new Date().getTime(), value: 'Select a subject' },
                    ...subjectOptions
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

const CopySharedCardsDropDown = ({ selectedSubject, onSharedSubjectChange }) => {
    const myAppContext = useMyAppContext()
    const [sharedSubjects, setSharedSubjects] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getSubjectsBy("user_id", 1)
                const sharedSubjects = response.map(value => ({
                    key: value.id,
                    value: value.subject_name,
                }))

                setSharedSubjects([
                    { key: new Date().getTime(), value: 'Select a shared subject' },
                    ...sharedSubjects
                ])
            } catch (error) {
                console.error('Error fetching sharedSubjects:', error)
            }
        }
        fetchData()
    }, [myAppContext.userId])

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value
        onSharedSubjectChange(selectedValue)
    }

    return (
        <div>
            <label>
                or:{" "}
                <select
                    id="shared-subjects-dropdown"
                    value={selectedSubject}
                    onChange={handleSelectChange}
                    className="select" >
                    {sharedSubjects.map((subject) => (
                        <option key={subject.key} value={subject.value}>{subject.value}</option>
                    ))}
                </select>
            </label>
        </div>
    )
}
