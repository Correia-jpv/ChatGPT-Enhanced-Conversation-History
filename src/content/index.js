// Check if we are on chatGPT page
let url = location.href

if (url.includes('chat.openai.com')) {
  let showMoreButtonTimeout
  let timeouts = []
  let historyFullyLoaded = false
  let notFoundCount = 0
  let showMoreButtonEverFound = false

  function addLoadingIndicator() {
    const existingLoadingIndicator = document.getElementById('loading-indicator')
    if (!existingLoadingIndicator) {
      const nav = document.querySelector('nav')
      const loadingIndicator = document.createElement('div')
      loadingIndicator.id = 'loading-indicator'
      loadingIndicator.classList.add(
        'flex',
        'items-center',
        'justify-center',
        'text-gray-500',
        'text-sm',
        'font-medium',
        'h-8',
      )
      loadingIndicator.innerHTML = 'Loading conversation history...'
      nav.insertBefore(loadingIndicator, nav.firstChild)
    }
  }

  function removeLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator')
    if (loadingIndicator) loadingIndicator.style.display = 'none'
  }

  function checkShowMoreButton() {
    const showMoreButton = Array.from(document.getElementsByTagName('button')).find((button) =>
      /Show\s*more/i.test(button.innerText),
    )
    if (showMoreButton) {
      // 500ms delay to avoid spamming the button
      setTimeout(() => showMoreButton.click(), 500)
      notFoundCount = 0
      showMoreButtonEverFound = true
    } else {
      if (showMoreButtonEverFound) notFoundCount++
      // If we can't find the button 5 times in a row, we assume that the history is fully loaded
      if (notFoundCount === 5) {
        historyFullyLoaded = true
        clearAllTimeouts()
        removeLoadingIndicator()
        addSearchBar()
      }
    }
  }

  function clearAllTimeouts() {
    for (let i = 0; i < timeouts.length; i++) clearTimeout(timeouts[i])
  }

  function startClickingShowMoreButton() {
    if (!historyFullyLoaded) {
      checkShowMoreButton()
      addLoadingIndicator()

      showMoreButtonTimeout = setTimeout(startClickingShowMoreButton, 1000)
      timeouts.push(showMoreButtonTimeout)
    }
  }

  startClickingShowMoreButton()

  // Search history bar
  function addSearchBar() {
    const nav = document.querySelector('nav')
    if (nav.querySelector('#search-input')) return

    const searchBar = document.createElement('div')
    searchBar.innerHTML = `
      <div class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm flex-shrink-0 border border-white/20">
        <button id="search-button" class="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>
        <input type="text" id="search-input" placeholder="Search..." class="text-sm focus:ring-0 focus-visible:ring-0" style="background-color: transparent; border: none; padding: 0; flex-grow: 1;">
      </div>  
    `

    // Insert the search bar before the first child of the nav
    nav.prepend(searchBar)

    const searchButton = document.getElementById('search-button')
    const searchInput = document.getElementById('search-input')

    // Clicking the search button triggers the search
    searchButton.addEventListener('click', () => {
      const searchTerm = searchInput.value.toLowerCase()
      const navAnchors = nav.querySelectorAll('div > a')
      navAnchors.forEach((anchor) => {
        if (anchor.textContent.toLowerCase().includes(searchTerm)) anchor.style.display = 'flex'
        else anchor.style.display = 'none'
      })
    })

    // Pressing enter triggers the search
    searchInput.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) searchButton.click()
    })
  }

  const nextDiv = document.getElementById('__next')

  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList)
      if (mutation.type === 'childList' && mutation.target === nextDiv) {
        addSearchBar()
        break
      }
  })

  observer.observe(nextDiv, { childList: true, subtree: true })
}
