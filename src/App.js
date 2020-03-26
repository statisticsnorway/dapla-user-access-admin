import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Route, Switch } from 'react-router-dom'
import { Loader, Segment } from 'semantic-ui-react'
import { Divider as SSBDivider } from '@statisticsnorway/ssb-component-library'

import { AppHome, AppMenu, AppSettings, ErrorMessage, RolesTable } from './components'
import { ApiContext, LanguageContext } from './utilities'
import { API, ROUTING } from './configurations'
import { UI } from './enums'

function App () {
  const { authApi, catalogApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [authReady, setAuthReady] = useState(false)
  const [catalogReady, setCatalogReady] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [{
    loading: authLoading,
    error: authError
  }] = useAxios(`${authApi}${API.GET_HEALTH}`)
  const [{
    loading: catalogLoading,
    error: catalogError
  }] = useAxios(`${catalogApi}${API.GET_HEALTH}`)

  useEffect(() => {
    if (!authLoading && !authError) {
      setAuthReady(true)
    } else {
      setAuthReady(false)
    }
  }, [authError, authLoading])

  useEffect(() => {
    if (!catalogLoading && !catalogError) {
      setCatalogReady(true)
    } else {
      setCatalogReady(false)
    }
  }, [catalogError, catalogLoading])

  return (
    <>
      <AppMenu setSettingsOpen={setSettingsOpen} />
      <SSBDivider dark />
      <Segment basic style={{ paddingTop: '2em' }}>
        {authLoading || catalogLoading ?
          <Loader active inline='centered' /> : authError || catalogError ?
            <ErrorMessage error={UI.API_ERROR_MESSAGE[language]} /> : authReady && catalogReady &&
            <Switch>
              <Route path={ROUTING.ROLES}>
                <RolesTable />
              </Route>
              <Route path={ROUTING.BASE}>
                <AppHome />
              </Route>
            </Switch>
        }
      </Segment>
      <AppSettings
        open={settingsOpen}
        authError={authError}
        catalogError={catalogError}
        setSettingsOpen={setSettingsOpen}
        loading={authLoading || catalogLoading}
      />
    </>
  )
}

export default App
