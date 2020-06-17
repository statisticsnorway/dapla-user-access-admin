import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Grid, Icon, Input, Loader, Popup, Table } from 'semantic-ui-react'

import { CatalogUserLookupPortal, ErrorMessage } from '../'
import { ApiContext, convertToDatetimeJsonString, LanguageContext, truncateString } from '../../utilities'
import { CATALOG_API, SSB_COLORS } from '../../configurations'
import { CATALOG, UI } from '../../enums'

function CatalogsTable () {
  const { catalogApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [open, setOpen] = useState([])
  const [catalogs, setCatalogs] = useState([])

  const [{ data, loading, error }] = useAxios(`${catalogApi}${CATALOG_API.GET_CATALOGS}`)

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      if (Array.isArray(data[CATALOG_API.CATALOGS])) {
        try {
          setOpen(data[CATALOG_API.CATALOGS].map(() => false))
          setCatalogs(data[CATALOG_API.CATALOGS])
        } catch (e) {
          console.log(e)
        }
      } else {
        console.log('Recieved catalogs is not of Array format')
      }
    }
  }, [data, error, loading])

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
        <Table celled compact='very' size='large'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{CATALOG.PATH[language]}</Table.HeaderCell>
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
                      trigger={<div>{truncateString(id[CATALOG_API.CATALOG_OBJECT.OBJECT.STRING[0]], 75)}</div>}
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
                  <Popup
                    basic
                    flowing
                    position='left center'
                    trigger={<Icon name='key' style={{ color: SSB_COLORS.YELLOW }} />}
                  >
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
