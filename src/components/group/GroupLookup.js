import React, { useContext, useEffect } from 'react'
import useAxios from 'axios-hooks'
import { Grid } from 'semantic-ui-react'

import { UpdateGroup } from '../'
import { ApiContext, DescriptionPopup, GroupsView, LanguageContext, makeEnum } from '../../utilities'
import { AUTH_API } from '../../configurations'
import { GROUP } from '../../enums'

function GroupLookup ({ groupId }) {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

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
          <Grid.Row key={key} verticalAlign='middle'>
            <Grid.Column width={4}>
              {DescriptionPopup(<span style={{ fontWeight: 'bold' }}>{GROUP[makeEnum(key)][language]}</span>)}
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
