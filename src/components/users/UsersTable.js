import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { Icon, Table } from 'semantic-ui-react'

import { ListArrayTableCell } from '../common'
import { LanguageContext } from '../../context/AppContext'
import { APP, AUTH_API, UPDATE } from '../../configurations'
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
                <Link to={{ pathname: `${APP[0].route}${UPDATE}`, state: { isNew: false, user: user } }}>
                  {userId}
                </Link>
              </Table.Cell>
              <ListArrayTableCell array={groups} />
              <ListArrayTableCell array={roles} />
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default UsersTable
