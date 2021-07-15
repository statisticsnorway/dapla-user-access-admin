import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Button, Container, Divider, Form, Grid, Header, Icon, Modal, Segment } from 'semantic-ui-react'
import { InfoPopup, InfoText, SimpleFooter } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../context/AppContext'
import { API } from '../configurations'
import { SETTINGS, TEST_IDS } from '../enums'
import { resolveErrorObject } from '../utilities'

function AppSettings ({ open, setOpen }) {
  const { language } = useContext(LanguageContext)
  const { authApi, catalogApi, setAuthApi, setCatalogApi } = useContext(ApiContext)

  const [authApiUrl, setAuthApiUrl] = useState(authApi)
  const [catalogApiUrl, setCatalogApiUrl] = useState(catalogApi)
  const [settingsEdited, setSettingsEdited] = useState(false)

  const [{ loading: authLoading, error: authError }, executeAuthApi] =
    useAxios(`${authApi}${API.GET_HEALTH}`, { manual: true, useCache: false })
  const [{ loading: catalogLoading, error: catalogError }, executeCatalogApi] =
    useAxios(`${catalogApi}${API.GET_HEALTH}`, { manual: true, useCache: false })

  const applySettings = () => {
    setAuthApi(authApiUrl)
    setCatalogApi(catalogApiUrl)
    setSettingsEdited(false)
  }

  const setDefaults = () => {
    setSettingsEdited(true)
    setAuthApiUrl(window.__ENV.REACT_APP_API_AUTH)
    setCatalogApiUrl(window.__ENV.REACT_APP_API_CATALOG)
  }

  useEffect(() => {
    if (open && !settingsEdited) {
      executeAuthApi()
      executeCatalogApi()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, settingsEdited])

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Header size="large">
        <Icon name="cog" color="blue" />
        {SETTINGS.HEADER[language]}
      </Header>
      <Modal.Content as={Segment} basic>
        <Form size="large">
          <Form.Input
            value={authApiUrl}
            loading={authLoading}
            label={SETTINGS.AUTH_API[language]}
            placeholder={SETTINGS.AUTH_API[language]}
            onKeyPress={({ key }) => key === 'Enter' && applySettings()}
            icon={!authLoading && !settingsEdited && !authError && <Icon name="check" color="green" />}
            error={!authLoading && !settingsEdited && authError && {
              content: resolveErrorObject(authError), pointing: 'below'
            }}
            onChange={(e, { value }) => {
              setAuthApiUrl(value)
              setSettingsEdited(true)
            }}
          />
          <Form.Input
            value={catalogApiUrl}
            loading={catalogLoading}
            label={SETTINGS.CATALOG_API[language]}
            placeholder={SETTINGS.CATALOG_API[language]}
            onKeyPress={({ key }) => key === 'Enter' && applySettings()}
            icon={!catalogLoading && !settingsEdited && !catalogError && <Icon name="check" color="green" />}
            error={!catalogLoading && !settingsEdited && catalogError && {
              content: resolveErrorObject(catalogError), pointing: 'below'
            }}
            onChange={(e, { value }) => {
              setCatalogApiUrl(value)
              setSettingsEdited(true)
            }}
          />
        </Form>
        {!authLoading && !catalogLoading && settingsEdited &&
        <Container style={{ marginTop: '2rem' }}>
          <InfoText text={SETTINGS.EDITED_VALUES[language]} />
        </Container>
        }
        <Container style={{ marginTop: '1rem' }}>
          <Divider hidden />
          <Grid columns="equal">
            <Grid.Column>
              <Button
                primary
                size="large"
                onClick={() => applySettings()}
                content={SETTINGS.APPLY[language]}
                disabled={authLoading || catalogLoading}
              />
            </Grid.Column>
            <Grid.Column textAlign="right">
              <InfoPopup
                position="left center"
                text={SETTINGS.RESET_VALUES[language]}
                trigger={
                  <Icon
                    link
                    fitted
                    name="undo"
                    size="large"
                    color="blue"
                    onClick={() => setDefaults()}
                    data-testid={TEST_IDS.DEFAULT_SETTINGS_VALUES_BUTTON}
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
