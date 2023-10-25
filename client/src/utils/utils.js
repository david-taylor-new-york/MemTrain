import { toast } from 'react-toastify'

export const calculateNextCardSchedule = (cardSchedule, cardResult) => {
    // const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(new Date().getDate() + 1)

    const newBuoyancy = calculateBuoyancy(cardSchedule.buoyancy, cardResult)

    let daysToAddToNextReview = 1
    let dateOfNextReview = tomorrow
    daysToAddToNextReview = fibonacciRecursive(newBuoyancy)
    dateOfNextReview = addDaysToNextReview(daysToAddToNextReview)

    cardSchedule.buoyancy = newBuoyancy
    cardSchedule.next_review_date = dateOfNextReview
    return cardSchedule
}

const fibonacciRecursive = (n) => {
    if (n <= 0) {
        return 0
    } else if (n === 1) {
        return 1
    } else {
        return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2)
    }
}

const addDaysToNextReview = (daysToAddToNextReview) => {
    const today = new Date()
    let nextReviewDate = new Date()
    nextReviewDate.setDate(today.getDate() + daysToAddToNextReview)
    console.log(nextReviewDate)

    return nextReviewDate
}

const calculateBuoyancy = (existingBuoyancy, cardResult) => {
    let newBuoyancy = existingBuoyancy
    if (cardResult.is_correct) {
        const buoyancyFloat = Math.max(0, 2.0 * Math.exp(-0.3 * cardResult.seconds_to_answer) - 0.05)
        newBuoyancy = Math.round((buoyancyFloat) * 100) / 100
    } else {
        if (existingBuoyancy > 0) {
            newBuoyancy = existingBuoyancy / 2
        }
    }
    return newBuoyancy
}

export const showToast = (msg) => {
    toast.info(msg)
  }