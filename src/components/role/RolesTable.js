import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Grid, Icon, Input, List, Loader, Popup, Table } from 'semantic-ui-react'

import { UpdateRole } from '../'
import { ApiContext, LanguageContext } from '../../utilities'
import { API, SSB_COLORS } from '../../configurations'
import { DATASET_STATE, PRIVILEGE, ROLE, UI, VALUATION } from '../../enums'

function RolesTable () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [roles, setRoles] = useState([])
  const [direction, setDirection] = useState('descending')

  const [{ data, loading, error }, refetch] = useAxios(`${authApi}${API.GET_ROLES}`)

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      setRoles(data[API.ROLES].sort((a, b) => a.roleId.localeCompare(b.roleId)))
    }
  }, [data, error, loading])

  const handleSort = () => {
    setDirection(direction === 'ascending' ? 'descending' : 'ascending')

    if (direction === 'ascending') {
      setRoles(roles.sort((a, b) => a.roleId.localeCompare(b.roleId)))
    } else {
      setRoles(roles.sort((a, b) => b.roleId.localeCompare(a.roleId)))
    }
  }

  const handleFilter = (string) => setRoles(data[API.ROLES].filter(({ roleId }) => roleId.includes(string)))

  const CheckedCell = ({ entry, list }) =>
    <Table.Cell positive={list && list.includes(entry)}>
      {list && list.includes(entry) && <Icon name='checkmark' style={{ color: SSB_COLORS.GREEN }} />}
    </Table.Cell>

  return (
    <>
      <Grid columns='equal'>
        <Grid.Column>
          <Input
            size='large'
            icon='search'
            disabled={loading || error}
            placeholder={UI.FILTER_TABLE[language]}
            onChange={(event, { value }) => handleFilter(value)}
          />
        </Grid.Column>
        <Grid.Column textAlign='right'>
          <UpdateRole isNew={true} refetch={refetch} />
        </Grid.Column>
      </Grid>
      {loading ? <Loader active inline='centered' /> :
        <Table celled sortable size='large'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={1} />
              <Popup
                basic
                flowing
                trigger={<Table.HeaderCell colSpan={4}>{ROLE.PRIVILEGES[language]}</Table.HeaderCell>}
              >
                <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                Description
              </Popup>
              <Table.HeaderCell colSpan={2} />
              <Popup
                basic
                flowing
                trigger={<Table.HeaderCell colSpan={6}>{ROLE.STATES[language]}</Table.HeaderCell>}
              >
                <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                Description
              </Popup>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell sorted={direction} onClick={() => handleSort()}>
                {ROLE.ROLE_ID[language]}
              </Table.HeaderCell>
              {API.ENUMS.PRIVILEGES.map(privilege =>
                <Table.HeaderCell key={privilege}>{PRIVILEGE[privilege][language]}</Table.HeaderCell>
              )}
              <Popup
                basic
                flowing
                trigger={<Table.HeaderCell>{ROLE.NAMESPACE_PREFIXES[language]}</Table.HeaderCell>}
              >
                <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                Description
              </Popup>
              <Popup
                basic
                flowing
                trigger={<Table.HeaderCell>{ROLE.MAX_VALUATION[language]}</Table.HeaderCell>}
              >
                <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                Description
              </Popup>
              {API.ENUMS.STATES.map(state =>
                <Table.HeaderCell key={state}>{DATASET_STATE[state][language]}</Table.HeaderCell>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {roles.map(({ maxValuation, namespacePrefixes, roleId, privileges, states }) => (
              <Table.Row key={roleId}>
                <Table.Cell>{roleId}</Table.Cell>
                {API.ENUMS.PRIVILEGES.map(privilege =>
                  <CheckedCell key={privilege} list={privileges} entry={privilege} />
                )}
                <Table.Cell>
                  <List>
                    {namespacePrefixes.map(namespacePrefix =>
                      <List.Item key={namespacePrefix}>{namespacePrefix}</List.Item>
                    )}
                  </List>
                </Table.Cell>
                <Table.Cell
                  positive={maxValuation === API.ENUMS.VALUATIONS[0]}
                  negative={maxValuation === API.ENUMS.VALUATIONS[3]}
                  warning={API.ENUMS.VALUATIONS[1].concat(API.ENUMS.VALUATIONS[2]).includes(maxValuation)}
                >
                  {VALUATION[maxValuation][language]}
                </Table.Cell>
                {API.ENUMS.STATES.map(state =>
                  <CheckedCell key={state} list={states} entry={state} />
                )}
              </Table.Row>
            ))
            }
          </Table.Body>
        </Table>
      }
    </>
  )
}

export default RolesTable
