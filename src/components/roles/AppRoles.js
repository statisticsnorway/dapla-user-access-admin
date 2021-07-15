import useAxios from 'axios-hooks'
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { Button, Checkbox, Divider, Grid, Icon, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import RolesMetadata from './RolesMetadata'
import RolesTable from './RolesTable'
import { FilterRefreshRow } from '../common'
import { ApiContext, LanguageContext } from '../../context/AppContext'
import { APP, ASC, AUTH_API, DESC, UPDATE } from '../../configurations'
import { sortArrayOfObjects } from '../../utilities'
import { ROLES, TEST_IDS } from '../../enums'

function AppRoles () {
  const { authApi, simpleRoleView, setSimpleRoleView } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [roles, setRoles] = useState([])
  const [filterUserRoles, setFilterUserRoles] = useState(false)
  const [filteredRoles, setFilteredRoles] = useState([])
  const [noDescription, setNoDescription] = useState([])
  const [direction, setDirection] = useState(ASC)

  const [{ data, loading, error }, refetch] = useAxios(`${authApi}${AUTH_API.GET_ROLES}`, { useCache: false })

  const handleFilterUserRoles = filter => {
    if (filter) {
      const filteredUserRoles = sortArrayOfObjects(
        JSON.parse((JSON.stringify(data[AUTH_API.ROLES])))
          .filter(role => !role[AUTH_API.ROLE_OBJECT.STRING[0]].startsWith('user.')),
        [AUTH_API.ROLE_OBJECT.STRING[0]],
        direction
      )

      setFilterUserRoles(true)
      setRoles(filteredUserRoles)
      setFilteredRoles(filteredUserRoles)
      setNoDescription(filteredUserRoles
        .filter(({ description }) => description === undefined || description === '')
        .map(({ roleId }) => roleId)
      )
    } else {
      const allRoles = sortArrayOfObjects(
        JSON.parse((JSON.stringify(data[AUTH_API.ROLES]))),
        [AUTH_API.ROLE_OBJECT.STRING[0]],
        direction
      )

      setRoles(allRoles)
      setFilterUserRoles(false)
      setFilteredRoles(allRoles)
      setNoDescription(allRoles
        .filter(({ description }) => description === undefined || description === '')
        .map(({ roleId }) => roleId)
      )
    }
  }

  const handleSort = () => {
    const newDirection = direction === ASC ? DESC : ASC

    setDirection(newDirection)
    setRoles(sortArrayOfObjects(roles, [AUTH_API.ROLE_OBJECT.STRING[0]], newDirection))
  }

  const handleFilter = string => setFilteredRoles(roles.filter(({ roleId }) => roleId.includes(string)))

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      const allRoles = sortArrayOfObjects(JSON.parse((JSON.stringify(data[AUTH_API.ROLES]))), [AUTH_API.ROLE_OBJECT.STRING[0]])

      setRoles(allRoles)
      setFilterUserRoles(false)
      setFilteredRoles(allRoles)
      setNoDescription(allRoles
        .filter(({ description }) => description === undefined || description === '')
        .map(({ roleId }) => roleId)
      )
    }
  }, [data, error, loading])

  return (
    <Segment basic loading={loading}>
      {!loading && error && <ErrorMessage error={error} language={language} />}
      {!loading && !error &&
      <Grid columns="equal">
        <FilterRefreshRow handleFilter={handleFilter} refetch={refetch} />
        <Grid.Row>
          <Grid.Column>
            <RolesMetadata roles={roles.length} filter={filteredRoles.length} noDescription={noDescription} />
          </Grid.Column>
          <Grid.Column>
            <Button
              positive
              animated
              as={Link}
              size="large"
              to={{ pathname: `${APP[2].route}${UPDATE}`, state: { isNew: true } }}
            >
              <Button.Content visible>
                {ROLES.CREATE_ROLE[language]}
              </Button.Content>
              <Button.Content hidden>
                <Icon name="add" />
              </Button.Content>
            </Button>
            <Divider hidden />
            <Checkbox
              toggle
              checked={simpleRoleView}
              label={ROLES.SIMPLE_VIEW[language]}
              data-testid={TEST_IDS.SIMPLE_ROLES_VIEW_TOGGLE}
              onChange={() => {
                localStorage.setItem('simpleView', !simpleRoleView ? 'true' : 'false')
                setSimpleRoleView(!simpleRoleView)
              }}
            />
            <Divider hidden />
            <Checkbox
              toggle
              checked={filterUserRoles}
              label={ROLES.FILTER_USER_ROLES[language]}
              data-testid={TEST_IDS.TABLE_FILTER_USER_ROLES_TOGGLE}
              onChange={() => handleFilterUserRoles(!filterUserRoles)}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <RolesTable
              direction={direction}
              handleSort={handleSort}
              simpleView={simpleRoleView}
              filteredRoles={filteredRoles}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      }
    </Segment>
  )
}

export default AppRoles
