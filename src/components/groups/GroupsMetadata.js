import { useContext } from 'react'
import { Accordion, List, Message } from 'semantic-ui-react'

import { LanguageContext } from '../../context/AppContext'
import { AUTH_API } from '../../configurations'
import { GROUPS } from '../../enums'

function GroupsMetadata ({ groups, filter, noDescription, roles }) {
  const { language } = useContext(LanguageContext)

  return (
    <Message size="large">
      <p>{`${GROUPS.NO_OF_GROUPS[language]}: `}
        <b>{`${groups}${groups === filter ? '' : ` (${filter})`}`}</b>
      </p>
      {noDescription.length !== 0 &&
      <>
        <p>{`${GROUPS.GROUP_NO_DESCRIPTION[language]}:`}</p>
        <List as="ol" animated size="tiny">
          {noDescription.map(group =>
            <List.Item key={group}>{group}</List.Item>
          )}
        </List>
      </>
      }
      {roles[AUTH_API.NO_ROLE] !== undefined && roles[AUTH_API.NO_ROLE].length !== 0 &&
      <>
        <p>{`${GROUPS.GROUP_NO_ROLE[language]}:`}</p>
        <List as="ol" animated size="tiny">
          {roles[AUTH_API.NO_ROLE][AUTH_API.GROUPS].map(group =>
            <List.Item key={group}>{group}</List.Item>
          )}
        </List>
      </>
      }
      <Accordion
        defaultActiveIndex={-1}
        panels={[{
          key: 'groups-per-role',
          title: {
            content: GROUPS.GROUPS_PER_ROLE[language],
            style: { opacity: '0.85' }
          },
          content: {
            content: (
              <List as="ol" animated size="tiny" style={{ marginBottom: '1rem' }}>
                {Object.keys(roles)
                  .sort((a, b) => (roles[a][AUTH_API.GROUPS].length < roles[b][AUTH_API.GROUPS].length) ? 1 : -1)
                  .map(role => <List.Item key={role}>{`${role} (${roles[role][AUTH_API.GROUPS].length})`}</List.Item>)
                }
              </List>
            )
          }
        }]}
      />
    </Message>
  )
}

export default GroupsMetadata
