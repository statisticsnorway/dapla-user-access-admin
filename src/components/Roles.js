import React, { useContext, useEffect, useState } from 'react'
import { Table, Icon, Segment, TextArea, Button } from 'semantic-ui-react'
import { ApiContext, LanguageContext } from '../utilities'
import { API, SSB_STYLE } from '../configurations'
import { DATASETSTATE } from '../enums/DATASETSTATE'
import { VALUATION } from '../enums/VALUATION'
import { PRIVILEGE } from '../enums/PRIVILEGE'
import { UI_ROLE } from '../enums/UI_ROLE'
import useAxios from 'axios-hooks'

function Roles() {
  const { authApi } = useContext(ApiContext)
  const [roles, setRoles] = useState([])
  const { language } = useContext(LanguageContext)
  const [{
    Loading: authLoading,
    error: authError,
    response: authResponse
  }] = useAxios(`${authApi}${API.GET_ALLROLES}`)

  useEffect(() => {
    console.log(authResponse, "authResponse useEffect")
    setRoles(authResponse ? authResponse.data.roles : [])
    console.log(roles, "roles useEffect")
  }, [authLoading, authError, authResponse])

  // function updateRoles() {
  //   console.log(authResponse, "authResponse updateRoles")
  //   setRoles(authResponse.data)
  //   console.log(roles, "roles updateRoles")
  // }


  function CheckedCell({object, listName, value}) {
    return (
    <Table.Cell>
      {object && object[listName] && object[listName].includes(value) && (
        <Icon name='checkmark' style={SSB_STYLE}/>
      )}
    </Table.Cell> )
  }

  return (
    <Segment>
      {/*<Button onClick={updateRoles} />*/}
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
        {roles && roles.map((role) => (
          <Table.Body>
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
          </Table.Body>
        ))}
      </Table>

    </Segment>

  )




}

export default Roles