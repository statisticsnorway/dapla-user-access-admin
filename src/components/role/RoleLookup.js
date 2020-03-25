import React, { useContext, useEffect } from 'react'
import useAxios from 'axios-hooks'
import { Grid } from 'semantic-ui-react'
import { Text, Title } from '@statisticsnorway/ssb-component-library'

import { UpdateRole } from '../'
import { ApiContext } from '../../utilities'
import { API } from '../../configurations'

function RoleLookup ({ roleId }) {
  const { authApi } = useContext(ApiContext)

  const [{ data, loading, error }, refetch] = useAxios(`${authApi}${API.GET_ROLE(roleId)}`)

  useEffect(() => {
    if (!loading && error) {
      console.log(error.response)
    }
  }, [error, loading, data])

  if (!loading && !error && data !== undefined) {
    return (
      <Grid>
        {Object.entries(data).map(([key, value]) =>
          <Grid.Row key={key} verticalAlign='middle' style={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}>
            <Grid.Column width={4}>
              <Title size={4}>{key}</Title>
            </Grid.Column>
            <Grid.Column width={12}>
              <Text>{value.toString()}</Text>
            </Grid.Column>
          </Grid.Row>
        )}
        <Grid.Row>
          <Grid.Column textAlign='right'>
            <UpdateRole isNew={false} refetch={refetch} role={data} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  } else {
    return null
  }
}

export default RoleLookup
