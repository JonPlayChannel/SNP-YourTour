import '/src/style/main.scss'
import setHeaderScroll from "./Header"
import {
    setInheritColorOnChange,
    changeEmailInputStyles,
    formatPhoneNumber,
    setupDateValidationListeners,
} from "./Form"

console.clear()
setHeaderScroll()
setInheritColorOnChange()
changeEmailInputStyles()
formatPhoneNumber()
setupDateValidationListeners()