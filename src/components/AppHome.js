import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Accordion, Divider, Grid, Icon, Input } from 'semantic-ui-react'
import { Text, Title } from '@statisticsnorway/ssb-component-library'

import { ErrorMessage, GroupLookup, RoleLookup, UpdateUser, UserAccess } from './'
import { ApiContext, DescriptionPopup, LanguageContext } from '../utilities'
import { AUTH_API, SSB_COLORS } from '../configurations'
import { HOME, TEST_IDS, UI } from '../enums'

function AppHome () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [userId, setUserId] = useState('')
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
          <Title size={2}>{UI.USER[language]}</Title>
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
              style={{ color: SSB_COLORS.BLUE, marginBottom: '0.25em', marginLeft: '0.5em' }}
              onClick={() => {
                refetch()
                setUserEdited(false)
              }}
            />,
            false,
            'right center'
          )}
          <Divider fitted hidden style={{ marginTop: '1em' }} />
          {!loading && !userEdited && error && <ErrorMessage error={error} />}
          {!error && !loading && !userEdited && data !== undefined &&
          <UpdateUser isNew={false} refetch={refetch} user={data} />
          }
        </Grid.Column>
        <Grid.Column textAlign='right' verticalAlign='middle'>
          <UpdateUser isNew={true} />
        </Grid.Column>
      </Grid.Row>
      {!error && !loading && !userEdited && data !== undefined &&
      <>
        <Grid.Row>
          <Grid.Column>
            <Title size={3}>{HOME.GROUPS[language]}</Title>
            <Accordion
              fluid
              styled
              defaultActiveIndex={-1}
              panels={data.hasOwnProperty(AUTH_API.GROUPS) ? data[AUTH_API.GROUPS].map(groupId => ({
                key: groupId,
                title: { content: (<Text>{groupId}</Text>) },
                content: { content: (<GroupLookup groupId={groupId} />) }
              })) : []}
            />
          </Grid.Column>
          <Grid.Column>
            <Title size={3}>{HOME.ROLES[language]} a</Title>
            <Accordion
              fluid
              styled
              defaultActiveIndex={-1}
              panels={data.hasOwnProperty(AUTH_API.ROLES) ? data[AUTH_API.ROLES].map(roleId => ({
                key: roleId,
                title: { content: (<Text>{roleId}</Text>) },
                content: { content: (<RoleLookup roleId={roleId} />) }
              })) : []}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <UserAccess userId={userId} />
          </Grid.Column>
        </Grid.Row>
      </>
      }
    </Grid>
  )
}

export default AppHome
