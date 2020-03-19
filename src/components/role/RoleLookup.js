import React, { useContext, useEffect } from 'react'
import useAxios from 'axios-hooks'
import { Grid } from 'semantic-ui-react'
import { Text, Title } from '@statisticsnorway/ssb-component-library'

import { ApiContext } from '../../utilities'
import { API } from '../../configurations'

function RoleLookup ({ roleId }) {
  const { authApi } = useContext(ApiContext)

  const [{ data, loading, error }] = useAxios(`${authApi}${API.GET_ROLE(roleId)}`)

  useEffect(() => {
    if (!loading && error) {
      console.log(error.response)
    }
  }, [error, loading, data])

  return (
    <Grid>
      {!loading && !error && data !== undefined && Object.entries(data).map(([key, value]) =>
        <Grid.Row key={key}>
          <Grid.Column width={4}>
            <Title size={4}>{key}</Title>
          </Grid.Column>
          <Grid.Column width={12}>
            <Text>{value.toString()}</Text>
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  )
}

export default RoleLookup
