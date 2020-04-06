import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Grid, Input, List, Loader, Table } from 'semantic-ui-react'

import { ErrorMessage, UpdateUser } from '../'
import { ApiContext, LanguageContext, sortArrayOfObjects } from '../../utilities'
import { AUTH_API } from '../../configurations'
import { USER, TEST_IDS, UI } from '../../enums'

function UsersTable () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [users, setUsers] = useState([])
  const [direction, setDirection] = useState('descending')

  const [{ data, loading, error }, refetch] = useAxios(`${authApi}${AUTH_API.GET_USERS}`)

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      setUsers(sortArrayOfObjects(data[AUTH_API.USERS], [AUTH_API.USER_OBJECT.STRING]))
    }
  }, [data, error, loading])

  const handleSort = () => {
    setDirection(direction === 'ascending' ? 'descending' : 'ascending')
    setUsers(sortArrayOfObjects(data[AUTH_API.USERS], [AUTH_API.USER_OBJECT.STRING], direction))
  }

  const handleFilter = (string) => setUsers(data[AUTH_API.USERS].filter(({ userId }) => userId.includes(string)))

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
          <UpdateUser isNew={true} refetch={refetch} />
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
                {USER.USER_ID[language]}
              </Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell>{USER.GROUPS[language]}</Table.HeaderCell>
              <Table.HeaderCell>{USER.ROLES[language]}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map(({ userId, groups, roles }, index) =>
              <Table.Row key={userId}>
                <Table.Cell style={{ fontWeight: 'bold' }}>{userId}</Table.Cell>
                <Table.Cell textAlign='center'>
                  <UpdateUser isNew={false} refetch={refetch} user={users[index]} />
                </Table.Cell>
                <Table.Cell>
                  {groups &&
                  <List>
                    {groups.map(group => <List.Item key={group}>{group}</List.Item>)}
                  </List>
                  }
                </Table.Cell>
                <Table.Cell>
                  {roles &&
                  <List>
                    {roles.map(role => <List.Item key={role}>{role}</List.Item>)}
                  </List>
                  }
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
}
    </>
  )
}

export default UsersTable
