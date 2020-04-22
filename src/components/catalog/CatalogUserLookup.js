import React, { useContext } from 'react'
import { Grid, Segment, Table } from 'semantic-ui-react'

import { LanguageContext } from '../../utilities'
import { CATALOGUSER, TEST_IDS } from '../../enums'

function CatalogUserLookup ({ direction, handleSort, loading, error, catalogAccess }) {
  const { language } = useContext(LanguageContext)

  return (
    <Segment basic style={{ marginTop: 0 }}>
      <Segment compact>
        <Grid>
          <Table celled sortable size='small' style={{ paddingLeft: 0, paddingRight: 0 }}>
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
      </Segment>
    </Segment>
  )
}

export default CatalogUserLookup
