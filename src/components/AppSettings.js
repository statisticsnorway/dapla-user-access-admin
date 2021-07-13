import useAxios from 'axios-hooks'
import { useContext, useEffect, useState } from 'react'
import { Button, Container, Divider, Form, Grid, Header, Icon, Modal, Segment } from 'semantic-ui-react'
import { ErrorMessage, InfoPopup, InfoText, SimpleFooter } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, LanguageContext } from '../context/AppContext'
import { API } from '../configurations'
import { SETTINGS, TEST_IDS } from '../enums'

function AppSettings ({ open, setOpen }) {
  const { language } = useContext(LanguageContext)
  const { authApi, catalogApi, setAuthApi, setCatalogApi, setDevToken } = useContext(ApiContext)

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

    if (!settingsEdited) {
      executeAuthApi()
      executeCatalogApi()
    }
  }

  const changeSettings = (value, api) => {
    if (api === API.AUTH) {
      setAuthApiUrl(value)
    }

    if (api === API.CATALOG) {
      setCatalogApiUrl(value)
    }

    setSettingsEdited(true)
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
            error={!!authError && !settingsEdited}
            placeholder={SETTINGS.AUTH_API[language]}
            onKeyPress={({ key }) => key === 'Enter' && applySettings()}
            onChange={(e, { value }) => changeSettings(value, API.AUTH)}
            icon={!authLoading && !settingsEdited && !authError ?
              <Icon name="check" color="green" /> : null
            }
          />
          <Form.Input
            value={catalogApiUrl}
            loading={catalogLoading}
            label={SETTINGS.CATALOG_API[language]}
            error={!!catalogError && !settingsEdited}
            placeholder={SETTINGS.CATALOG_API[language]}
            onKeyPress={({ key }) => key === 'Enter' && applySettings()}
            onChange={(e, { value }) => changeSettings(value, API.CATALOG)}
            icon={!catalogLoading && !settingsEdited && !catalogError ?
              <Icon name="check" color="green" /> : null
            }
          />
          {['development', 'test'].includes(process.env.NODE_ENV) &&
          <Form.TextArea
            rows={6}
            placeholder="Just paste token and close settings"
            onChange={(e, { value }) => {
              setDevToken(value)
              localStorage.setItem('devToken', value)
            }}
            label="dev-token (./bin/generate-test-jwt.sh -u test@junit)"
          />
          }
        </Form>
        {!authLoading && !settingsEdited && authError &&
        <ErrorMessage error={authError} language={language} />
        }
        {!catalogLoading && !settingsEdited && catalogError &&
        <ErrorMessage error={catalogError} language={language} />
        }
        {!authLoading && !catalogLoading && settingsEdited &&
        <Container style={{ marginTop: '0.5rem' }}>
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
