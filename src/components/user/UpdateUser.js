import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Form, Header, Icon, Modal, Popup } from 'semantic-ui-react'
import { Button as SSBButton } from '@statisticsnorway/ssb-component-library'

import { ApiContext, LanguageContext } from '../../utilities'
import { API, SSB_COLORS, SSB_STYLE } from '../../configurations'
import { USER } from '../../enums'

function UpdateUser ({ userId, roles, refetch }) {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [updatedRoles, setUpdatedRoles] = useState(roles)
  const [modalOpen, setModalOpen] = useState(false)

  const [{ loading, error, response }, executePut] = useAxios(
    {
      url: `${authApi}${API.PUT_USER(userId)}`,
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
        refetch()
        setModalOpen(false)
      }}
      trigger={
        <Popup
          basic
          flowing
          trigger={
            <Icon.Group size='big' style={{ color: SSB_COLORS.BLUE }}>
              <Icon link name='user' onClick={() => setModalOpen(true)} />
              <Icon corner link name='edit' onClick={() => setModalOpen(true)} />
            </Icon.Group>
          }
        >
          <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
          Description
        </Popup>
      }
    >
      <Header as='h2' style={SSB_STYLE}>
        <Icon.Group size='large' style={{ marginRight: '0.2em' }}>
          <Icon name='user' style={{ color: SSB_COLORS.BLUE }} />
          <Icon corner name='edit' style={{ color: SSB_COLORS.BLUE }} />
        </Icon.Group>
        {USER.UPDATE_USER[language]}
      </Header>
      <Modal.Content style={SSB_STYLE}>
        <Form size='large'>
          <Form.Input
            disabled
            required
            value={userId}
            placeholder={USER.USER_ID[language]}
            label={
              <label>
                <Popup basic flowing trigger={<span>{USER.USER_ID[language]}</span>}>
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
            value={updatedRoles}
            placeholder={USER.ROLES[language]}
            options={API.TEMP_ROLES.map(roleId => ({ key: roleId, text: roleId, value: roleId }))}
            onChange={(event, { value }) => setUpdatedRoles(value)}
            label={
              <label>
                <Popup basic flowing trigger={<span>{USER.ROLES[language]}</span>}>
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
          onClick={() => executePut({ data: { userId: userId, roles: roles } })}
        >
          {USER.UPDATE_USER[language]}
        </SSBButton>
      </Modal.Content>
    </Modal>
  )
}

export default UpdateUser
