import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Route, Switch } from 'react-router-dom'
import { Loader, Segment } from 'semantic-ui-react'
import { Divider as SSBDivider } from '@statisticsnorway/ssb-component-library'

import { AppHome, AppMenu, AppSettings, ErrorMessage } from './components'
import { BackendContext } from './utilities'
import { BACKEND_API, ROUTING } from './configurations'

function App () {
  const { backendUrl } = useContext(BackendContext)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [ready, setReady] = useState(false)

  const [{ loading, error, response }] = useAxios(`${backendUrl}${BACKEND_API.GET_HEALTH}`)

  useEffect(() => {
    if (!loading && !error) {
      setReady(true)
      console.log(response)
    } else {
      setReady(false)
    }
  }, [error, loading, response])

  return (
    <>
      <AppMenu setSettingsOpen={setSettingsOpen} />
      <SSBDivider light />
      <Segment basic style={{ paddingTop: '2em' }}>
        {loading ?
          <Loader active inline='centered' /> : error ?
            <ErrorMessage error={error} /> : ready &&
            <Switch>
              <Route path={ROUTING.BASE}>
                <AppHome />
              </Route>
            </Switch>
        }
      </Segment>
      <AppSettings error={error} loading={loading} open={settingsOpen} setSettingsOpen={setSettingsOpen} />
    </>
  )
}

export default App
