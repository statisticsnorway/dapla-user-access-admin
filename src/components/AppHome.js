import React, { useContext, useState } from 'react'
import useAxios from 'axios-hooks'
import { Grid, Icon, List } from 'semantic-ui-react'
import { Input as SSBInput, Title } from '@statisticsnorway/ssb-component-library'

import { UserAccess } from './'
import { ApiContext, getNestedObject, LanguageContext } from '../utilities'
import { API, SSB_COLORS } from '../configurations'
import { HOME, UI } from '../enums'

function AppHome () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [user, setUser] = useState('magnus')
  const [userEdited, setUserEdited] = useState(false)

  const [{ data, loading, error }, refetch] = useAxios(`${authApi}${API.GET_USER(user)}`, { manual: true })

  return (
    <Grid columns='equal'>
      <Grid.Column>
        <Title size={3}>{UI.USER[language]}</Title>
        <SSBInput
          placeholder={UI.USER[language]}
          error={!!error}
          value={user}
          handleChange={(value) => {
            setUser(value)
            setUserEdited(true)
          }}
          errorMessage={
            error && getNestedObject(error, API.ERROR_PATH) === undefined ?
              error.toString() : getNestedObject(error, API.ERROR_PATH)
          }
        />
        <Icon
          link
          size='large'
          name='sync'
          style={{ color: SSB_COLORS.BLUE, marginTop: '0.5em', marginBottom: '0.5em' }}
          onClick={() => {
            refetch()
            setUserEdited(false)
          }}
        />
        {!error && !loading && !userEdited && data !== undefined &&
        <>
          <Title size={3}>{HOME.ROLES[language]}</Title>
          <List>
            {data[API.ROLES].map(role => <List.Item key={role}>{role}</List.Item>)}
          </List>
        </>
        }
      </Grid.Column>
      <Grid.Column>
        {!error && !loading && !userEdited && data !== undefined && <UserAccess user={user} />}
      </Grid.Column>
    </Grid>
  )
}

export default AppHome
