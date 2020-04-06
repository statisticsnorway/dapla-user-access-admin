import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Grid, Input, List, Loader, Table } from 'semantic-ui-react'

import { ErrorMessage } from '../'
import { ApiContext, LanguageContext, sortArrayOfObjects, convertToDatetimeString } from '../../utilities'
import { AUTH_API, CATALOG_API } from '../../configurations'
import { CATALOG, TEST_IDS, UI } from '../../enums'

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
                <Table.Cell style={{ fontWeight: 'bold' }}>{convertToDatetimeString(id.timestamp)}</Table.Cell>
                <Table.Cell style={{ fontWeight: 'bold' }}>{type}</Table.Cell>
                <Table.Cell style={{ fontWeight: 'bold' }}>{valuation}</Table.Cell>
                <Table.Cell style={{ fontWeight: 'bold' }}>{state}</Table.Cell>
                <Table.Cell style={{ fontWeight: 'bold' }}>{parentUri}</Table.Cell>
                {/*<Table.Cell textAlign='center'>*/}
                {/*  <UpdateCatalog isNew={false} refetch={refetch} catalog={catalogs[index]} />*/}
                {/*</Table.Cell>*/}
                {/*<Table.Cell>*/}
                {/*  {groups &&*/}
                {/*  <List>*/}
                {/*    {groups.map(group => <List.Item key={group}>{group}</List.Item>)}*/}
                {/*  </List>*/}
                {/*  }*/}
                {/*</Table.Cell>*/}
                {/*<Table.Cell>*/}
                {/*  {roles &&*/}
                {/*  <List>*/}
                {/*    {roles.map(role => <List.Item key={role}>{role}</List.Item>)}*/}
                {/*  </List>*/}
                {/*  }*/}
                {/*</Table.Cell>*/}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
}
    </>
  )
}

export default CatalogsTable
