import { useContext } from 'react'
import { Accordion, List, Message } from 'semantic-ui-react'

import { LanguageContext } from '../../context/AppContext'
import { AUTH_API } from '../../configurations'
import { USERS } from '../../enums'

function UsersMetadata ({ users, filter, groups, roles }) {
  const { language } = useContext(LanguageContext)

  return (
    <Message size="large">
      <p>{`${USERS.NO_OF_USERS[language]}: `}
        <b>{`${users}${users === filter ? '' : ` (${filter})`}`}</b>
      </p>
      {groups[AUTH_API.NO_GROUP] !== undefined && groups[AUTH_API.NO_GROUP].length !== 0 &&
      <>
        <p>{`${USERS.USERS_NO_GROUP[language]}:`}</p>
        <List as="ol" animated size="tiny">
          {groups[AUTH_API.NO_GROUP][AUTH_API.USERS].map(user =>
            <List.Item key={user}>{user}</List.Item>
          )}
        </List>
      </>
      }
      {roles[AUTH_API.NO_ROLE] !== undefined && roles[AUTH_API.NO_ROLE].length !== 0 &&
      <>
        <p>{`${USERS.USERS_NO_ROLE[language]}:`}</p>
        <List as="ol" animated size="tiny">
          {roles[AUTH_API.NO_ROLE][AUTH_API.USERS].map(user =>
            <List.Item key={user}>{user}</List.Item>
          )}
        </List>
      </>
      }
      <Accordion
        defaultActiveIndex={-1}
        panels={[{
          key: 'users-per-group',
          title: {
            content: USERS.USERS_PER_GROUP[language],
            style: { opacity: '0.85' }
          },
          content: {
            content: (
              <List as="ol" animated size="tiny" style={{ marginBottom: '1rem' }}>
                {Object.keys(groups)
                  .sort((a, b) => (groups[a][AUTH_API.USERS].length < groups[b][AUTH_API.USERS].length) ? 1 : -1)
                  .map(group =>
                    <List.Item key={group}>{`${group} (${groups[group][AUTH_API.USERS].length})`}</List.Item>
                  )
                }
              </List>
            )
          }
        }]}
      />
      <Accordion
        defaultActiveIndex={-1}
        panels={[{
          key: 'users-per-role',
          title: {
            content: USERS.USERS_PER_ROLE[language],
            style: { opacity: '0.85' }
          },
          content: {
            content: (
              <List as="ol" animated size="tiny" style={{ marginBottom: '1rem' }}>
                {Object.keys(roles)
                  .filter(role => !role.startsWith('user.'))
                  .sort((a, b) => (roles[a][AUTH_API.USERS].length < roles[b][AUTH_API.USERS].length) ? 1 : -1)
                  .map(role => <List.Item key={role}>{`${role} (${roles[role][AUTH_API.USERS].length})`}</List.Item>)
                }
              </List>
            )
          }
        }]}
      />
    </Message>
  )
}

export default UsersMetadata
