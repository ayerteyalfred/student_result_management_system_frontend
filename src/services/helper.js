export default {
  showSuccess(message, toast) {
    toast.add({ severity: 'success', summary: 'Success Message', detail: message, life: 3000 })
  },

  showInfo(message, toast) {
    toast.add({ severity: 'info', summary: 'Info Message', detail: message, life: 3000 })
  },

  showWarn(message, toast) {
    toast.add({ severity: 'warn', summary: 'Warn Message', detail: message, life: 3000 })
  },

  showError(message, toast) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: message, life: 3000 })
  },

  showSecondary(message, toast) {
    toast.add({ severity: 'secondary', summary: 'Secondary Message', detail: message, life: 3000 })
  },

  showContrast(message, toast) {
    toast.add({ severity: 'contrast', summary: 'Contrast Message', detail: message, life: 3000 })
  }
}
