import { useContext } from 'react'
import { Grid } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../../context/AppContext'

function ResponseColumn ({ loading, response, error }) {
  const { language } = useContext(LanguageContext)

  return (
    <Grid.Column>
      {!loading && error &&
      <ErrorMessage error={error.response.statusText} title={error.response.status} language={language} />
      }
      {!loading && response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </Grid.Column>
  )
}

export default ResponseColumn
