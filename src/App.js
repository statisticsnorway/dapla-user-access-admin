import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Route, Switch } from 'react-router-dom'
import { Loader, Segment } from 'semantic-ui-react'
import { Divider as SSBDivider } from '@statisticsnorway/ssb-component-library'

import { AppHome, AppMenu, AppSettings, ErrorMessage } from './components'
import { ApiContext, LanguageContext } from './utilities'
import { API, ROUTING } from './configurations'
import { UI } from './enums'

function App () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [authReady, setAuthReady] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [{
    loading: authLoading,
    error: authError,
    response: authResponse
  }] = useAxios(`${authApi}${API.GET_HEALTH}`)

  useEffect(() => {
    if (!authLoading && !authError) {
      setAuthReady(true)
    } else {
      setAuthReady(false)
    }
  }, [authError, authLoading, authResponse])

  return (
    <>
      <AppMenu setSettingsOpen={setSettingsOpen} />
      <SSBDivider dark />
      <Segment basic style={{ paddingTop: '2em' }}>
        {authLoading ?
          <Loader active inline='centered' /> : authError ?
            <ErrorMessage error={UI.API_ERROR_MESSAGE[language]} /> : authReady &&
            <Switch>
              <Route path={ROUTING.BASE}>
                <AppHome />
              </Route>
            </Switch>
        }
      </Segment>
      <AppSettings
        open={settingsOpen}
        loading={authLoading}
        authError={authError}
        setSettingsOpen={setSettingsOpen}
      />
    </>
  )
}

export default App
