import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Accordion, Divider, Grid, Icon, Popup } from 'semantic-ui-react'
import { Input as SSBInput, Text, Title } from '@statisticsnorway/ssb-component-library'

import { RoleLookup, UpdateUser, UserAccess } from './'
import { ApiContext, getNestedObject, LanguageContext } from '../utilities'
import { API, SSB_COLORS } from '../configurations'
import { HOME, TEST_IDS, UI } from '../enums'

function AppHome () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [userId, setUserId] = useState('')
  const [userEdited, setUserEdited] = useState(false)

  const [{ data, loading, error }, refetch] = useAxios(`${authApi}${API.GET_USER(userId)}`, { manual: true })

  useEffect(() => {
    if (userId !== '') {
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid columns='equal' divided>
      <Grid.Column>
        <Title size={3}>{UI.USER[language]}</Title>
        <SSBInput
          value={userId}
          error={!!error}
          placeholder={UI.USER[language]}
          handleChange={(value) => {
            setUserId(value)
            setUserEdited(true)
          }}
          errorMessage={
            error && getNestedObject(error, API.ERROR_PATH) === undefined ?
              error.toString() : getNestedObject(error, API.ERROR_PATH)
          }
        />
        <Popup
          basic
          flowing
          trigger={
            <Icon
              link
              size='big'
              loading={loading}
              name='sync alternate'
              disabled={userId === ''}
              data-testid={TEST_IDS.REFRESH_USER}
              style={{ color: SSB_COLORS.BLUE, marginTop: '0.5em', marginBottom: '0.5em' }}
              onClick={() => {
                refetch()
                setUserEdited(false)
              }}
            />
          }
        >
          <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
          Description
        </Popup>
        {!error && !loading && !userEdited && data !== undefined &&
        <>
          <UpdateUser isNew={false} refetch={refetch} roles={data[API.ROLES]} userId={userId} />
          <Title size={3}>{HOME.ROLES[language]}</Title>
          <Accordion
            fluid
            styled
            defaultActiveIndex={-1}
            panels={data[API.ROLES].map(roleId => ({
              key: roleId,
              title: { content: (<Text>{roleId}</Text>) },
              content: { content: (<RoleLookup roleId={roleId} />) }
            }))}
          />
        </>
        }
        <Divider />
        <UpdateUser isNew={true} roles={[]} userId={''} />
      </Grid.Column>
      <Grid.Column>
        {!error && !loading && !userEdited && data !== undefined && <UserAccess userId={userId} />}
      </Grid.Column>
    </Grid>
  )
}

export default AppHome
