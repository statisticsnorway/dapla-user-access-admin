import useAxios from 'axios-hooks'
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { Button, Grid, Icon, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import GroupsTable from './GroupsTable'
import GroupsMetadata from './GroupsMetadata'
import { FilterRefreshRow } from '../common'
import { ApiContext, LanguageContext } from '../../context/AppContext'
import { arrayReduceBy, sortArrayOfObjects } from '../../utilities'
import { APP, ASC, AUTH_API, DESC, UPDATE } from '../../configurations'
import { GROUPS } from '../../enums'

function AppGroups () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [roles, setRoles] = useState({})
  const [groups, setGroups] = useState([])
  const [noDescription, setNoDescription] = useState([])
  const [direction, setDirection] = useState(ASC)
  const [filteredGroups, setFilteredGroups] = useState([])

  const [{ data, loading, error }, refetch] = useAxios(`${authApi}${AUTH_API.GET_GROUPS}`, { useCache: false })

  const handleSort = () => {
    const newDirection = direction === ASC ? DESC : ASC

    setDirection(newDirection)
    setGroups(sortArrayOfObjects(groups, [AUTH_API.GROUP_OBJECT.STRING[0]], newDirection))
  }

  const handleFilter = string => setFilteredGroups(groups.filter(({ groupId }) => groupId.includes(string)))

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      const allGroups = sortArrayOfObjects(JSON.parse((JSON.stringify(data[AUTH_API.GROUPS]))), [AUTH_API.GROUP_OBJECT.STRING[0]])

      setGroups(allGroups)
      setFilteredGroups(allGroups)
      setRoles(arrayReduceBy(
        data[AUTH_API.GROUPS],
        AUTH_API.GROUP_OBJECT.ARRAY,
        AUTH_API.GROUPS,
        AUTH_API.GROUP_OBJECT.STRING[0],
        AUTH_API.NO_ROLE
      ))
      setNoDescription(allGroups
        .filter(({ description }) => description === undefined || description === '')
        .map(({ groupId }) => groupId)
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
            <GroupsTable direction={direction} handleSort={handleSort} filteredGroups={filteredGroups} />
          </Grid.Column>
          <Grid.Column>
            <GroupsMetadata
              roles={roles}
              groups={groups.length}
              noDescription={noDescription}
              filter={filteredGroups.length}
            />
            <Button
              positive
              animated
              as={Link}
              size="large"
              to={{ pathname: `${APP[1].route}${UPDATE}`, state: { isNew: true } }}
            >
              <Button.Content visible>
                {GROUPS.CREATE_GROUP[language]}
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

export default AppGroups
