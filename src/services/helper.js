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
  },

  requireConfirmation(toast, confirm, signoutAction, router) {
    confirm.require({
      group: 'headless',
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
        signoutAction()
          .then((res) => {
            toast.add({ severity: 'info', summary: 'Confirmed', detail: res.message, life: 3000 })
            router.push({ name: 'login' }).then(() => {
              router.go()
            })
          })
          .catch((error) => {
            console.log(error)
          })
      },
      reject: () => {
        toast.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000
        })
      }
    })
  }
}
