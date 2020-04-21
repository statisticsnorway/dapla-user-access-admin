import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Grid, Table } from 'semantic-ui-react'

import { ApiContext, LanguageContext, sortArrayOfObjects } from '../../utilities'
import { AUTH_API } from '../../configurations'
import { CATALOGUSER, TEST_IDS } from '../../enums'

function CatalogUserLookup ({ path, valuation, state }) {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [catalogAccess, setCatalogAccess] = useState([])
  const [direction, setDirection] = useState('descending')

  const [{ data, loading, error }] = useAxios(`${authApi}${AUTH_API.GET_CATALOGACCESS(path, valuation, state)}`)

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      setCatalogAccess(sortArrayOfObjects(data['catalogAccess'], ['user', 'group', 'role']))
    }
    if (!loading && error) {
      console.log(error.response)
    }
  }, [data, error, loading])

  const handleSort = () => {
    setDirection(direction === 'ascending' ? 'descending' : 'ascending')
    setCatalogAccess(sortArrayOfObjects(data['catalogAccess'], ['user', 'group', 'role'], direction))
  }

  return (
    <Grid>
      <Table celled sortable size='small'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sorted={direction} onClick={() => handleSort()} data-testid={TEST_IDS.TABLE_SORT}>
              {CATALOGUSER.USER[language]}
            </Table.HeaderCell>
            <Table.HeaderCell>{CATALOGUSER.PRIVILEGES[language]}</Table.HeaderCell>
            <Table.HeaderCell>{CATALOGUSER.GROUP[language]}</Table.HeaderCell>
            <Table.HeaderCell>{CATALOGUSER.ROLE[language]}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {!loading && !error && catalogAccess !== undefined &&
        <Table.Body>
          {catalogAccess.map((ca, index) =>
            <Table.Row key={index}>
              <Table.Cell>{ca.user}</Table.Cell>
              <Table.Cell>{ca.privileges}</Table.Cell>
              <Table.Cell>{ca.group}</Table.Cell>
              <Table.Cell>{ca.role}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
        }
      </Table>
    </Grid>
  )
}

export default CatalogUserLookup
