import React, { useContext, useState } from 'react'
import { Table, Icon } from 'semantic-ui-react'
import { LanguageContext } from '../utilities'
import allRoles from '../allroles'
import { SSB_STYLE } from '../configurations'
import { DATASETSTATE } from '../enums/DATASETSTATE'
import { VALUATION } from '../enums/VALUATION'
import { PRIVILEGE } from '../enums/PRIVILEGE'
import { UI_ROLE } from '../enums/UI_ROLE'

function Roles() {
  const { language } = useContext(LanguageContext)

  function CheckedCell({object, listName, value}) {
    return (
    <Table.Cell>
      {object && object[listName] && object[listName].includes(value) && (
        <Icon name='checkmark' style={SSB_STYLE}/>
      )}
    </Table.Cell> )
  }

  return (
    <Table collapsing compact celled definition style={SSB_STYLE}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{UI_ROLE.ROLEID[language]}</Table.HeaderCell>
          <Table.HeaderCell>{PRIVILEGE.CREATE[language]}</Table.HeaderCell>
          <Table.HeaderCell>{PRIVILEGE.READ[language]}</Table.HeaderCell>
          <Table.HeaderCell>{PRIVILEGE.UPDATE[language]}</Table.HeaderCell>
          <Table.HeaderCell>{PRIVILEGE.DELETE[language]}</Table.HeaderCell>
          <Table.HeaderCell>{UI_ROLE.NAMESPACEPREFIX[language]}</Table.HeaderCell>
          <Table.HeaderCell>{UI_ROLE.MAXVALUATION[language]}</Table.HeaderCell>
          <Table.HeaderCell>{DATASETSTATE.RAW[language]}</Table.HeaderCell>
          <Table.HeaderCell>{DATASETSTATE.INPUT[language]}</Table.HeaderCell>
          <Table.HeaderCell>{DATASETSTATE.PROCESSED[language]}</Table.HeaderCell>
          <Table.HeaderCell>{DATASETSTATE.PRODUCT[language]}</Table.HeaderCell>
          <Table.HeaderCell>{DATASETSTATE.OTHER[language]}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      {allRoles.roles.map((role) => (
        <Table.Row key={role.roleId}>
          <Table.Cell>{role.roleId}</Table.Cell>
          <CheckedCell object={role} listName={'privileges'} value={'CREATE'}/>
          <CheckedCell object={role} listName={'privileges'} value={'READ'}/>
          <CheckedCell object={role} listName={'privileges'} value={'UPDATE'}/>
          <CheckedCell object={role} listName={'privileges'} value={'DELETE'}/>
          <Table.Cell>{role.namespacePrefixes}</Table.Cell>
          <Table.Cell>{VALUATION[role.maxValuation][language]}</Table.Cell>
          <CheckedCell object={role} listName={'states'} value={'RAW'}/>
          <CheckedCell object={role} listName={'states'} value={'INPUT'}/>
          <CheckedCell object={role} listName={'states'} value={'PROCESSED'}/>
          <CheckedCell object={role} listName={'states'} value={'PRODUCT'}/>
          <CheckedCell object={role} listName={'states'} value={'OTHER'}/>
        </Table.Row>
      ))}
    </Table>

  )




}

export default Roles