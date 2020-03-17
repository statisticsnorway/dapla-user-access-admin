import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Icon, List } from 'semantic-ui-react'
import { Input as SSBInput } from '@statisticsnorway/ssb-component-library'

import { ApiContext, getNestedObject } from '../utilities'
import { API, SSB_COLORS } from '../configurations'

function AppHome () {
  const { authApi } = useContext(ApiContext)

  const [user, setUser] = useState('magnus')
  const [userEdited, setUserEdited] = useState(false)

  const [{
    data: authData,
    loading: authLoading,
    error: authError,
    response: authResponse
  }, refetch] = useAxios(`${authApi}${API.GET_USER(user)}`, { manual: true })

  useEffect(() => {
    if (!authLoading && !authError) {
      //console.log(authResponse)
    }
  }, [authLoading, authError, authResponse])

  return (
    <>
      <SSBInput
        label='User'
        placeholder='User'
        disabled={authLoading}
        error={authError && !userEdited}
        value={user}
        handleChange={(value) => {
          setUser(value)
          setUserEdited(true)
        }}
        errorMessage={
          authError && !userEdited && getNestedObject(authError, API.ERROR_PATH) === undefined ?
            authError.toString() : getNestedObject(authError, API.ERROR_PATH)
        }
      />
      <Icon
        link
        size='large'
        name='sync'
        style={{ color: SSB_COLORS.BLUE }}
        onClick={() => {refetch()}}
      />
      <List>
        {!authError && !authLoading && authData !== undefined && authData.roles.map(role =>
          <List.Item>{role}</List.Item>
        )}
      </List>
    </>
  )
}

export default AppHome
