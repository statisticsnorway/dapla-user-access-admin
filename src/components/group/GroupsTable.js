import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Grid, Input, List, Loader, Table } from 'semantic-ui-react'

import { ErrorMessage, UpdateGroup } from '../'
import { ApiContext, LanguageContext } from '../../utilities'
import { AUTH_API } from '../../configurations'
import { GROUP, TEST_IDS, UI } from '../../enums'

function GroupsTable () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [groups, setGroups] = useState([])
  const [direction, setDirection] = useState('descending')

  const [{ data, loading, error }, refetch] = useAxios(`${authApi}${AUTH_API.GET_GROUPS}`)

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      setGroups(data[AUTH_API.GROUPS].sort((a, b) =>
        a[AUTH_API.GROUP_OBJECT.STRING[0]].localeCompare(b[AUTH_API.GROUP_OBJECT.STRING[0]])
      ))
    }
  }, [data, error, loading])

  const handleSort = () => {
    setDirection(direction === 'ascending' ? 'descending' : 'ascending')

    if (direction === 'ascending') {
      setGroups(groups.sort((a, b) =>
        a[AUTH_API.GROUP_OBJECT.STRING[0]].localeCompare(b[AUTH_API.GROUP_OBJECT.STRING[0]])
      ))
    } else {
      setGroups(groups.sort((a, b) =>
        b[AUTH_API.GROUP_OBJECT.STRING[0]].localeCompare(a[AUTH_API.GROUP_OBJECT.STRING[0]])
      ))
    }
  }

  const handleFilter = (string) => setGroups(data[AUTH_API.GROUPS].filter(({ groupId }) => groupId.includes(string)))

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
        <Grid.Column textAlign='right'>
          <UpdateGroup isNew={true} refetch={refetch} />
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
                {GROUP.GROUP_ID[language]}
              </Table.HeaderCell>
              <Table.HeaderCell>{GROUP.DESCRIPTION[language]}</Table.HeaderCell>
              <Table.HeaderCell>{GROUP.ROLES[language]}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {groups.map(({ description, groupId, roles }) =>
              <Table.Row key={groupId}>
                <Table.Cell>{groupId}</Table.Cell>
                <Table.Cell>{description}</Table.Cell>
                <Table.Cell>
                  <List>
                    {roles.map(role => <List.Item key={role}>{role}</List.Item>)}
                  </List>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      }
    </>
  )
}

export default GroupsTable
