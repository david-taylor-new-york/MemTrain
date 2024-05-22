import axios from 'axios'
import { API_BASE_URL } from '../constants/constants'

async function performHttp(operationType, endpoint, data) {
    const url = `${API_BASE_URL}/${endpoint}`

    console.log("performHttp...")
    console.log("url: " + url)
    console.log("   (" + operationType + ":" + endpoint + ")")
    console.log("   data: ")
    console.log(data)
    console.log(" ")
    try {
        const response = await axios[operationType](url, operationType === 'get' ? { params: data } : (operationType === 'delete' ? { data: data } : data))
        console.log("   response: ")
        console.log(response.data)
        console.log(" ")
        return response.data
    } catch (error) {
        console.log("   error: ")
        console.log(error)
        console.log(" ")
        throw new Error(`Could not perform ${operationType} operation on ${endpoint}! Error: ${error.message}`)
    }
}

function createResource(tableName, data) {
    return performHttp('post', 'insert', { tableName, data })
}

function getResourcesBy(table_name, param_name, param_value) {
    return performHttp('get', 'get', { table_name, param_name, [param_name]: param_value })
}

//function getResourcesByTodayOrLater(table_name, param_name, param_value) {
//    return performHttp('get', 'get_today_or_earlier', { table_name, param_name, [param_name]: param_value })
//}

function updateResource(tableName, updatedData) {
    return performHttp('put', 'update', { tableName, data: updatedData })
}

export const createUser = user => createResource('users', user)

export const getUser = userName => getResourcesBy('users', 'user_name', userName)

export const createSubject = subject => createResource('subjects', subject)

export const getSubjectsBy = (param_name, param_value) => getResourcesBy('subjects', param_name, param_value)

export const createCard = card => createResource('cards', card)

export const getCards = currentSubjectId => getResourcesBy('cards', 'subject_id', currentSubjectId)

export const updateCard = updatedCard => updateResource('cards', updatedCard)

export const deleteCard = cardId => performHttp('delete', 'delete', { tableName: 'cards', id: cardId })

export const createCardResults = cardResults => createResource('card_results', cardResults)

export const getCardResultsBy = (param_name, param_value) => getResourcesBy('card_results', param_name, param_value)

export const createTrainingSession = trainingSession => createResource('training_sessions', trainingSession)

export const updateTrainingSession = updatedTrainingSession => updateResource('training_sessions', updatedTrainingSession)

//export const getTrainingSession = trainingSessionId => getResourcesBy('training_sessions', 'id', trainingSessionId)

export const getTrainingSessions = currentSubjectId => getResourcesBy('training_sessions', 'subject_id', currentSubjectId)
