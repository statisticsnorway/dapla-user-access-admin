import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { Icon, Table } from 'semantic-ui-react'

import { ListArrayTableCell } from '../common'
import { LanguageContext } from '../../context/AppContext'
import { APP, AUTH_API } from '../../configurations'
import { GROUPS, TEST_IDS } from '../../enums'

function GroupsTable ({ direction, handleSort, filteredGroups }) {
  const { language } = useContext(LanguageContext)

  return (
    <Table celled sortable fixed selectable compact size="large">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell sorted={direction} onClick={() => handleSort()} data-testid={TEST_IDS.TABLE_SORT}>
            <Icon name="users" />
            {GROUPS.GROUP_ID[language]}
          </Table.HeaderCell>
          <Table.HeaderCell>
            <Icon name="info circle" />
            {GROUPS.DESCRIPTION[language]}
          </Table.HeaderCell>
          <Table.HeaderCell>
            <Icon name="vcard" />
            {GROUPS.ROLES[language]}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {filteredGroups.map(group => {
          const groupId = group[AUTH_API.GROUP_OBJECT.STRING[0]]
          const description = group[AUTH_API.GROUP_OBJECT.STRING[1]]
          const roles = group[AUTH_API.GROUP_OBJECT.ARRAY]

          return (
            <Table.Row key={groupId}>
              <Table.Cell style={{ fontWeight: 'bold' }} selectable>
                <Link to={{ pathname: `${APP[1].route}/update`, state: { isNew: false, group: group } }}>
                  {groupId}
                </Link>
              </Table.Cell>
              <Table.Cell error={description === undefined || description === ''}>
                {description}
              </Table.Cell>
              <ListArrayTableCell array={roles} />
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default GroupsTable
