import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { Icon, List, Table } from 'semantic-ui-react'

import { LanguageContext } from '../../context/AppContext'
import { APP, AUTH_API } from '../../configurations'
import { TEST_IDS, USERS } from '../../enums'

function UsersTable ({ direction, handleSort, filteredUsers }) {
  const { language } = useContext(LanguageContext)

  return (
    <Table celled sortable fixed selectable compact size="large">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell sorted={direction} onClick={() => handleSort()} data-testid={TEST_IDS.TABLE_SORT}>
            <Icon name="user" />
            {USERS.USER_ID[language]}
          </Table.HeaderCell>
          <Table.HeaderCell>
            <Icon name="users" />
            {USERS.GROUPS[language]}
          </Table.HeaderCell>
          <Table.HeaderCell>
            <Icon name="vcard" />
            {USERS.ROLES[language]}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {filteredUsers.map(user => {
          const userId = user[AUTH_API.USER_OBJECT.STRING]
          const roles = user[AUTH_API.USER_OBJECT.ARRAY[1]]
          const groups = user[AUTH_API.USER_OBJECT.ARRAY[0]]

          return (
            <Table.Row key={userId}>
              <Table.Cell style={{ fontWeight: 'bold' }} selectable>
                <Link to={{ pathname: `${APP[0].route}/update`, state: { isNew: false, user: user } }}>
                  {userId}
                </Link>
              </Table.Cell>
              <Table.Cell error={!Array.isArray(groups) || (Array.isArray(groups) && groups.length === 0)}>
                {Array.isArray(groups) &&
                <List>
                  {groups.map(group => <List.Item key={group}>{group}</List.Item>)}
                </List>
                }
              </Table.Cell>
              <Table.Cell error={!Array.isArray(roles) || (Array.isArray(roles) && roles.length === 0)}>
                {Array.isArray(roles) &&
                <List>
                  {roles.map(role => <List.Item key={role}>{role}</List.Item>)}
                </List>
                }
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default UsersTable
