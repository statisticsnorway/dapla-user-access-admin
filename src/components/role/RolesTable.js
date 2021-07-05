import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Grid, Icon, Input, List, Loader, Table } from 'semantic-ui-react'
import { ErrorMessage, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { UpdateRole } from '../'
import { ApiContext, LanguageContext } from '../../context/AppContext'
import { DescriptionPopup, sortArrayOfObjects } from '../../utilities'
import { AUTH_API, checkAccess } from '../../configurations'
import { DATASET_STATE, PRIVILEGE, ROLE, TEST_IDS, UI, VALUATION } from '../../enums'

function RolesTable () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [roles, setRoles] = useState([])
  const [direction, setDirection] = useState('ascending')

  const [{ data, loading, error }, refetch] = useAxios(`${authApi}${AUTH_API.GET_ROLES}`)

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      setRoles(sortArrayOfObjects(data[AUTH_API.ROLES], [AUTH_API.ROLE_OBJECT.STRING[0]]))
    }
  }, [data, error, loading])

  const handleSort = () => {
    const newDirection = direction === 'ascending' ? 'descending' : 'ascending'

    setDirection(newDirection)
    setRoles(sortArrayOfObjects(data[AUTH_API.ROLES], [AUTH_API.ROLE_OBJECT.STRING[0]], newDirection))
  }

  const handleFilter = (string) => setRoles(data[AUTH_API.ROLES].filter(({ roleId }) => roleId.includes(string)))

  const CheckedCell = ({ entry, list }) => {
    const positive = checkAccess(list, entry)

    return (
      <Table.Cell positive={positive} negative={!positive} textAlign='center'>
        <Icon name={positive ? 'checkmark' : 'ban'} style={{ color: SSB_COLORS[positive ? 'GREEN' : 'RED'] }} />
      </Table.Cell>
    )
  }

  return (
    <>
      <Grid columns='equal'>
        <Grid.Column>
          <Input
            fluid
            size='large'
            icon='search'
            disabled={loading || !!error}
            placeholder={UI.FILTER_TABLE[language]}
            onChange={(event, { value }) => handleFilter(value)}
          />
        </Grid.Column>
        <Grid.Column />
        <Grid.Column />
        <Grid.Column textAlign='right'>
          <UpdateRole isNew={true} refetch={refetch} />
        </Grid.Column>
      </Grid>
      {loading ? <Loader active inline='centered' /> : error ?
        <>
          <Divider hidden />
          <ErrorMessage error={error} language={language} />
        </>
        :
        <Table celled sortable selectable compact='very' size='large'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={2} />
              {DescriptionPopup(<Table.HeaderCell colSpan={5}>{ROLE.PRIVILEGES[language]}</Table.HeaderCell>)}
              <Table.HeaderCell colSpan={2} />
              {DescriptionPopup(<Table.HeaderCell colSpan={7}>{ROLE.STATES[language]}</Table.HeaderCell>)}
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell sorted={direction} onClick={() => handleSort()} data-testid={TEST_IDS.TABLE_SORT}>
                {ROLE.ROLE_ID[language]}
              </Table.HeaderCell>
              <Table.HeaderCell />
              {AUTH_API.ENUMS.PRIVILEGES.map(privilege =>
                <Table.HeaderCell key={privilege}>{PRIVILEGE[privilege][language]}</Table.HeaderCell>
              )}
              {DescriptionPopup(<Table.HeaderCell>{ROLE.PATHS[language]}</Table.HeaderCell>)}
              {DescriptionPopup(<Table.HeaderCell>{ROLE.MAX_VALUATION[language]}</Table.HeaderCell>)}
              {AUTH_API.ENUMS.STATES.map(state =>
                <Table.HeaderCell key={state}>{DATASET_STATE[state][language]}</Table.HeaderCell>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {roles.map(({ maxValuation, roleId, paths, privileges, states }, index) =>
              <Table.Row key={roleId}>
                <Table.Cell style={{ fontWeight: 'bold' }}>{roleId}</Table.Cell>
                <Table.Cell textAlign='center'>
                  <UpdateRole isNew={false} refetch={refetch} role={roles[index]} />
                </Table.Cell>
                {AUTH_API.ENUMS.PRIVILEGES.map(privilege =>
                  <CheckedCell key={privilege} list={privileges} entry={privilege} />
                )}
                <Table.Cell>
                  {paths.hasOwnProperty(AUTH_API.INCLUDES) &&
                  <List style={{ color: SSB_COLORS.GREEN }}>
                    {paths[AUTH_API.INCLUDES].map(path => <List.Item key={path}>{path}</List.Item>)}
                  </List>
                  }
                  {paths.hasOwnProperty(AUTH_API.EXCLUDES) &&
                  <List style={{ color: SSB_COLORS.RED }}>
                    {paths[AUTH_API.EXCLUDES].map(path => <List.Item key={path}>{path}</List.Item>)}
                  </List>
                  }
                </Table.Cell>
                <Table.Cell
                  positive={maxValuation === AUTH_API.ENUMS.VALUATIONS[0]}
                  negative={maxValuation === AUTH_API.ENUMS.VALUATIONS[AUTH_API.ENUMS.VALUATIONS.length - 1]}
                  warning={AUTH_API.ENUMS.VALUATIONS.slice(
                    1, (AUTH_API.ENUMS.VALUATIONS.length - 1)).includes(maxValuation
                  )}
                >
                  {VALUATION[maxValuation] !== undefined ?
                    VALUATION[maxValuation][language] : VALUATION.UNRECOGNIZED[language]}
                </Table.Cell>
                {AUTH_API.ENUMS.STATES.map(state => <CheckedCell key={state} list={states} entry={state} />)}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      }
    </>
  )
}

export default RolesTable
