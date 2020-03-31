import React, { useContext, useEffect } from 'react'
import useAxios from 'axios-hooks'
import { Grid } from 'semantic-ui-react'
import { Title } from '@statisticsnorway/ssb-component-library'

import { UpdateGroup } from '../'
import { ApiContext, GroupsView } from '../../utilities'
import { AUTH_API } from '../../configurations'

function GroupLookup ({ groupId }) {
  const { authApi } = useContext(ApiContext)

  const [{ data, loading, error }, refetch] = useAxios(`${authApi}${AUTH_API.GET_GROUP(groupId)}`)

  useEffect(() => {
    if (!loading && error) {
      console.log(error.response)
    }
  }, [error, loading, data])

  if (!loading && !error && data !== undefined) {
    return (
      <Grid>
        {Object.entries(data).map(([key, value]) =>
          <Grid.Row key={key}>
            <Grid.Column width={4}>
              <Title size={4}>{key}</Title>
            </Grid.Column>
            <Grid.Column width={12}>
              {GroupsView(key, value)}
            </Grid.Column>
          </Grid.Row>
        )}
        <Grid.Row>
          <Grid.Column textAlign='right'>
            <UpdateGroup group={data} isNew={false} refetch={refetch} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  } else {
    return null
  }
}

export default GroupLookup
