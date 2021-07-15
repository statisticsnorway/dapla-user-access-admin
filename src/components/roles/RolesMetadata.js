import { useContext } from 'react'
import { Accordion, List, Message } from 'semantic-ui-react'

import { LanguageContext } from '../../context/AppContext'
import { ROLES, UI } from '../../enums'

function RolesMetadata ({ roles, filter, noDescription }) {
  const { language } = useContext(LanguageContext)

  return (
    <Message size="large">
      <p>{`${ROLES.NO_OF_ROLES[language]}: `}
        <b>{roles}{roles !== filter && ` (${filter} ${UI.AFTER_FILTER[language]})`}</b>
      </p>
      {noDescription.length !== 0 &&
      <Accordion
        defaultActiveIndex={-1}
        panels={[{
          key: 'role-no-description',
          title: {
            content: ROLES.ROLE_NO_DESCRIPTION[language],
            style: { opacity: '0.85' }
          },
          content: {
            content: (
              <List as="ol" animated size="tiny" style={{ marginBottom: '1rem' }}>
                {noDescription.map(role => <List.Item key={role}>{role}</List.Item>)}
              </List>
            )
          }
        }]}
      />
      }
    </Message>
  )
}

export default RolesMetadata
