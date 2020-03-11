import React, { useContext, useState } from 'react'
import { Container, Divider, Header, Icon, List, Modal, Segment } from 'semantic-ui-react'
import { Button as SSBButton, Divider as SSBDivider, Input as SSBInput } from '@statisticsnorway/ssb-component-library'

import { BackendContext, getNestedObject, LanguageContext } from '../utilities'
import { BACKEND_API, SSB_COLORS, SSB_STYLE } from '../configurations'
import { APP_SETTINGS } from '../enums'

function AppSettings ({ error, loading, open, setSettingsOpen }) {
  const { language } = useContext(LanguageContext)
  const { backendUrl, setBackendUrl } = useContext(BackendContext)

  const [settingsEdited, setSettingsEdited] = useState(false)
  const [url, setUrl] = useState(backendUrl)

  return (
    <Modal open={open} onClose={() => setSettingsOpen(false)} style={SSB_STYLE}>
      <Header as='h2' style={SSB_STYLE}>
        <Icon name='cog' style={{ color: SSB_COLORS.GREEN }} />
        {APP_SETTINGS.HEADER[language]}
      </Header>
      <Modal.Content as={Segment} basic loading={loading} style={SSB_STYLE}>
        <SSBInput
          label={APP_SETTINGS.BACKEND_URL[language]}
          placeholder={APP_SETTINGS.BACKEND_URL[language]}
          disabled={loading}
          error={error && !settingsEdited}
          value={url}
          handleChange={(value) => {
            setUrl(value)
            setSettingsEdited(true)
          }}
          errorMessage={
            error && !settingsEdited && getNestedObject(error, BACKEND_API.ERROR_PATH) === undefined ?
              error.toString() : getNestedObject(error, BACKEND_API.ERROR_PATH)
          }
        />
        <Container style={{ marginTop: '1em' }}>
          {settingsEdited &&
          <>
            <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
            {APP_SETTINGS.EDITED_VALUES[language]}
          </>
          }
          <Divider hidden />
          <SSBButton
            primary
            disabled={loading}
            onClick={() => {
              setBackendUrl(url)
              setSettingsEdited(false)
            }}
          >
            <Icon name='sync' style={{ paddingRight: '0.5em' }} />
            {APP_SETTINGS.APPLY[language]}
          </SSBButton>
        </Container>
      </Modal.Content>
      <Container fluid textAlign='center'>
        <SSBDivider light />
        <List horizontal divided link size='small' style={{ marginTop: '3em', marginBottom: '3em' }}>
          <List.Item as='a' href={`${process.env.REACT_APP_SOURCE_URL}`} icon={{ fitted: true, name: 'github' }} />
          <List.Item content={`${APP_SETTINGS.APP_VERSION[language]}: ${process.env.REACT_APP_VERSION}`} />
        </List>
      </Container>
    </Modal>
  )
}

export default AppSettings
