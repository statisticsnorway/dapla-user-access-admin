import React, { useContext, useState } from 'react'
import { Button, Container, Divider, Form, Grid, Header, Icon, Modal, Segment } from 'semantic-ui-react'
import {
  ErrorMessage,
  InfoPopup,
  InfoText,
  SimpleFooter,
  SSB_COLORS,
  SSB_STYLE
} from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../context/AppContext'
import { SETTINGS, TEST_IDS } from '../enums'

function AppSettings ({ authError, authLoading, catalogError, catalogLoading, open, setSettingsOpen }) {
  const { language } = useContext(LanguageContext)
  const { authApi, catalogApi, setAuthApi, setCatalogApi } = useContext(ApiContext)

  const [authUrl, setAuthUrl] = useState(authApi)
  const [catalogUrl, setCatalogUrl] = useState(catalogApi)
  const [settingsEdited, setSettingsEdited] = useState(false)

  const applySettings = () => {
    setAuthApi(authUrl)
    setCatalogApi(catalogUrl)
    setSettingsEdited(false)
  }

  const changeSettings = (value, api) => {
    if (api === 'auth') {
      setAuthUrl(value)
    }

    if (api === 'catalog') {
      setCatalogUrl(value)
    }

    setSettingsEdited(true)
  }

  const setDefaults = () => {
    setSettingsEdited(true)
    setAuthUrl(window.__ENV.REACT_APP_API_AUTH)
    setCatalogUrl(window.__ENV.REACT_APP_API_CATALOG)
  }

  return (
    <Modal open={open} onClose={() => setSettingsOpen(false)} style={SSB_STYLE}>
      <Header size='large' style={SSB_STYLE}>
        <Icon name='cog' style={{ color: SSB_COLORS.GREEN }} />
        {SETTINGS.HEADER[language]}
      </Header>
      <Modal.Content as={Segment} basic style={SSB_STYLE}>
        <Form size='large'>
          <Form.Input
            value={authUrl}
            loading={authLoading}
            label={SETTINGS.AUTH_API[language]}
            error={!!authError && !settingsEdited}
            placeholder={SETTINGS.AUTH_API[language]}
            onKeyPress={({ key }) => key === 'Enter' && applySettings()}
            onChange={(event, { value }) => changeSettings(value, 'auth')}
            icon={!authLoading && !settingsEdited && !authError ?
              <Icon name='check' style={{ color: SSB_COLORS.GREEN }} /> : null
            }
          />
        </Form>
        {!authLoading && !settingsEdited && authError && <ErrorMessage error={authError} language={language} />}
        <Divider hidden />
        <Form size='large'>
          <Form.Input
            value={catalogUrl}
            loading={catalogLoading}
            label={SETTINGS.CATALOG_API[language]}
            error={!!catalogError && !settingsEdited}
            placeholder={SETTINGS.CATALOG_API[language]}
            onKeyPress={({ key }) => key === 'Enter' && applySettings()}
            onChange={(event, { value }) => changeSettings(value, 'catalog')}
            icon={!catalogLoading && !settingsEdited && !catalogError ?
              <Icon name='check' style={{ color: SSB_COLORS.GREEN }} /> : null
            }
          />
        </Form>
        {!catalogLoading && !settingsEdited && catalogError &&
        <ErrorMessage error={catalogError} language={language} />
        }
        {!authLoading && !catalogLoading && settingsEdited &&
        <Container style={{ marginTop: '1rem' }}>
          <InfoText text={SETTINGS.EDITED_VALUES[language]} />
        </Container>
        }
        <Container style={{ marginTop: '1rem' }}>
          <Divider hidden />
          <Grid columns='equal'>
            <Grid.Column>
              <Button primary size='large' disabled={authLoading || catalogLoading} onClick={() => applySettings()}>
                <Icon name='sync' style={{ paddingRight: '0.5rem' }} />
                {SETTINGS.APPLY[language]}
              </Button>
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <InfoPopup
                position='left center'
                text={SETTINGS.RESET_VALUES[language]}
                trigger={
                  <Icon
                    link
                    fitted
                    name='undo'
                    size='large'
                    onClick={() => setDefaults()}
                    style={{ color: SSB_COLORS.BLUE }}
                    data-testid={TEST_IDS.DEFAULT_SETTINGS_BUTTON}
                  />
                }
              />
            </Grid.Column>
          </Grid>
        </Container>
      </Modal.Content>
      <SimpleFooter
        language={language}
        showScrollToTop={false}
        appVersion={process.env.REACT_APP_VERSION}
        sourceUrl={process.env.REACT_APP_SOURCE_URL}
      />
    </Modal>
  )
}

export default AppSettings
