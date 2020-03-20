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

  return (
    <Grid>
      {!loading && !error && data !== undefined && Object.entries(data).map(([key, value]) =>
        <Grid.Row key={key} verticalAlign='middle' style={{paddingTop: '0.5em', paddingBottom: '0.5em'}}>
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
          {!loading && !error && data !== undefined && <UpdateRole role={data} refetch={refetch} />}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default RoleLookup
