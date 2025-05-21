// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize variables
  let fpInstance = null
  let tradesAnimationId = null
  let tradesLastTime = 0
  let currentTradeIndex = 0
  const tradesAnimationDuration = 2000
  let slideInterval = null
  let isInitialized = false

  // Initialize fullpage.js with optimized settings
  function initFullPage() {
    if (isInitialized) return

    fpInstance = new fullpage("#fullpage", {
      licenseKey: "YOUR_KEY_HERE",
      scrollingSpeed: 1000,
      navigation: true,
      navigationPosition: "right",
      navigationTooltips: ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      showActiveTooltip: true,
      anchors: [
        "home",
        "stats",
        "parkett",
        "vinyl",
        "teppich",
        "kautschuk",
        "laminat",
        "pvc",
        "linoleum",
        "treppensanierung",
        "trades",
        "location",
        "gallery",
        "footer",
      ],
      css3: true,
      easingcss3: "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
      fitToSection: true,
      autoScrolling: true,
      lazyLoading: true,
      afterLoad: handleSectionLoad,
      onLeave: handleSectionLeave,
      afterRender: () => {
        // Load first section background immediately
        loadSectionBackground(document.querySelector(".section.active"))
        isInitialized = true
      },
    })

    // Store the instance globally for debugging
    window.fullpage_api = fpInstance
  }

  // Handle section load event
  function handleSectionLoad(origin, destination, direction) {
    const logo = document.querySelector(".fixed-logo")
    const hamburgerMenu = document.getElementById("hamburgerMenu")
    const menuButtons = document.getElementById("menuButtons")

    // Handle logo and menu visibility
    if (destination.index === 0) {
      logo.classList.remove("small")
      logo.classList.add("large")
      hamburgerMenu.style.display = "block"
    } else {
      logo.classList.remove("large")
      logo.classList.add("small")
      hamburgerMenu.style.display = "none"
      menuButtons.classList.remove("active")
    }

    // Load background image for current section
    loadSectionBackground(destination.item)

    // Handle trades section animation
    if (destination.anchor === "trades") {
      startTradesAnimation()
    } else {
      stopTradesAnimation()
    }

    // Preload next section background
    if (destination.next) {
      loadSectionBackground(destination.next)
    }
    if (destination.prev) {
  loadSectionBackground(destination.prev)}
  }

  // Handle section leave event
  function handleSectionLeave(origin, destination, direction) {
    // Preload background of the *next* and *previous* sections
const prevIndex = destination.index - 1;
const nextIndex = destination.index + 1;

const allSections = document.querySelectorAll(".section");
if (allSections[prevIndex]) {
  loadSectionBackground(allSections[prevIndex]);
}
if (allSections[nextIndex]) {
  loadSectionBackground(allSections[nextIndex]);
}

    // Optimize animations by pausing those not in view
    if (origin.anchor === "trades") {
      stopTradesAnimation()
    }

    if (origin.anchor === "gallery") {
      pauseGallerySlideshow()
    }

    // Start animations for destination section
    if (destination.anchor === "gallery") {
      startGallerySlideshow()
    }
  }

  // Load section background image on demand
  function loadSectionBackground(section) {
    if (!section) return

    const bg = section.getAttribute("data-bg")
    if (bg && !section.style.backgroundImage) {
      // Create a new image to preload
      const img = new Image()
      img.onload = () => {
        section.style.backgroundImage = `url(${bg})`
      }
      img.src = bg
    }
  }

  // Trades Animation Functions
  function startTradesAnimation() {
    const tradeItems = document.querySelectorAll(".trade-item")

    // Reset all elements
    tradeItems.forEach((item) => {
      item.classList.remove("active")
    })

    // Show first item
    tradeItems[currentTradeIndex].classList.add("active")

    // Start animation
    tradesLastTime = performance.now()
    tradesAnimationId = requestAnimationFrame(animateTradeItems)
  }

  function animateTradeItems(timestamp) {
    const tradeItems = document.querySelectorAll(".trade-item")

    if (!tradesLastTime) tradesLastTime = timestamp

    const elapsed = timestamp - tradesLastTime

    if (elapsed >= tradesAnimationDuration) {
      // Time for next item
      tradeItems[currentTradeIndex].classList.remove("active")

      // Move to next item
      currentTradeIndex = (currentTradeIndex + 1) % tradeItems.length

      // Show new item
      tradeItems[currentTradeIndex].classList.add("active")

      // Reset timer
      tradesLastTime = timestamp
    }

    // Continue animation
    tradesAnimationId = requestAnimationFrame(animateTradeItems)
  }

  function stopTradesAnimation() {
    if (tradesAnimationId) {
      cancelAnimationFrame(tradesAnimationId)
      tradesAnimationId = null
    }

    const tradeItems = document.querySelectorAll(".trade-item")
    tradeItems.forEach((item) => {
      item.classList.remove("active")
    })
  }

  // Gallery Functions
  function initGallery() {
    const slides = document.querySelectorAll(".gallery-slide")
    const indicators = document.querySelectorAll(".gallery-indicator")
    let currentSlide = 0

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index)
        indicators[i].classList.toggle("active", i === index)
      })
      currentSlide = index
    }

    function nextSlide() {
      const next = (currentSlide + 1) % slides.length
      showSlide(next)
    }

    function startSlideshow() {
      stopSlideshow() // ensure no duplicate intervals
      slideInterval = setInterval(nextSlide, 4000)
    }

    function stopSlideshow() {
      if (slideInterval) clearInterval(slideInterval)
    }

    // Add click handlers to indicators
    indicators.forEach((indicator, i) => {
      indicator.addEventListener("click", () => {
        showSlide(i)
        startSlideshow()
      })
    })

    // Initialize gallery
    showSlide(0)

    // Expose functions
    window.galleryFunctions = {
      start: startSlideshow,
      stop: stopSlideshow,
    }
  }

  function startGallerySlideshow() {
    if (window.galleryFunctions) {
      window.galleryFunctions.start()
    }
  }

  function pauseGallerySlideshow() {
    if (window.galleryFunctions) {
      window.galleryFunctions.stop()
    }
  }

  // Event Handlers
  function setupEventHandlers() {
    // Set current year in footer
    document.getElementById("currentYear").textContent = new Date().getFullYear()

    // Hamburger menu toggle
    const hamburgerMenu = document.getElementById("hamburgerMenu")
    const menuButtons = document.getElementById("menuButtons")

    hamburgerMenu.addEventListener("click", () => {
      menuButtons.classList.toggle("active")
    })

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (!hamburgerMenu.contains(event.target) && !menuButtons.contains(event.target)) {
        menuButtons.classList.remove("active")
      }
    })

    // Contact button handler
    document.getElementById("contactButton").addEventListener("click", () => {
      if (typeof fullpage_api !== "undefined") {
        fullpage_api.moveTo("location")
      }
    })

    // Services button handler with debounce
    const servicesButton = document.getElementById("servicesButton")
    if (servicesButton) {
      servicesButton.addEventListener("click", (e) => {
        e.preventDefault()
        // Small delay to ensure button works reliably
        setTimeout(() => {
          if (typeof fullpage_api !== "undefined") {
            fullpage_api.moveTo("parkett")
          }
        }, 50)
      })
    }
  }

  // Page Visibility API for better performance
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Page is not visible, pause animations
      if (tradesAnimationId) {
        cancelAnimationFrame(tradesAnimationId)
        tradesAnimationId = null
      }
      pauseGallerySlideshow()
    } else {
      // Page is visible again, resume animations if on relevant section
      const currentSection = fullpage_api.getActiveSection()
      if (currentSection) {
        if (currentSection.anchor === "trades" && !tradesAnimationId) {
          tradesLastTime = 0
          startTradesAnimation()
        }
        if (currentSection.anchor === "gallery") {
          startGallerySlideshow()
        }
      }
    }
  })

  // Initialize everything with a slight delay to ensure DOM is ready
  setTimeout(() => {
    initFullPage()
    initGallery()
    setupEventHandlers()
  }, 100)
})
