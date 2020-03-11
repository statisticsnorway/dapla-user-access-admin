import React, { useContext } from 'react'
import { Dialog } from '@statisticsnorway/ssb-component-library'

import { getNestedObject, LanguageContext } from '../utilities'
import { BACKEND_API } from '../configurations'
import { UI } from '../enums'

function ErrorMessage ({ error }) {
  const { language } = useContext(LanguageContext)

  const resolveError = getNestedObject(error, BACKEND_API.ERROR_PATH)

  return (
    <Dialog type='warning' title={UI.ERROR[language]}>
      {resolveError === undefined ? error.toString() : resolveError}
    </Dialog>
  )
}

export default ErrorMessage
