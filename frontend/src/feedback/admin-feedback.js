;(function ($) {
  const BitSocialAdminDialogApp = {
    bindEvents() {
      this.cache.$deactivateLink.on('click', event => {
        event.preventDefault()

        this.showModal()
      })

      this.cache.$dialogForm.on('submit', event => {
        event.preventDefault()

        this.sendFeedback()
      })

      this.cache.$dialogSkip.on('click', event => {
        event.preventDefault()

        this.deactivate()
      })

      $('#bit-social-close-svg').on('click', () => {
        if (this.cache.$dialogOpen) this.hideModal()
      })

      $(document).mouseup(e => {
        const container = this.cache.$dialogDialog
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          this.hideModal()
        }
      })

      $(document).keyup(event => {
        if (event.keyCode === 27 && this.cache.$dialogOpen) {
          this.hideModal()
          this.cache.$dialogOpen = false
          this.cache.$deactivateLink.focus()
        }
      })
    },

    cacheElements() {
      this.cache = {
        $deactivateLink: $('#the-list').find('[data-slug="bit-social"] span.deactivate a'),
        $dialogDialog: $('#bit-social-deactivate-feedback-dialog'),
        $dialogForm: $('#bit-social-deactivate-feedback-dialog-form'),
        $dialogHeader: $('#bit-social-deactivate-feedback-dialog-header'),
        $dialogOpen: false,
        $dialogSkip: $('#bit-social-deactivate-feedback-form-skip'),
        $dialogSubmit: $('#bit-social-deactivate-feedback-form-submit'),
        $dialogWrapper: $('#bit-social-deactivate-feedback-dialog-wrapper')
      }
    },

    deactivate() {
      window.location.href = this.cache.$deactivateLink.attr('href')
    },

    hideModal() {
      this.cache.$dialogWrapper.hide()
      this.cache.$dialogOpen = false
    },

    init() {
      this.cacheElements()
      this.bindEvents()
    },

    sendFeedback() {
      const formData = this.cache.$dialogForm.serialize()

      this.cache.$dialogSubmit.addClass('bit-social-loading')

      // eslint-disable-next-line no-undef
      $.post(ajaxurl, formData, this.deactivate.bind(this))
    },

    showModal() {
      this.cache.$dialogWrapper.show()
      this.cache.$dialogOpen = true
    }
  }

  $(() => {
    BitSocialAdminDialogApp.init()
  })
  // eslint-disable-next-line no-undef
})(jQuery)
