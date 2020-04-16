import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Grid, Input, Loader, Table, Portal, Icon, Segment } from 'semantic-ui-react'

import { ErrorMessage } from '../'
import { ApiContext, LanguageContext, sortArrayOfObjects, convertToDatetimeJsonString } from '../../utilities'
import { AUTH_API, CATALOG_API } from '../../configurations'
import { CATALOG, TEST_IDS, UI } from '../../enums'
import CatalogUserLookup from './CatalogUserLookup'

function CatalogsTable () {
  const { catalogApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [catalogs, setCatalogs] = useState([])
  const [direction, setDirection] = useState('descending')

    const [{ data, loading, error }] = useAxios(`${catalogApi}${CATALOG_API.GET_CATALOGS}`)

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      setCatalogs(sortArrayOfObjects(data[CATALOG_API.CATALOGS], [CATALOG_API.CATALOG_OBJECT.STRING[0]]))
    }
  }, [data, error, loading])

  const handleSort = () => {
    setDirection(direction === 'ascending' ? 'descending' : 'ascending')
    setCatalogs(sortArrayOfObjects(data[CATALOG_API.CATALOGS], [CATALOG_API.CATALOG_OBJECT.STRING[0]], direction))
  }

  const handleFilter = (string) => setCatalogs(data[CATALOG_API.CATALOGS].filter(({ id }) => id.path.includes(string)))

  let open = false
  const handleOpen = () => {
    open=true
  }

  const handleClose = () => {
    open=false
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
                  closeOnTriggerClick
                  openOnTriggerClick
                  trigger={
                    <Icon name={open ? 'caret square left outline' : 'caret square right outline'}
                          negative={open} positive={!open} />
                  }
                  onOpen={handleOpen}
                  onClose={handleClose}
                  >
                  <Segment
                    style={{
                      left: '20%',
                      position: 'fixed',
                      zIndex: 100,
                    }}
                  >
                    <CatalogUserLookup valuation={valuation} state={state} path={id.path.split('/').join('.')} />
                  </Segment>
                </Portal>
                </Table.Cell>
                <Table.Cell style={{ fontWeight: 'bold' }}>{convertToDatetimeJsonString(id.timestamp)}</Table.Cell>
                <Table.Cell style={{ fontWeight: 'bold' }}>{type}</Table.Cell>
                <Table.Cell style={{ fontWeight: 'bold' }}>{valuation}</Table.Cell>
                <Table.Cell style={{ fontWeight: 'bold' }}>{state}</Table.Cell>
                <Table.Cell style={{ fontWeight: 'bold' }}>{parentUri}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
}
    </>
  )
}

export default CatalogsTable
