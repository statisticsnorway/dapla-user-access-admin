import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Grid, Icon, Input, List, Loader, Table } from 'semantic-ui-react'
import { ErrorMessage, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { UpdateUser } from '../'
import { ApiContext, LanguageContext } from '../../context/AppContext'
import { DescriptionPopup, sortArrayOfObjects } from '../../utilities'
import { AUTH_API, LOCAL_STORAGE, ROUTING } from '../../configurations'
import { TEST_IDS, UI, USER } from '../../enums'
import { Link } from 'react-router-dom'

function UsersTable () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [users, setUsers] = useState([])
  const [direction, setDirection] = useState('ascending')

  const [{ data, loading, error }, refetch] = useAxios(`${authApi}${AUTH_API.GET_USERS}`)

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      setUsers(sortArrayOfObjects(data[AUTH_API.USERS], [AUTH_API.USER_OBJECT.STRING]))
    }
  }, [data, error, loading])

  const handleSort = () => {
    const newDirection = direction === 'ascending' ? 'descending' : 'ascending'

    setDirection(newDirection)
    setUsers(sortArrayOfObjects(data[AUTH_API.USERS], [AUTH_API.USER_OBJECT.STRING], newDirection))
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
          <ErrorMessage error={error} language={language} />
        </>
        :
        <Table celled sortable compact='very' size='large'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell sorted={direction} onClick={() => handleSort()} data-testid={TEST_IDS.TABLE_SORT}>
                {USER.USER_ID[language]}
              </Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell>{USER.GROUPS[language]}</Table.HeaderCell>
              <Table.HeaderCell>{USER.ROLES[language]}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map(({ groups, roles, userId }, index) =>
              <Table.Row key={userId}>
                <Table.Cell textAlign='center'>
                  <Link to={ROUTING.BASE}>
                    {DescriptionPopup(
                      <Icon
                        link
                        fitted
                        name='eye'
                        size='large'
                        style={{ color: SSB_COLORS.BLUE }}
                        onClick={() => {
                          localStorage.setItem(LOCAL_STORAGE.REMEMBER, 'true')
                          localStorage.setItem(LOCAL_STORAGE.USER_ID, userId)
                        }}
                      />,
                      USER.SET_USER[language]
                    )}
                  </Link>
                </Table.Cell>
                <Table.Cell style={{ fontWeight: 'bold' }}>{userId}</Table.Cell>
                <Table.Cell textAlign='center'>
                  <UpdateUser isNew={false} refetch={refetch} user={users[index]} />
                </Table.Cell>
                <Table.Cell>
                  <List>
                    {Array.isArray(groups) && groups.map(group => <List.Item key={group}>{group}</List.Item>)}
                  </List>
                </Table.Cell>
                <Table.Cell>
                  <List>
                    {Array.isArray(roles) && roles.map(role => <List.Item key={role}>{role}</List.Item>)}
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

export default UsersTable
