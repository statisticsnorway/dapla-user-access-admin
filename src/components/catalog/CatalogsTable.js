import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Accordion, Divider, Grid, Input, List, Loader, Table } from 'semantic-ui-react'

import { ErrorMessage, RoleLookup } from '../'
import { ApiContext, LanguageContext, sortArrayOfObjects, convertToDatetimeString } from '../../utilities'
import { AUTH_API, CATALOG_API } from '../../configurations'
import { CATALOG, CATALOGUSER, TEST_IDS, UI } from '../../enums'
import CatalogUserLookup from './CatalogUserLookup'
import { Text, Title } from '@statisticsnorway/ssb-component-library'

function CatalogsTable () {
  const { catalogApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [catalogs, setCatalogs] = useState([])
  const [direction, setDirection] = useState('descending')

  // const [{ data, loading, error }, refetch] = useAxios(`${catalogApi}${AUTH_API.GET_CATALOGS}`)
  const [{ data, loading, error }, refetch] = useAxios('http://localhost:10110/catalog')

  useEffect(() => {
    console.log(`${catalogApi}${AUTH_API.GET_CATALOGS}`, 'uri')
    console.log(data, "data in useEffect")
    if (!loading && !error && data !== undefined) {
      setCatalogs(sortArrayOfObjects(data[CATALOG_API.CATALOGS], [CATALOG_API.CATALOG_OBJECT.STRING[0]]))
    }
  }, [data, error, loading])

  const handleSort = () => {
    setDirection(direction === 'ascending' ? 'descending' : 'ascending')
    setCatalogs(sortArrayOfObjects(data[CATALOG_API.CATALOGS], [CATALOG_API.CATALOG_OBJECT.STRING[0]], direction))
  }

  const handleFilter = (string) => setCatalogs(data[CATALOG_API.CATALOGS].filter(({ id }) => id.path.includes(string)))

  let activeIndex = 1
  const handleClick = (e, titleProps) => {
    console.log(activeIndex, "activeIndex før")
    const { index } = titleProps
    activeIndex = index
    console.log(activeIndex, "activeIndex etter")
  }

  const isActive = (index) => {
    console.log(index, "index")
    console.log(activeIndex, "activeIndex")
    return activeIndex === index
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
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>{CATALOG.TIMESTAMP[language]}</Table.HeaderCell>
              <Table.HeaderCell>{CATALOG.TYPE[language]}</Table.HeaderCell>
              <Table.HeaderCell>{CATALOG.VALUATION[language]}</Table.HeaderCell>
              <Table.HeaderCell>{CATALOG.STATE[language]}</Table.HeaderCell>
              <Table.HeaderCell>{CATALOG.PARENT_URI[language]}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {catalogs.map(({ id, type, valuation, state, parentUri }, index) =>
              <Table.Row key={id.path+id.timestamp}>
                <Table.Cell style={{ fontWeight: 'bold' }}>{id.path}</Table.Cell>
                <Table.Cell textAlign='top'>
                  <Accordion
                    fluid
                    styled
                    defaultActiveIndex={-1}>
                    <Accordion.Title active={activeIndex === index} index={index} onClick={handleClick}/>
                    <Accordion.Content active={isActive(index)}>
                      <CatalogUserLookup path={id.path.split('/').join('.')} />
                    </Accordion.Content>
                  </Accordion>
                </Table.Cell>
                <Table.Cell style={{ fontWeight: 'bold' }}>{convertToDatetimeString(id.timestamp)}</Table.Cell>
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
