import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Grid, Icon, Input, Loader, Popup, Table } from 'semantic-ui-react'

import { CatalogUserLookupPortal, ErrorMessage } from '../'
import {
  ApiContext,
  convertToDatetimeJsonString,
  LanguageContext,
  sortArrayOfObjects,
  truncateString
} from '../../utilities'
import { CATALOG_API } from '../../configurations'
import { CATALOG, TEST_IDS, UI } from '../../enums'

function CatalogsTable () {
  const { catalogApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [open, setOpen] = useState([])
  const [catalogs, setCatalogs] = useState([])
  const [direction, setDirection] = useState('ascending')

  const [{ data, loading, error }] = useAxios(`${catalogApi}${CATALOG_API.GET_CATALOGS}`)

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      try {
        setOpen(data[CATALOG_API.CATALOGS].map(() => false))
        setCatalogs(sortArrayOfObjects(
          data[CATALOG_API.CATALOGS],
          [[CATALOG_API.CATALOG_OBJECT.OBJECT.NAME], [CATALOG_API.CATALOG_OBJECT.OBJECT.STRING[0]]]
        ))
      } catch (e) {
        console.log(e)
      }
    }
  }, [data, error, loading])

  const handleSort = () => {
    try {
      const newDirection = direction === 'ascending' ? 'descending' : 'ascending'

      setDirection(newDirection)
      setCatalogs(
        sortArrayOfObjects(
          data[CATALOG_API.CATALOGS],
          [[CATALOG_API.CATALOG_OBJECT.OBJECT.NAME], [CATALOG_API.CATALOG_OBJECT.OBJECT.STRING[0]]],
          newDirection
        )
      )
    } catch (e) {
      console.log(e)
    }
  }

  const handleFilter = (string) => {
    try {
      setCatalogs(data[CATALOG_API.CATALOGS].filter(({ id }) =>
        id[CATALOG_API.CATALOG_OBJECT.OBJECT.STRING[0]].includes(string)
      ))
    } catch (e) {
      console.log(e)
    }
  }

  const handleOpen = (index) => {
    const newOpen = open.map((state, ix) => index === ix ? true : state)
    setOpen(newOpen)
  }

  const handleClose = (index) => {
    const newOpen = open.map((state, ix) => index === ix ? false : state)
    setOpen(newOpen)
  }

  return (
    <>
      <Grid columns='equal'>
        <Grid.Column>
          <Input
            size='large'
            icon='search'
            disabled={loading || !!error}
            placeholder={UI.FILTER_TABLE[language]}
            onChange={(event, { value }) => handleFilter(value)}
          />
        </Grid.Column>
      </Grid>
      {loading ? <Loader active inline='centered' /> : error ?
        <>
          <Divider hidden />
          <ErrorMessage error={error} />
        </>
        :
        <Table celled sortable compact='very' size='large'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell sorted={direction} onClick={() => handleSort()} data-testid={TEST_IDS.TABLE_SORT}>
                {CATALOG.PATH[language]}
              </Table.HeaderCell>
              <Table.HeaderCell>{CATALOG.USERS[language]}</Table.HeaderCell>
              <Table.HeaderCell>{CATALOG.TIMESTAMP[language]}</Table.HeaderCell>
              <Table.HeaderCell>{CATALOG.TYPE[language]}</Table.HeaderCell>
              <Table.HeaderCell>{CATALOG.VALUATION[language]}</Table.HeaderCell>
              <Table.HeaderCell>{CATALOG.STATE[language]}</Table.HeaderCell>
              <Table.HeaderCell>{CATALOG.PSEUDO_CONFIG[language]}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {catalogs.map(({ id, pseudoConfig, state, type, valuation }, index) =>
              <Table.Row key={index}>
                <Table.Cell style={{ fontWeight: 'bold' }}>
                  {id[CATALOG_API.CATALOG_OBJECT.OBJECT.STRING[0]].length > 75 ?
                    <Popup
                      basic
                      flowing
                      trigger={truncateString(id[CATALOG_API.CATALOG_OBJECT.OBJECT.STRING[0]], 75)}
                    >
                      {id[CATALOG_API.CATALOG_OBJECT.OBJECT.STRING[0]]}
                    </Popup>
                    :
                    id[CATALOG_API.CATALOG_OBJECT.OBJECT.STRING[0]]
                  }
                </Table.Cell>
                <Table.Cell textAlign='center'>
                  <CatalogUserLookupPortal
                    open={open}
                    index={index}
                    state={state}
                    valuation={valuation}
                    handleOpen={handleOpen}
                    handleClose={handleClose}
                    path={id[CATALOG_API.CATALOG_OBJECT.OBJECT.STRING[0]]}
                  />
                </Table.Cell>
                <Table.Cell>{convertToDatetimeJsonString(id[CATALOG_API.CATALOG_OBJECT.OBJECT.STRING[1]])}</Table.Cell>
                <Table.Cell>{type}</Table.Cell>
                <Table.Cell>{valuation}</Table.Cell>
                <Table.Cell>{state}</Table.Cell>
                <Table.Cell textAlign='center'>
                  <Popup basic flowing position='left center' trigger={<Icon name='key' size='large' />}>
                    <pre>{JSON.stringify(pseudoConfig, null, 2)}</pre>
                  </Popup>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      }
    </>
  )
}

export default CatalogsTable
