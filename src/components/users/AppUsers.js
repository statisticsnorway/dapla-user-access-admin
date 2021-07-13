import useAxios from 'axios-hooks'
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { Button, Grid, Icon, Input, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import UsersTable from './UsersTable'
import UsersMetadata from './UsersMetadata'
import { ApiContext, LanguageContext } from '../../context/AppContext'
import { arrayReduceBy, sortArrayOfObjects } from '../../utilities'
import { APP, AUTH_API } from '../../configurations'
import { TEST_IDS, UI, USERS } from '../../enums'

function AppUsers () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState({})
  const [groups, setGroups] = useState({})
  const [filteredUsers, setFilteredUsers] = useState([])
  const [direction, setDirection] = useState('ascending')

  const [{ data, loading, error }, refetch] = useAxios(`${authApi}${AUTH_API.GET_USERS}`, { useCache: false })

  const handleSort = () => {
    const newDirection = direction === 'ascending' ? 'descending' : 'ascending'

    setDirection(newDirection)
    setUsers(sortArrayOfObjects(users, [AUTH_API.USER_OBJECT.STRING], newDirection))
  }

  const handleFilter = string => setFilteredUsers(users.filter(({ userId }) => userId.includes(string)))

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      const allUsers = sortArrayOfObjects(JSON.parse((JSON.stringify(data[AUTH_API.USERS]))), [AUTH_API.USER_OBJECT.STRING])

      setUsers(allUsers)
      setFilteredUsers(allUsers)
      setGroups(arrayReduceBy(
        data[AUTH_API.USERS],
        AUTH_API.USER_OBJECT.ARRAY[0],
        AUTH_API.USERS,
        AUTH_API.USER_OBJECT.STRING,
        AUTH_API.NO_GROUP
      ))
      setRoles(arrayReduceBy(
        data[AUTH_API.USERS],
        AUTH_API.USER_OBJECT.ARRAY[1],
        AUTH_API.USERS,
        AUTH_API.USER_OBJECT.STRING,
        AUTH_API.NO_ROLE
      ))
    }
  }, [data, error, loading])

  return (
    <Segment basic loading={loading}>
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {!loading && !error &&
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <Input
              size="large"
              icon="filter"
              placeholder={UI.FILTER_TABLE[language]}
              onChange={(e, { value }) => handleFilter(value)}
            />
          </Grid.Column>
          <Grid.Column textAlign="right" verticalAlign="middle">
            <Icon
              link
              size="large"
              color="blue"
              name="sync alternate"
              onClick={() => refetch()}
              data-testid={TEST_IDS.TABLE_REFRESH}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <UsersTable direction={direction} handleSort={handleSort} filteredUsers={filteredUsers} />
          </Grid.Column>
          <Grid.Column>
            <UsersMetadata users={users.length} filter={filteredUsers.length} groups={groups} roles={roles} />
            <Button
              positive
              animated
              as={Link}
              size="large"
              to={{ pathname: `${APP[0].route}/update`, state: { isNew: true } }}
            >
              <Button.Content visible>
                {USERS.CREATE_USER[language]}
              </Button.Content>
              <Button.Content hidden>
                <Icon name="add" />
              </Button.Content>
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      }
    </Segment>
  )
}

export default AppUsers