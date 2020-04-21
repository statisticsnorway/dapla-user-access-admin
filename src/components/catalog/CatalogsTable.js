import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Grid, Icon, Input, Loader, Portal, Segment, Table } from 'semantic-ui-react'

import { CatalogUserLookup, ErrorMessage } from '../'
import { ApiContext, convertToDatetimeJsonString, LanguageContext, sortArrayOfObjects } from '../../utilities'
import { CATALOG_API } from '../../configurations'
import { CATALOG, TEST_IDS, UI } from '../../enums'

function CatalogsTable () {
  const { catalogApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [open, setOpen] = useState([])
  const [catalogs, setCatalogs] = useState([])
  const [direction, setDirection] = useState('descending')

  const [{ data, loading, error }] = useAxios(`${catalogApi}${CATALOG_API.GET_CATALOGS}`)

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      setOpen(data[CATALOG_API.CATALOGS].map(() => false))
      setCatalogs(sortArrayOfObjects(data[CATALOG_API.CATALOGS], [CATALOG_API.CATALOG_OBJECT.STRING[0]]))
    }
  }, [data, error, loading])

  const handleSort = () => {
    setDirection(direction === 'ascending' ? 'descending' : 'ascending')
    setCatalogs(sortArrayOfObjects(data[CATALOG_API.CATALOGS], [CATALOG_API.CATALOG_OBJECT.STRING[0]], direction))
  }

  const handleFilter = (string) => setCatalogs(data[CATALOG_API.CATALOGS].filter(({ id }) => id.path.includes(string)))

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
        <Table celled sortable size='large'>
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
              <Table.HeaderCell>{CATALOG.PARENT_URI[language]}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {catalogs.map(({ id, type, valuation, state, parentUri }, index) =>
              <Table.Row key={index}>
                <Table.Cell style={{ fontWeight: 'bold' }}>{id.path}</Table.Cell>
                <Table.Cell>
                  <Portal
                    openOnTriggerClick
                    closeOnTriggerClick
                    onOpen={() => handleOpen(index)}
                    onClose={() => handleClose(index)}
                    trigger={<Icon name={open[index] ? 'caret square down outline' : 'caret square right outline'} />}
                  >
                    <Segment style={{ left: '20%', position: 'fixed', zIndex: 100 }}>
                      <CatalogUserLookup valuation={valuation} state={state} path={id.path.split('/').join('.')} />
                    </Segment>
                  </Portal>
                </Table.Cell>
                <Table.Cell>{convertToDatetimeJsonString(id.timestamp)}</Table.Cell>
                <Table.Cell>{type}</Table.Cell>
                <Table.Cell>{valuation}</Table.Cell>
                <Table.Cell>{state}</Table.Cell>
                <Table.Cell>{parentUri}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      }
    </>
  )
}

export default CatalogsTable
