import { useContext, useRef, useState } from 'react'
import { Link, Route, Switch, useLocation } from 'react-router-dom'
import { Divider, Icon, Ref, Segment, Step } from 'semantic-ui-react'

import { AppGroups, AppMenu, AppRoles, AppSettings, AppUsers, UpdateGroup, UpdateRole, UpdateUser } from './components'
import { LanguageContext } from './context/AppContext'
import { APP, LIST, UPDATE } from './configurations'

function App () {
  const appRefArea = useRef()

  const { language } = useContext(LanguageContext)

  let location = useLocation()

  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <AppMenu setSettingsOpen={setSettingsOpen} context={appRefArea} />
      <Ref innerRef={appRefArea}>
        <Segment basic style={{ paddingBottom: '5rem', marginTop: 0 }}>
          <Step.Group size="large" widths={APP.length}>
            {APP.map(step =>
              <Step key={step.id} active={location.pathname.startsWith(step.route)} as={Link}
                    to={`${step.route}${LIST}`}>
                <Icon name={step.icon} />
                <Step.Content>
                  <Step.Title>{step.title[language]}</Step.Title>
                  <Step.Description>{step.description[language]}</Step.Description>
                </Step.Content>
              </Step>
            )}
          </Step.Group>
          <Divider hidden />
          <Switch>
            <Route path={`${APP[0].route}${LIST}`}>
              <AppUsers />
            </Route>
            <Route path={`${APP[0].route}${UPDATE}`}>
              <UpdateUser />
            </Route>
            <Route path={`${APP[1].route}${LIST}`}>
              <AppGroups />
            </Route>
            <Route path={`${APP[1].route}${UPDATE}`}>
              <UpdateGroup />
            </Route>
            <Route path={`${APP[2].route}${LIST}`}>
              <AppRoles />
            </Route>
            <Route path={`${APP[2].route}${UPDATE}`}>
              <UpdateRole />
            </Route>
          </Switch>
        </Segment>
      </Ref>
      <AppSettings open={settingsOpen} setOpen={setSettingsOpen} />
    </>
  )
}

export default App
