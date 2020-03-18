import React, { useContext, useState } from 'react'
import { Container, Divider, Grid, Header, Icon, List, Modal, Popup, Segment } from 'semantic-ui-react'
import { Button as SSBButton, Divider as SSBDivider, Input as SSBInput } from '@statisticsnorway/ssb-component-library'

import { ApiContext, getNestedObject, LanguageContext } from '../utilities'
import { API, SSB_COLORS, SSB_STYLE } from '../configurations'
import { SETTINGS } from '../enums'

function AppSettings ({ authError, catalogError, loading, open, setSettingsOpen }) {
  const { language } = useContext(LanguageContext)
  const { authApi, catalogApi, setAuthApi, setCatalogApi } = useContext(ApiContext)

  const [settingsEdited, setSettingsEdited] = useState(false)
  const [authUrl, setAuthUrl] = useState(authApi)
  const [catalogUrl, setCatalogUrl] = useState(catalogApi)

  return (
    <Modal open={open} onClose={() => setSettingsOpen(false)} style={SSB_STYLE}>
      <Header as='h2' style={SSB_STYLE}>
        <Icon name='cog' style={{ color: SSB_COLORS.GREEN }} />
        {SETTINGS.HEADER[language]}
      </Header>
      <Modal.Content as={Segment} basic loading={loading} style={SSB_STYLE}>
        <SSBInput
          label={SETTINGS.AUTH_API[language]}
          placeholder={SETTINGS.AUTH_API[language]}
          disabled={loading}
          error={authError && !settingsEdited}
          value={authUrl}
          handleChange={(value) => {
            setAuthUrl(value)
            setSettingsEdited(true)
          }}
          errorMessage={
            authError && !settingsEdited && getNestedObject(authError, API.ERROR_PATH) === undefined ?
              authError.toString() : getNestedObject(authError, API.ERROR_PATH)
          }
        />
        <Divider hidden />
        <SSBInput
          label={SETTINGS.CATALOG_API[language]}
          placeholder={SETTINGS.CATALOG_API[language]}
          disabled={loading}
          error={catalogError && !settingsEdited}
          value={catalogUrl}
          handleChange={(value) => {
            setCatalogUrl(value)
            setSettingsEdited(true)
          }}
          errorMessage={
            catalogError && !settingsEdited && getNestedObject(catalogError, API.ERROR_PATH) === undefined ?
              catalogError.toString() : getNestedObject(catalogError, API.ERROR_PATH)
          }
        />
        <Container style={{ marginTop: '1em' }}>
          {settingsEdited &&
          <>
            <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
            {SETTINGS.EDITED_VALUES[language]}
          </>
          }
          <Divider hidden />
          <Grid columns='equal'>
            <Grid.Column>
              <SSBButton
                primary
                disabled={loading}
                onClick={() => {
                  setAuthApi(authUrl)
                  setCatalogApi(catalogUrl)
                  setSettingsEdited(false)
                }}
              >
                <Icon name='sync' style={{ paddingRight: '0.5em' }} />
                {SETTINGS.APPLY[language]}
              </SSBButton>
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <Popup basic flowing position='left center' trigger={
                <Icon
                  fitted
                  link
                  size='large'
                  name='undo'
                  style={{ color: SSB_COLORS.BLUE }}
                  // There is a bug in https://github.com/statisticsnorway/ssb-component-library preventing values from updating when updated from another source then itself
                  onClick={() => {
                    setAuthUrl(process.env.REACT_APP_API_AUTH)
                    setCatalogUrl(process.env.REACT_APP_API_CATALOG)
                    setAuthApi(process.env.REACT_APP_API_AUTH)
                    setCatalogApi(process.env.REACT_APP_API_CATALOG)
                    setSettingsEdited(false)
                  }}
                  data-testid='setDefaultSettings'
                />
              }>
                <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                {SETTINGS.RESET_SETTINGS[language]}
              </Popup>
            </Grid.Column>
          </Grid>
        </Container>
      </Modal.Content>
      <Container fluid textAlign='center'>
        <SSBDivider light />
        <List horizontal divided link size='medium' style={{ marginTop: '3em', marginBottom: '3em' }}>
          <List.Item as='a' href={`${process.env.REACT_APP_SOURCE_URL}`} icon={{ fitted: true, name: 'github' }} />
          <List.Item content={`${SETTINGS.APP_VERSION[language]}: ${process.env.REACT_APP_VERSION}`} />
        </List>
      </Container>
    </Modal>
  )
}

export default AppSettings
