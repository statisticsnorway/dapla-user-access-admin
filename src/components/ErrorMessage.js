import React, { useContext } from 'react'
import { Dialog } from '@statisticsnorway/ssb-component-library'

import { getNestedObject, LanguageContext } from '../utilities'
import { API } from '../configurations'
import { UI } from '../enums'

function ErrorMessage ({ error, title }) {
  const { language } = useContext(LanguageContext)

  const resolveError = getNestedObject(error, API.ERROR_PATH)
  const alternateResolveError = getNestedObject(error, API.ERROR_STATUS_PATH)

  return (
    <Dialog type='warning' title={title ? title : UI.ERROR[language]}>
      {resolveError === undefined ? alternateResolveError === undefined ?
        error.toString() : alternateResolveError : resolveError
      }
    </Dialog>
  )
}

export default ErrorMessage
