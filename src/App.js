import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Route, Switch } from 'react-router-dom'
import { Divider, Loader, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import { AppHome, AppMenu, AppSettings, CatalogsTable, GroupsTable, RolesTable, UsersTable } from './components'
import { ApiContext, LanguageContext } from './utilities'
import { API, ROUTING } from './configurations'
import { UI } from './enums'

function App () {
  const { authApi, catalogApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [authReady, setAuthReady] = useState(false)
  const [catalogReady, setCatalogReady] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [{ loading: authLoading, error: authError }] = useAxios(`${authApi}${API.GET_HEALTH}`, { useCache: false })
  const [{ loading: catalogLoading, error: catalogError }] = useAxios(`${catalogApi}${API.GET_HEALTH}`, { useCache: false })

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
      <Divider />
      <Segment basic>
        {authLoading || catalogLoading ?
          <Loader active inline='centered' /> : authError || catalogError ?
            <ErrorMessage error={UI.API_ERROR_MESSAGE[language]} language={language} /> : authReady && catalogReady &&
            <Switch>
              <Route path={ROUTING.USERS}>
                <UsersTable />
              </Route>
              <Route path={ROUTING.GROUPS}>
                <GroupsTable />
              </Route>
              <Route path={ROUTING.ROLES}>
                <RolesTable />
              </Route>
              <Route path={ROUTING.CATALOGS}>
                <CatalogsTable />
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
