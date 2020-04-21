import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Grid, Table } from 'semantic-ui-react'

import { ApiContext, LanguageContext, sortArrayOfObjects } from '../../utilities'
import { AUTH_API } from '../../configurations'
import { CATALOGUSER } from '../../enums'

function CatalogUserLookup ({ path, valuation, state }) {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [{ data, loading, error }] = useAxios(`${authApi}${AUTH_API.GET_CATALOGACCESS(path, valuation, state)}`)
  const [catalogAccess, setCatalogAccess] = useState([])
  const [direction, setDirection] = useState('ascending')

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      // console.log(data['catalogAccess'], 'catalogAccess i useEffect før sortering')
      // console.log(sortArrayOfObjects(data['catalogAccess'], ['user','group','role'], direction))
      setCatalogAccess(sortArrayOfObjects(data['catalogAccess'], ['user','group','role'], direction))
      console.log(catalogAccess, 'catalogAccess i useEffect etter sortering')
    }
    if (!loading && error) {
      console.log(error.response)
    }
  }, [data, error, loading])

  const handleSort = () => {
    setDirection(direction === 'ascending' ? 'descending' : 'ascending')
    setCatalogAccess(sortArrayOfObjects(data['catalogAccess'], ['user','group','role'], direction))
  }

  return (
      <Grid>
        <Table celled sortable size='small'>
          <Table.Header>
              <Table.Row>
                <Table.HeaderCell sorted={direction} onClick={() => handleSort()} >{CATALOGUSER.USER[language]}</Table.HeaderCell>
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
