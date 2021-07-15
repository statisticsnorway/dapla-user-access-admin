import { useContext } from 'react'
import { Button, Icon } from 'semantic-ui-react'

import { LanguageContext } from '../../context/AppContext'

function SaveUpdateButton ({ isNew, loading, handleUpdate, create, update }) {
  const { language } = useContext(LanguageContext)

  return (
    <Button
      animated
      size="large"
      primary={!isNew}
      positive={isNew}
      disabled={loading}
      onClick={() => handleUpdate()}
    >
      <Button.Content visible>
        {isNew ? create[language] : update[language]}
      </Button.Content>
      <Button.Content hidden>
        <Icon name={isNew ? 'plus' : 'save'} />
      </Button.Content>
    </Button>
  )
}

export default SaveUpdateButton
