import { List, Table } from 'semantic-ui-react'

function ListArrayTableCell ({ array }) {
  return (
    <Table.Cell error={!Array.isArray(array) || (Array.isArray(array) && array.length === 0)}>
      {Array.isArray(array) &&
      <List>
        {array.map(element => <List.Item key={element}>{element}</List.Item>)}
      </List>
      }
    </Table.Cell>
  )
}

export default ListArrayTableCell
