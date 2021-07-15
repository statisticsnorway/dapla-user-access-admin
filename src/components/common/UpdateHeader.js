import { useContext } from 'react'
import { Header, Icon } from 'semantic-ui-react'

import { LanguageContext } from '../../context/AppContext'

function UpdateHeader ({ logo, isNew, id, create, update }) {
  const { language } = useContext(LanguageContext)

  return (
    <Header size="large">
      <Icon.Group size="large" style={{ marginRight: '0.5rem', marginTop: '0.8rem' }}>
        <Icon name={logo} color={isNew ? 'green' : 'blue'} />
        <Icon corner="top right" name={isNew ? 'plus' : 'pencil'} color={isNew ? 'green' : 'blue'} />
      </Icon.Group>
      <Header.Content>
        {isNew ? create[language] : id}
        {!isNew && <Header.Subheader>{update[language]}</Header.Subheader>}
      </Header.Content>
    </Header>
  )
}

export default UpdateHeader
