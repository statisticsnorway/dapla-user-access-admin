import { useContext } from 'react'
import { Grid, Icon, Input } from 'semantic-ui-react'

import { LanguageContext } from '../../context/AppContext'
import { TEST_IDS, UI } from '../../enums'

function FilterRefreshRow ({ handleFilter, refetch }) {
  const { language } = useContext(LanguageContext)

  return (
    <Grid.Row>
      <Grid.Column>
        <Input
          size="large"
          icon="filter"
          placeholder={UI.FILTER_TABLE[language]}
          onChange={(e, { value }) => handleFilter(value)}
        />
      </Grid.Column>
      <Grid.Column textAlign="right" verticalAlign="middle">
        <Icon
          link
          size="large"
          color="blue"
          name="sync alternate"
          onClick={() => refetch()}
          data-testid={TEST_IDS.TABLE_REFRESH}
        />
      </Grid.Column>
    </Grid.Row>
  )
}

export default FilterRefreshRow
