import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Form, Header, Icon, Modal, Popup } from 'semantic-ui-react'
import { Button as SSBButton } from '@statisticsnorway/ssb-component-library'

import { ApiContext, LanguageContext } from '../../utilities'
import { API, SSB_COLORS, SSB_STYLE } from '../../configurations'
import { ROLE, TEST_IDS, UI } from '../../enums'

function UpdateRole ({ isNew, refetch, role }) {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [modalOpen, setModalOpen] = useState(false)
  const [roleId, setRoleId] = useState(isNew ? '' : role.roleId)
  const [states, setStates] = useState(isNew ? [] : role.states)
  const [privileges, setPrivileges] = useState(isNew ? [] : role.privileges)
  const [maxValuation, setMaxValuation] = useState(isNew ? '' : role.maxValuation)
  const [namespacePrefixes, setNamespacePrefixes] = useState(isNew ? [] : role.namespacePrefixes)
  const [namespacePrefixesOptions, setNamespacePrefixesOptions] = useState(isNew ? [] : role.namespacePrefixes
    .map(namespacePrefix => ({
      key: namespacePrefix,
      text: namespacePrefix,
      value: namespacePrefix
    }))
  )

  const [{ loading, error, response }, executePut] = useAxios(
    {
      url: `${authApi}${API.PUT_ROLE(roleId)}`,
      method: 'PUT'
    }, {
      manual: true
    }
  )

  useEffect(() => {
    if (!loading && response) {
      console.log(response)
    }
    if (!loading && error) {
      console.log(error.response)
    }
  }, [error, loading, response])

  return (
    <Modal
      closeIcon
      size='large'
      open={modalOpen}
      style={SSB_STYLE}
      closeOnEscape={false}
      closeOnDimmerClick={false}
      onClose={() => {
        setModalOpen(false)
        if (!isNew) {
          refetch()
        }
      }}
      trigger={
        <Popup
          basic
          flowing
          trigger={
            <Icon.Group size={isNew ? 'huge' : 'big'} style={{ color: SSB_COLORS[isNew ? 'GREEN' : 'BLUE'] }}>
              <Icon link name='users' onClick={() => setModalOpen(true)} data-testid={TEST_IDS.UPDATE_ROLE} />
              <Icon corner link name={isNew ? 'plus' : 'edit'} onClick={() => setModalOpen(true)} />
            </Icon.Group>
          }
        >
          <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
          Description
        </Popup>
      }
    >
      <Header as='h2' style={SSB_STYLE}>
        <Icon.Group size='big' style={{ marginRight: '0.2em', color: SSB_COLORS[isNew ? 'GREEN' : 'BLUE'] }}>
          <Icon name='users' />
          <Icon corner name={isNew ? 'plus' : 'edit'} />
        </Icon.Group>
        {isNew ? ROLE.CREATE_ROLE[language] : ROLE.UPDATE_ROLE[language]}
      </Header>
      <Modal.Content style={SSB_STYLE}>
        <Form size='large'>
          <Form.Input
            required
            value={roleId}
            disabled={!isNew}
            placeholder={ROLE.ROLE_ID[language]}
            onChange={(event, { value }) => setRoleId(value)}
            label={
              <label>
                <Popup basic flowing trigger={<span>{ROLE.ROLE_ID[language]}</span>}>
                  <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                  Description
                </Popup>
              </label>
            }
          />
          <Form.Dropdown
            multiple
            required
            selection
            value={privileges}
            placeholder={ROLE.PRIVILEGES[language]}
            onChange={(event, { value }) => setPrivileges(value)}
            options={API.ENUMS.PRIVILEGES.map(privilege => ({ key: privilege, text: privilege, value: privilege }))}
            label={
              <label>
                <Popup basic flowing trigger={<span>{ROLE.PRIVILEGES[language]}</span>}>
                  <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                  Description
                </Popup>
              </label>
            }
          />
          <Form.Dropdown
            search
            multiple
            required
            selection
            allowAdditions
            value={namespacePrefixes}
            additionLabel={`${UI.ADD[language]} `}
            placeholder={ROLE.NAMESPACE_PREFIXES[language]}
            noResultsMessage={UI.SEARCH_NO_RESULTS_CAN_ADD[language]}
            onChange={(event, { value }) => setNamespacePrefixes(value)}
            onAddItem={(event, { value }) => setNamespacePrefixesOptions(
              [{ key: value, text: value, value: value }, ...namespacePrefixesOptions]
            )}
            options={namespacePrefixes.map(namespacePrefix => ({
              key: namespacePrefix,
              text: namespacePrefix,
              value: namespacePrefix
            }))}
            label={
              <label>
                <Popup basic flowing trigger={<span>{ROLE.NAMESPACE_PREFIXES[language]}</span>}>
                  <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                  Description
                </Popup>
              </label>
            }
          />
          <Form.Dropdown
            required
            selection
            value={maxValuation}
            placeholder={ROLE.MAX_VALUATION[language]}
            options={API.ENUMS.VALUATIONS.map(state => ({ key: state, text: state, value: state }))}
            onChange={(event, { value }) => setMaxValuation(value)}
            label={
              <label>
                <Popup basic flowing trigger={<span>{ROLE.MAX_VALUATION[language]}</span>}>
                  <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                  Description
                </Popup>
              </label>
            }
          />
          <Form.Dropdown
            multiple
            required
            selection
            value={states}
            placeholder={ROLE.STATES[language]}
            options={API.ENUMS.STATES.map(state => ({ key: state, text: state, value: state }))}
            onChange={(event, { value }) => setStates(value)}
            label={
              <label>
                <Popup basic flowing trigger={<span>{ROLE.STATES[language]}</span>}>
                  <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                  Description
                </Popup>
              </label>
            }
          />
        </Form>
        <Divider hidden />
        <SSBButton
          primary
          disabled={loading}
          onClick={() => executePut({
            data: {
              roleId: roleId,
              states: states,
              privileges: privileges,
              maxValuation: maxValuation,
              namespacePrefixes: namespacePrefixes
            }
          })}
        >
          {isNew ? ROLE.CREATE_ROLE[language] : ROLE.UPDATE_ROLE[language]}
        </SSBButton>
      </Modal.Content>
    </Modal>
  )
}

export default UpdateRole
