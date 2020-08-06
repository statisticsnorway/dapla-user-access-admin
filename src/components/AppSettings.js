import React, { useContext, useState } from 'react'
import { Button, Container, Divider, Form, Grid, Header, Icon, List, Modal, Popup, Segment } from 'semantic-ui-react'
import { ErrorMessage, SSB_COLORS, SSB_STYLE } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../utilities'
import { SETTINGS, TEST_IDS } from '../enums'

function AppSettings ({ authError, catalogError, loading, open, setSettingsOpen }) {
  const { language } = useContext(LanguageContext)
  const { authApi, catalogApi, setAuthApi, setCatalogApi } = useContext(ApiContext)

  const [authUrl, setAuthUrl] = useState(authApi)
  const [catalogUrl, setCatalogUrl] = useState(catalogApi)
  const [settingsEdited, setSettingsEdited] = useState(false)

  return (
    <Modal open={open} onClose={() => setSettingsOpen(false)} style={SSB_STYLE}>
      <Header as='h2' style={SSB_STYLE}>
        <Icon name='cog' style={{ color: SSB_COLORS.GREEN }} />
        {SETTINGS.HEADER[language]}
      </Header>
      <Modal.Content as={Segment} basic loading={loading} style={SSB_STYLE}>
        <Form size='large'>
          <Form.Input
            value={authUrl}
            disabled={loading}
            label={SETTINGS.AUTH_API[language]}
            error={!!authError && !settingsEdited}
            placeholder={SETTINGS.AUTH_API[language]}
            onChange={(event, { value }) => {
              setAuthUrl(value)
              setSettingsEdited(true)
            }}
          />
        </Form>
        {!loading && !settingsEdited && authError && <ErrorMessage error={authError} language={language} />}
        <Divider hidden />
        <Form size='large'>
          <Form.Input
            disabled={loading}
            value={catalogUrl}
            label={SETTINGS.CATALOG_API[language]}
            error={!!catalogError && !settingsEdited}
            placeholder={SETTINGS.CATALOG_API[language]}
            onChange={(event, { value }) => {
              setCatalogUrl(value)
              setSettingsEdited(true)
            }}
          />
        </Form>
        {!loading && !settingsEdited && catalogError && <ErrorMessage error={catalogError} language={language} />}
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
              <Button
                primary
                size='large'
                disabled={loading}
                onClick={() => {
                  setAuthApi(authUrl)
                  setCatalogApi(catalogUrl)
                  setSettingsEdited(false)
                }}
              >
                <Icon name='sync' style={{ paddingRight: '0.5em' }} />
                {SETTINGS.APPLY[language]}
              </Button>
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <Popup basic flowing position='left center' trigger={
                <Icon
                  link
                  fitted
                  name='undo'
                  size='large'
                  style={{ color: SSB_COLORS.BLUE }}
                  data-testid={TEST_IDS.DEFAULT_SETTINGS_BUTTON}
                  onClick={() => {
                    setAuthUrl(process.env.REACT_APP_API_AUTH)
                    setAuthApi(process.env.REACT_APP_API_AUTH)
                    setCatalogUrl(process.env.REACT_APP_API_CATALOG)
                    setCatalogApi(process.env.REACT_APP_API_CATALOG)
                    setSettingsEdited(false)
                  }}
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
        <Divider />
        <List horizontal divided link size='small' style={{ marginTop: '3em', marginBottom: '3em' }}>
          <List.Item as='a' href={`${process.env.REACT_APP_SOURCE_URL}`} icon={{ fitted: true, name: 'github' }} />
          <List.Item content={`${SETTINGS.APP_VERSION[language]}: ${process.env.REACT_APP_VERSION}`} />
        </List>
      </Container>
    </Modal>
  )
}

export default AppSettings
