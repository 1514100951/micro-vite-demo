declare global {
    interface Window {
      microApp: any
      mount: CallableFunction
      unmount: CallableFunction
      __MICRO_APP_ENVIRONMENT__: string
      __MICRO_APP_BASE_ROUTE__: string
    }
  }