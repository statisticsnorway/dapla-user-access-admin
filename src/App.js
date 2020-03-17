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
  const { authApi, catalogApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [catalogReady, setCatalogReady] = useState(false)

  const [{
    loading: authLoading,
    error: authError,
    response: authResponse
  }] = useAxios(`${authApi}${API.GET_HEALTH}`)
  const [{
    loading: catalogLoading,
    error: catalogError,
    response: catalogResponse
  }] = useAxios(`${catalogApi}${API.GET_HEALTH}`)

  useEffect(() => {
    //console.log(authError)
    if (!authLoading && !authError) {
      setAuthReady(true)
      //console.log(authResponse)
    } else {
      setAuthReady(false)
    }
  }, [authError, authLoading, authResponse])

  useEffect(() => {
    //console.log(catalogError)
    if (!catalogLoading && !catalogError) {
      setCatalogReady(true)
      //console.log(catalogResponse)
    } else {
      setCatalogReady(false)
    }
  }, [catalogError, catalogLoading, catalogResponse])

  return (
    <>
      <AppMenu setSettingsOpen={setSettingsOpen} />
      <SSBDivider light />
      <Segment basic style={{ paddingTop: '2em' }}>
        {authLoading || catalogLoading ?
          <Loader active inline='centered' /> : authError || catalogError ?
            <ErrorMessage error={UI.API_ERROR_MESSAGE[language]} /> : authReady && catalogReady &&
            <Switch>
              <Route path={ROUTING.BASE}>
                <AppHome />
              </Route>
            </Switch>
        }
      </Segment>
      <AppSettings
        authError={authError}
        catalogError={catalogError}
        loading={authLoading || catalogLoading}
        open={settingsOpen}
        setSettingsOpen={setSettingsOpen}
      />
    </>
  )
}

export default App
