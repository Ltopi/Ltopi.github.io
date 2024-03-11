const navbar = document.createElement('template')
navbar.innerHTML = `
<style>
  header {
    display: flex;
    min-height: 48px;
    max-height: 100px;
    justify-content: space-between;
    width: 100%;
    z-index: 99;
  }
  header div {
    align-items: center;
    background-color: var(--navbar-bg-color);
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
    width: 100%;
    z-index: 99;
  }
  header nav {
    background-color: var(--navbar-menu-color);
    border-bottom: 1px solid rgba(51, 51, 51, 0.1);
    box-shadow: var(--navbar-shadow);
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    position: absolute;
    width: 100%;
  }
  ::slotted(a) {
    color: var(--navbar-link-color);
    padding: 0.5rem 0 0.5rem 1rem;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
  }
  ::slotted(a:hover) {
    color: var(--navbar-link-hover-color) !important;
  }
  .logo::slotted(a) {
      color: #333333;
      font-family: 'Dosis', Arial, Helvetica, sans-serif;
      font-size: 2em;
      max-height: 100px;
      padding: 0;
      text-decoration: none;
  }
  .animate {
    transition: all 1s ease-in-out !important;
  }
  ::slotted(.nav-link--active) {
    color: var(--navbar-link-active-color) !important;
  }
</style>
<header>
  <div>
    <slot name="brand" class="logo"></slot>
  </div>
  <nav>
    <slot></slot>
  </nav>
</header>
`

class Navbar extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(navbar.content.cloneNode(true))
  }

  connectedCallback() {

    const props = {
      active: this.getAttribute('active'),
      breakpoint: this.getAttribute('breakpoint')
    }

    const btn = new NavbarBtn(props.breakpoint)
    this.shadowRoot.querySelector('header div').append(btn)

    const data = {
      header: this.shadowRoot.querySelector('header'),
      button: this.shadowRoot.querySelector('header navbar-btn'),
      nav: this.shadowRoot.querySelector('header nav'),
      links: document.querySelectorAll('navigation-bar a'),
    }

    const dist = data.nav.offsetHeight - 32

    this.checkIfMobile(data.nav, props.breakpoint, dist)

    this.createStyle(data.header.offsetHeight)
    this.breakpointStyles(props.breakpoint, props.position)

    this.setActiveLink(data.links, props.active)
    data.button.addEventListener('click', () => {
      data.nav.classList.toggle('show')
    })
    window.addEventListener('resize', () => { this.checkIfMobile(data.nav, props.breakpoint, dist) })
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.checkIfMobile)
  }

  setActiveLink(elements, attr) {
    elements.forEach((link) => {
      if (link.innerHTML.toLowerCase() === attr.toLowerCase()) {
        link.classList.add('nav-link--active')
      }
    })
  }

  createStyle(distance) {
    const styles = `.show { transform: translateY(${distance}px) !important; }`;
    this.shadowRoot.querySelector('style').append(styles)
  }

  breakpointStyles(breakpoint) {
    const styles = `
    @media screen and (min-width: ${breakpoint}px) {
      header {
        box-shadow: var(--navbar-shadow);
        overflow: hidden;
      }
      header div {
        border-bottom: none !important;
      }
      header nav {
        align-items: center;
        flex-direction: row;
        justify-content: flex-end;
        padding: 0 1rem 0 0;
        position: relative !important;
        transform: translateY(0) !important;
        z-index: unset;
      }
      header nav a {
        padding: 0 1rem;
      }
    }
    `
    this.shadowRoot.querySelector('style').append(styles)
  }

  calTransDistance(nav) {
    return nav.offsetHeight
  }

  checkIfMobile(nav, breakpoint, distance) {
    if (window.innerWidth < breakpoint) {
      nav.style.transform = `translateY(-${distance}px)`
      setTimeout(() => {
        nav.classList.add('animate')
      }, 1)
    } else {
      nav.classList.remove('show')
      nav.classList.remove('animate')
    }
  }
}

const navbarBtn = document.createElement('template')
navbarBtn.innerHTML = `
<style>
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: inline-block;
    padding-right: 0;
    outline: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
  }
  div {
    background-color: #333333;
    border-radius: 4px;
    height: 5px;
    margin: 6px 0;
    transition: 0.4s;
    width: 35px;
  }
  .change div:nth-child(1) {
    -webkit-transform: rotate(-45deg) translate(-8px, 6px);
    transform: rotate(-45deg) translate(-8px, 6px);
  }
  .change div:nth-child(2) {
    opacity: 0;
    }
  .change div:nth-child(3) {
    -webkit-transform: rotate(45deg) translate(-9px, -8px);
    transform: rotate(45deg) translate(-9px, -8px);
  }
  .nav--show {
    transform: translateY(152px) !important;
  }
  @media screen and (min-width: 36rem) {
    button {
      display: none;
    }
  }
</style>
<button aria-label="Menu Button">
  <div></div>
  <div></div>
  <div></div>
</button>
`

class NavbarBtn extends HTMLElement {
  constructor(breakpoint) {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(navbarBtn.content.cloneNode(true))
    this.breakpoint = breakpoint
  }

  connectedCallback() {
    const btn = this.shadowRoot.querySelector('button')

    btn.addEventListener('click', () => {
      btn.classList.toggle('change')
    })

    window.addEventListener('resize', () => { this.reset(btn, this.breakpoint) })
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.reset)
  }

  reset(element, breakpoint) {
    if (window.innerWidth > breakpoint && element.classList.contains('change')) {
      element.classList.remove('change')
    }
  }
}

window.customElements.define('navbar-btn', NavbarBtn)
window.customElements.define('navigation-bar', Navbar)
