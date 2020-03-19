import React, { useContext, useState } from 'react'
import useAxios from 'axios-hooks'
import { Accordion, Divider, Grid, Icon, Popup } from 'semantic-ui-react'
import { Input as SSBInput, Text, Title } from '@statisticsnorway/ssb-component-library'

import { CreateUser, RoleLookup, UpdateUser, UserAccess } from './'
import { ApiContext, getNestedObject, LanguageContext } from '../utilities'
import { API, SSB_COLORS } from '../configurations'
import { HOME, UI } from '../enums'

function AppHome () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [userId, setUserId] = useState('magnus')
  const [userEdited, setUserEdited] = useState(false)

  const [{ data, loading, error }, refetch] = useAxios(`${authApi}${API.GET_USER(userId)}`, { manual: true })

  return (
    <Grid columns='equal'>
      <Grid.Column>
        <Title size={3}>{UI.USER[language]}</Title>
        <SSBInput
          placeholder={UI.USER[language]}
          error={!!error}
          value={userId}
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
              name='sync'
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
          <UpdateUser userId={userId} roles={data[API.ROLES]} refetch={refetch} />
          <Title size={3}>{HOME.ROLES[language]}</Title>
          <Accordion
            styled
            fluid
            defaultActiveIndex={-1}
            panels={data[API.ROLES].map(roleId => ({
              key: roleId,
              title: { content: (<Text>{roleId}</Text>) },
              content: { content: (<RoleLookup roleId={roleId} />) }
            }))}
          />
        </>
        }
        <Divider hidden />
        <CreateUser />
      </Grid.Column>
      <Grid.Column>
        {!error && !loading && !userEdited && data !== undefined && <UserAccess userId={userId} />}
      </Grid.Column>
    </Grid>
  )
}

export default AppHome
