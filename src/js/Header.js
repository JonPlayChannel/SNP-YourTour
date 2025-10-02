const selectors = {
    root: '[data-js-header]',
    logoSvg: '[data-js-header-logo-svg]',
}

const stateClasses = {
    isActive: 'is-active',
    isHiding: 'is-hiding'
}

const rootElement = document.querySelector(selectors.root)
const logoSvgElement = rootElement.querySelector(selectors.logoSvg)

let lastScrollY = window.scrollY

const handleScroll = () => {
    const currentScrollY = window.scrollY

    if (currentScrollY > 450) {
        logoSvgElement.classList.add(stateClasses.isActive)
        rootElement.classList.add(stateClasses.isActive)
        rootElement.classList.remove(stateClasses.isHiding)
    } else {
        if (currentScrollY < lastScrollY) {
            if (rootElement.classList.contains(stateClasses.isActive)) {
                rootElement.classList.add(stateClasses.isHiding)

                setTimeout(() => {
                    rootElement.classList.remove(stateClasses.isHiding)
                }, 1000)
            }
        } else {
            rootElement.classList.remove(stateClasses.isHiding)
        }

        logoSvgElement.classList.remove(stateClasses.isActive)
        rootElement.classList.remove(stateClasses.isActive)
    }

    lastScrollY = currentScrollY
}

function setHeaderScroll() {
    window.addEventListener('scroll', handleScroll)
    handleScroll()
}

export default setHeaderScroll
