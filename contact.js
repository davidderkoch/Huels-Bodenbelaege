// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("currentYear").textContent = new Date().getFullYear()

  // Contact form logic
  const contactForm = document.getElementById("contactForm")
  const formSuccess = document.getElementById("formSuccess")
  const formError = document.getElementById("formError")
  const submitButton = document.getElementById("submitButton")
  const gdprConsent = document.getElementById("gdprConsent")

  // Enable/disable submit button based on GDPR consent
  gdprConsent.addEventListener("change", function () {
    submitButton.disabled = !this.checked
  })

  // Form submission handler
  contactForm.addEventListener("submit", (e) => {
    if (!gdprConsent.checked) {
      e.preventDefault()
      alert("Bitte stimmen Sie der Verarbeitung Ihrer Daten zu.")
      return
    }
    submitButton.textContent = "Wird gesendet..."
    submitButton.disabled = true
  })

  // Modal logic
  window.showImpressum = () => {
    document.getElementById("impressumModal").style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  window.showDatenschutz = () => {
    document.getElementById("datenschutzModal").style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  window.hideModal = (modalId) => {
    document.getElementById(modalId).style.display = "none"
    document.body.style.overflow = ""
  }

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    const impressumModal = document.getElementById("impressumModal")
    const datenschutzModal = document.getElementById("datenschutzModal")

    if (e.target === impressumModal) {
      hideModal("impressumModal")
    }
    if (e.target === datenschutzModal) {
      hideModal("datenschutzModal")
    }
  })

  // Close modal with Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideModal("impressumModal")
      hideModal("datenschutzModal")
    }
  })

  // Handle success/error messages based on URL hash
  if (window.location.hash === "#contact-success") {
    formSuccess.style.display = "flex"
    contactForm.reset()
    submitButton.disabled = true
    setTimeout(() => {
      formSuccess.style.display = "none"
      window.location.hash = ""
    }, 5000)
  } else if (window.location.hash === "#contact-error") {
    formError.style.display = "flex"
    submitButton.disabled = false
    setTimeout(() => {
      formError.style.display = "none"
      window.location.hash = ""
    }, 5000)
  }
})
