import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Icon, List, Table } from 'semantic-ui-react'

import { LanguageContext } from '../../context/AppContext'
import { APP, AUTH_API, checkIncludesExcludes, includesExcludesTableLayout, UPDATE } from '../../configurations'
import { DATASET_STATE, PRIVILEGE, ROLES, TEST_IDS, VALUATION } from '../../enums'

function RolesTable ({ direction, simpleView, handleSort, filteredRoles }) {
  const { language } = useContext(LanguageContext)

  return (
    <Table celled sortable selectable compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell sorted={direction} onClick={() => handleSort()} data-testid={TEST_IDS.TABLE_SORT}>
            <Icon name="vcard" />
            {ROLES.ROLE_ID[language]}
          </Table.HeaderCell>
          <Table.HeaderCell>
            <Icon name="info circle" />
            {ROLES.DESCRIPTION[language]}
          </Table.HeaderCell>
          <Table.HeaderCell>
            <Icon name="folder open" />
            {ROLES.PATHS[language]}
          </Table.HeaderCell>
          <Table.HeaderCell>
            {ROLES.PRIVILEGES[language]}
            <br />
            <span style={{ fontWeight: 'normal', fontSize: 'small' }}>
              {` (${Object.keys(PRIVILEGE).map(privilege => PRIVILEGE[privilege][language]).join(', ')})`}
            </span>
          </Table.HeaderCell>
          <Table.HeaderCell>
            {ROLES.STATES[language]}
            <br />
            <span style={{ fontWeight: 'normal', fontSize: 'small' }}>
            {` (${Object.keys(DATASET_STATE).map(state => DATASET_STATE[state][language]).join(', ')})`}
            </span>
          </Table.HeaderCell>
          <Table.HeaderCell>
            {ROLES.MAX_VALUATION[language]}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {filteredRoles.map(role => {
          const { roleId, description, paths, privileges, states, maxValuation } = role
          const statesList = checkIncludesExcludes(states, DATASET_STATE)
          const privilegesList = checkIncludesExcludes(privileges, PRIVILEGE)

          return (
            <Table.Row key={roleId}>
              <Table.Cell style={{ fontWeight: 'bold', fontSize: 'small' }} selectable>
                <Link to={{ pathname: `${APP[2].route}${UPDATE}`, state: { isNew: false, role: role } }}>
                  {roleId}
                </Link>
              </Table.Cell>
              <Table.Cell error={description === undefined || description === ''} style={{ fontSize: 'smaller' }}>
                {description}
              </Table.Cell>
              <Table.Cell>
                {paths.hasOwnProperty(AUTH_API.INCLUDES) &&
                <List size="tiny">
                  {paths[AUTH_API.INCLUDES].map(path =>
                    <List.Item
                      key={path}
                      content={path}
                      icon={{ name: 'folder open', color: 'green' }}
                    />
                  )}
                </List>
                }
                {paths.hasOwnProperty(AUTH_API.EXCLUDES) &&
                <List size="tiny">
                  {paths[AUTH_API.EXCLUDES].map(path =>
                    <List.Item
                      key={path}
                      content={path}
                      icon={{ name: 'folder', color: 'red' }}
                    />
                  )}
                </List>
                }
              </Table.Cell>
              {includesExcludesTableLayout(simpleView, privilegesList, PRIVILEGE, language)}
              {includesExcludesTableLayout(simpleView, statesList, DATASET_STATE, language)}
              <Table.Cell>
                {VALUATION[maxValuation] !== undefined ?
                  VALUATION[maxValuation][language] : VALUATION.UNRECOGNIZED[language]}
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default RolesTable
