import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Form, Header, Icon, Modal, Popup } from 'semantic-ui-react'
import { Button as SSBButton } from '@statisticsnorway/ssb-component-library'

import { ApiContext, LanguageContext } from '../../utilities'
import { API, SSB_COLORS, SSB_STYLE } from '../../configurations'
import { ROLE, UI } from '../../enums'

function CreateRole () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [roleId, setRoleId] = useState('')
  const [states, setStates] = useState([])
  const [privileges, setPrivileges] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [maxValuation, setMaxValuation] = useState('')
  const [namespacePrefixes, setNamespacePrefixes] = useState([])
  const [namespacePrefixesOptions, setNamespacePrefixesOptions] = useState([])

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
      onClose={() => setModalOpen(false)}
      trigger={
        <Popup
          basic
          flowing
          trigger={
            <Icon.Group size='huge' style={{ color: SSB_COLORS.GREEN }}>
              <Icon link name='users' onClick={() => setModalOpen(true)} />
              <Icon corner link name='plus' onClick={() => setModalOpen(true)} />
            </Icon.Group>
          }
        >
          <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
          Description
        </Popup>
      }
    >
      <Header as='h2' style={SSB_STYLE}>
        <Icon.Group size='big' style={{ color: SSB_COLORS.GREEN, marginRight: '0.2em' }}>
          <Icon name='users' />
          <Icon corner name='plus' />
        </Icon.Group>
        {ROLE.CREATE_ROLE[language]}
      </Header>
      <Modal.Content style={SSB_STYLE}>
        <Form size='large'>
          <Form.Input
            required
            value={roleId}
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
            required
            multiple
            selection
            value={privileges}
            placeholder={ROLE.PRIVILEGES[language]}
            options={API.PRIVILEGES.map(privilege => ({ key: privilege, text: privilege, value: privilege }))}
            onChange={(event, { value }) => setPrivileges(value)}
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
            options={API.VALUATIONS.map(state => ({ key: state, text: state, value: state }))}
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
            required
            multiple
            selection
            value={states}
            placeholder={ROLE.STATES[language]}
            options={API.STATES.map(state => ({ key: state, text: state, value: state }))}
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
              privileges: privileges,
              namespacePrefixes: namespacePrefixes,
              maxValuation: maxValuation,
              states: states
            }
          })}
        >
          {ROLE.CREATE_ROLE[language]}
        </SSBButton>
      </Modal.Content>
    </Modal>
  )
}

export default CreateRole
