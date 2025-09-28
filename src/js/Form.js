const selectors = {
    root: '[data-js-form]',
    formName: '[data-js-form-name]',
    formSelect: '[data-js-form-select]',
    formEmail: '[data-js-form-email]',
    formPhone: '[data-js-form-phone]',
    formDateForm: '[data-js-form-date-from]',
    formDateTo: '[data-js-form-date-to]',
    isAdultRadioButton: '[data-js-form-is-adult]',
    notAdultRadioButton: '[data-js-form-not-adult]',
    formCheckbox: '[data-js-form-checkbox]',
    findTourButton: '[data-js-form-button-find-tour]'
}

const stateClasses = {
    notSelected: 'not-selected',
    invalid: 'invalid'
}

const rootElement = document.querySelector(selectors.root)
const formNameElement = document.querySelector(selectors.formName)
const formSelectElement = rootElement.querySelector(selectors.formSelect)
const formEmailElement = rootElement.querySelector(selectors.formEmail)
const formPhoneElement = rootElement.querySelector(selectors.formPhone)
const formDateFromElement = rootElement.querySelector(selectors.formDateForm)
const formDateToElement = rootElement.querySelector(selectors.formDateTo)
const isAdultRadioElement = document.querySelector(selectors.isAdultRadioButton)
const notAdultRadioElement = document.querySelector(selectors.notAdultRadioButton)
const formCheckboxElement = document.querySelector(selectors.formCheckbox)
const findTourElement = document.querySelector(selectors.findTourButton)

const today = new Date().setHours(0, 0, 0, 0)

let isNameCorrect = false
let isDestinationSelected = false
let isEmailCorrect = false
let isPhoneNumberCorrect = false
let isDataCorrect = false
let isUserAdult = false
let doesUserAgree = false

const isValidName = (name) => {
    return name.trim().length > 0
}

const isValidDestination = (select) => {
    return select.value !== ''
}

const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

const isValidPhone = (phone) => {
    const maskRe = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/
    return maskRe.test(phone)
}

const formatPhone = () => {
    let numbers = formPhoneElement.value.replace(/\D/g, '').substring(0, 11)
    const cleanNumbers = numbers.startsWith('7') || numbers.startsWith('8') ? numbers.substring(1) : numbers
    formPhoneElement.value = '+7'
        + (cleanNumbers.length > 0 ? ' (' + cleanNumbers.substring(0, 3) : '')
        + (cleanNumbers.length > 3 ? ') ' + cleanNumbers.substring(3, 6) : '')
        + (cleanNumbers.length > 6 ? '-' + cleanNumbers.substring(6, 8) : '')
        + (cleanNumbers.length > 8 ? '-' + cleanNumbers.substring(8, 10) : '')
    formPhoneElement.setSelectionRange(formPhoneElement.value.length, formPhoneElement.value.length)
}

const isValidDate = (dateStr) => {
    const re = /^(\d{2})\.(\d{2})\.(\d{4})$/
    const match = dateStr.match(re)
    if (!match) return false

    const day = parseInt(match[1], 10)
    const month = parseInt(match[2], 10) - 1
    const year = parseInt(match[3], 10)
    const date = new Date(year, month, day)
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return false

    return date.setHours(0, 0, 0, 0) >= today;

}

const areDatesCorrect = (from, to) => {
    if (!isValidDate(from) || !isValidDate(to)) return false

    const [df, mf, yf] = from.split('.').map(Number)
    const [dt, mt, yt] = to.split('.').map(Number)

    const dateFrom = new Date(yf, mf - 1, df)
    const dateTo = new Date(yt, mt - 1, dt)

    if (dateFrom < today || dateTo < today) return false

    return dateFrom <= dateTo
}

const isUser18OrMore = () => {
    if (!isAdultRadioElement.checked && !notAdultRadioElement.checked) {
        return false
    } else if (notAdultRadioElement.checked) {
        return false
    }

    return true
}

const isCheckboxChecked = () => {
    return formCheckboxElement.checked
}

const formatDate = (input) => {
    let val = input.value.replace(/\D/g, '')
    if (val.length > 2) val = val.slice(0, 2) + '.' + val.slice(2)
    if (val.length > 5) val = val.slice(0, 5) + '.' + val.slice(5, 9)
    input.value = val.slice(0, 10)
}

const setupValidation = () => {
    formNameElement.addEventListener('input', () => {
        formNameElement.classList.remove(stateClasses.invalid)
        isNameCorrect = isValidName(formNameElement.value)
    })

    formSelectElement.addEventListener('change', () => {
        formSelectElement.classList.remove(stateClasses.invalid, stateClasses.notSelected)
        isDestinationSelected = isValidDestination(formSelectElement)
    })

    formEmailElement.addEventListener('input', () => {
        formEmailElement.classList.remove(stateClasses.invalid)
        isEmailCorrect = isValidEmail(formEmailElement.value)
    })

    formPhoneElement.addEventListener('input', () => {
        formatPhone()
        formPhoneElement.classList.remove(stateClasses.invalid)
        isPhoneNumberCorrect = isValidPhone(formPhoneElement.value)
    })

    const validateDates = () => {
        formDateFromElement.classList.remove(stateClasses.invalid)
        formDateToElement.classList.remove(stateClasses.invalid)
        isDataCorrect = areDatesCorrect(formDateFromElement.value, formDateToElement.value)
    }

    formDateFromElement.addEventListener('input', () => {
        formatDate(formDateFromElement)
        validateDates()
    })

    formDateToElement.addEventListener('input', () => {
        formatDate(formDateToElement)
        validateDates()
    })

    const validateAdult = () => {
        isUserAdult = isUser18OrMore()
    }

    isAdultRadioElement.addEventListener('change', validateAdult)
    notAdultRadioElement.addEventListener('change', validateAdult)

    formCheckboxElement.addEventListener('change', () => {
        doesUserAgree = isCheckboxChecked()
    })

    findTourElement.addEventListener('click', (e) => {
        e.preventDefault()

        isNameCorrect = isValidName(formNameElement.value)
        isDestinationSelected = isValidDestination(formSelectElement)
        isEmailCorrect = isValidEmail(formEmailElement.value)
        isPhoneNumberCorrect = isValidPhone(formPhoneElement.value)
        isDataCorrect = areDatesCorrect(formDateFromElement.value, formDateToElement.value)
        isUserAdult = isUser18OrMore()
        doesUserAgree = isCheckboxChecked()

        if (!isNameCorrect) {
            alert("Неверно заполнено поле \"Имя\".")
            formNameElement.classList.add(stateClasses.invalid)
        }

        if (!isDestinationSelected) {
            alert("Не выбрано направление.")
            formSelectElement.classList.add(stateClasses.invalid, stateClasses.notSelected)
        }

        if (!isEmailCorrect) {
            alert("Допущена ошибка а адресе электронной почты.")
            formEmailElement.classList.add(stateClasses.invalid)
        }

        if (!isPhoneNumberCorrect) {
            alert("Неверный формат номера телефона.")
            formPhoneElement.classList.add(stateClasses.invalid)
        }

        if (!isDataCorrect) {
            alert("Проверьте правильность введённых дат.")
            formDateFromElement.classList.add(stateClasses.invalid)
            formDateToElement.classList.add(stateClasses.invalid)
        }

        if (!isUserAdult) alert("Для использования данного сервиса вам должно быть 18 лет или больше.")

        if (!doesUserAgree) alert("Вы не приняли условия Лицензионного договора. Пожалуйста, отметьте соответствующее поле.")

        if (
            isNameCorrect &&
            isDestinationSelected &&
            isEmailCorrect &&
            isPhoneNumberCorrect &&
            isDataCorrect &&
            isUserAdult &&
            doesUserAgree
        ) {
            alert("Спасибо за вашу заявку!")
            rootElement.submit()
        }
    })
}

export default setupValidation
