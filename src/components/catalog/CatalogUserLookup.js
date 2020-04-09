import React, { useContext, useEffect } from 'react'
import useAxios from 'axios-hooks'
import { Grid, Table, TextArea } from 'semantic-ui-react'

import { ApiContext, DescriptionPopup, LanguageContext, makeEnum, RolesView } from '../../utilities'
import { AUTH_API } from '../../configurations'
import { CATALOG, CATALOGUSER, TEST_IDS } from '../../enums'

function CatalogUserLookup ({ path }) {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [{ data, loading, error }] = useAxios(`${authApi}${AUTH_API.GET_CATALOGACCESS(path)}`)

  useEffect(() => {
    if (!loading && error) {
      console.log(error.response)
    }
  }, [error, loading, data])

  if (!loading && !error && data !== undefined) {
    console.log(data, "CatalogUserLookup")
    return (
      <Grid>
        <Table celled sortable size='small'>
          <Table.Header>
              <Table.Row>
                <Table.HeaderCell sorted={'ascending'}>{CATALOGUSER.USER[language]}</Table.HeaderCell>
                <Table.HeaderCell>{CATALOGUSER.GROUP[language]}</Table.HeaderCell>
                <Table.HeaderCell>{CATALOGUSER.ROLE[language]}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
            {data['catalogAccess'].map(ca =>
              <Table.Row key={ca.user}>
                <Table.Cell>{ca.user}</Table.Cell>
                <Table.Cell>{ca.group}</Table.Cell>
                <Table.Cell>{ca.role}</Table.Cell>
              </Table.Row>
            )}
            </Table.Body>
        </Table>
      </Grid>
    )
  } else {
    return null
  }
}

export default CatalogUserLookup
