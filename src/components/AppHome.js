import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Link } from 'react-router-dom'
import { Accordion, Checkbox, Divider, Grid, Header, Icon, Input } from 'semantic-ui-react'
import { ErrorMessage, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { GroupLookup, RoleLookup, UpdateUser, UserAccess } from './'
import { ApiContext, DescriptionPopup, LanguageContext } from '../utilities'
import { AUTH_API, LOCAL_STORAGE, ROUTING } from '../configurations'
import { HOME, TEST_IDS, UI } from '../enums'

function AppHome () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [userId, setUserId] = useState(
    localStorage.hasOwnProperty(LOCAL_STORAGE.USER_ID) &&
    localStorage.hasOwnProperty(LOCAL_STORAGE.REMEMBER) &&
    localStorage.getItem(LOCAL_STORAGE.REMEMBER) === 'true' ?
      localStorage.getItem(LOCAL_STORAGE.USER_ID) : ''
  )
  const [rememberUser, setRememberUser] = useState(
    localStorage.hasOwnProperty(LOCAL_STORAGE.REMEMBER) ? localStorage.getItem(LOCAL_STORAGE.REMEMBER) : 'false'
  )
  const [userEdited, setUserEdited] = useState(false)

  const [{ data, loading, error }, refetch] =
    useAxios(`${authApi}${AUTH_API.GET_USER(userId)}`, { manual: true })

  useEffect(() => {
    if (userId !== '') {
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid columns='equal'>
      <Grid.Row>
        <Grid.Column>
          <Header size='large' content={UI.USER[language]} />
          <Input
            size='big'
            value={userId}
            error={!!error && !userEdited}
            disabled={loading}
            placeholder={UI.USER[language]}
            onKeyPress={({ key }) => {
              if (key === 'Enter') {
                refetch()
                setUserEdited(false)
                if (rememberUser === 'true') {
                  localStorage.setItem(LOCAL_STORAGE.USER_ID, userId)
                }
              }
            }}
            onChange={(event, { value }) => {
              setUserId(value)
              setUserEdited(true)
            }}
          />
          {DescriptionPopup(
            <Icon
              link
              size='big'
              loading={loading}
              name='sync alternate'
              disabled={userId === ''}
              data-testid={TEST_IDS.REFRESH_USER}
              style={{ color: SSB_COLORS.BLUE, marginBottom: '0.25em', marginLeft: '0.5em', marginRight: '0.5em' }}
              onClick={() => {
                refetch()
                setUserEdited(false)
                if (rememberUser === 'true') {
                  localStorage.setItem(LOCAL_STORAGE.USER_ID, userId)
                }
              }}
            />,
            false,
            'right center'
          )}
          <Checkbox
            label={UI.REMEMBER_ME[language]}
            checked={rememberUser === 'true'}
            onChange={() => {
              localStorage.setItem(LOCAL_STORAGE.REMEMBER, rememberUser === 'true' ? 'false' : 'true')
              setRememberUser(rememberUser === 'true' ? 'false' : 'true')
            }}
          />
          <Divider fitted hidden style={{ marginTop: '1em' }} />
          {!loading && !userEdited && error && <ErrorMessage error={error} language={language} />}
          {!error && !loading && !userEdited && data !== undefined &&
          <UpdateUser isNew={false} refetch={refetch} user={data} />
          }
        </Grid.Column>
        <Grid.Column textAlign='right' verticalAlign='middle'>
          <UpdateUser isNew={true} />
          {DescriptionPopup(
            <Link to={ROUTING.USERS}>
              <Icon.Group size='huge' style={{ color: SSB_COLORS.BLUE, marginLeft: '1em' }}>
                <Icon link name='user' />
                <Icon corner='top right' link name='table' />
              </Icon.Group>
            </Link>,
            false,
            'top right'
          )}
        </Grid.Column>
      </Grid.Row>
      {!error && !loading && !userEdited && data !== undefined &&
      <>
        <Grid.Row>
          <Grid.Column>
            <Header size='medium' content={HOME.GROUPS[language]} />
            <Accordion
              fluid
              styled
              defaultActiveIndex={-1}
              panels={data.hasOwnProperty(AUTH_API.GROUPS) ? data[AUTH_API.GROUPS].map(groupId => ({
                key: groupId,
                title: { content: (<b>{groupId}</b>) },
                content: { content: (<GroupLookup groupId={groupId} />) }
              })) : []}
            />
          </Grid.Column>
          <Grid.Column>
            <Header size='medium' content={HOME.ROLES[language]} />
            <Accordion
              fluid
              styled
              defaultActiveIndex={-1}
              panels={data.hasOwnProperty(AUTH_API.ROLES) ? data[AUTH_API.ROLES].map(roleId => ({
                key: roleId,
                title: { content: (<b>{roleId}</b>) },
                content: { content: (<RoleLookup roleId={roleId} />) }
              })) : []}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <UserAccess userId={userId} />
          </Grid.Column>
          <Grid.Column />
        </Grid.Row>
      </>
      }
    </Grid>
  )
}

export default AppHome
