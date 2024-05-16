import { toast } from 'react-toastify'

export const wrongAnswerToast = (msg) => {
  toast.info(msg, { autoClose: 4000 })
}
export const showToast = (msg) => {
  toast.info(msg, { autoClose: 1000 })
}

// IMPLEMENT?:

//const fibonacciRecursive = (n) => {
//    if (n <= 0) {
//        return 0
//    } else if (n === 1) {
//        return 1
//    } else {
//        return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2)
//    }
//}
//
//const calculateBuoyancy = (existingBuoyancy, cardResult) => {
//    let newBuoyancy = existingBuoyancy
//    if (cardResult.is_correct) {
//        const buoyancyFloat = Math.max(0, 2.0 * Math.exp(-0.3 * cardResult.seconds_to_answer) - 0.05)
//        newBuoyancy = Math.round((buoyancyFloat) * 100) / 100
//    } else {
//        if (existingBuoyancy > 0) {
//            newBuoyancy = existingBuoyancy / 2
//        }
//    }
//    return newBuoyancy
//}

