const selectors = {
    root: '[data-js-header]',
    logoSvg: '[data-js-header-logo-svg]',
}

const stateClasses = {
    isActive: 'is-active',
}

const rootElement = document.querySelector(selectors.root)
const logoSvgElement = rootElement.querySelector(selectors.logoSvg)

const handleScroll = () => {
    if (window.scrollY > 450) {
        logoSvgElement.classList.add(stateClasses.isActive)
        rootElement.classList.add(stateClasses.isActive)
    } else {
        logoSvgElement.classList.remove(stateClasses.isActive)
        rootElement.classList.remove(stateClasses.isActive)
    }
}

function setHeaderScroll() {
    window.addEventListener('scroll', handleScroll)
    handleScroll()
}

export default setHeaderScroll
