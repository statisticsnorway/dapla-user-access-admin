import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Form, Header, Icon, Modal, Popup } from 'semantic-ui-react'
import { Button as SSBButton } from '@statisticsnorway/ssb-component-library'

import { ApiContext } from '../../utilities'
import { API, SSB_COLORS, SSB_STYLE } from '../../configurations'

function UpdateUser ({ userId, roles, refetch }) {
  const { authApi } = useContext(ApiContext)

  const [modalOpen, setModalOpen] = useState(false)
  const [updatedRoles, setUpdatedRoles] = useState(roles)

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
      closeOnDimmerClick={false}
      closeOnEscape={false}
      style={SSB_STYLE}
      size='large'
      trigger={
        <Popup
          basic
          flowing
          trigger={
            <Icon.Group size='big'>
              <Icon link onClick={() => setModalOpen(true)} name='user' style={{ color: SSB_COLORS.BLUE }} />
              <Icon corner link name='edit' onClick={() => setModalOpen(true)} style={{ color: SSB_COLORS.BLUE }} />
            </Icon.Group>
          }
        >
          <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
          Description
        </Popup>
      }
      open={modalOpen}
      onClose={() => {
        refetch()
        setModalOpen(false)
      }}
    >
      <Header as='h2' style={SSB_STYLE}>
        <Icon.Group size='large' style={{ marginRight: '0.2em' }}>
          <Icon name='user' style={{ color: SSB_COLORS.BLUE }} />
          <Icon corner name='edit' style={{ color: SSB_COLORS.BLUE }} />
        </Icon.Group>
        Update user
      </Header>
      <Modal.Content style={SSB_STYLE}>
        <Form size='large'>
          <Form.Input
            disabled
            required
            label={
              <label>
                <Popup basic flowing trigger={<span>UserId</span>}>
                  <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                  Description
                </Popup>
              </label>
            }
            placeholder='UserId'
            value={userId}
          />
          <Form.Dropdown
            required
            label={
              <label>
                <Popup basic flowing trigger={<span>Roles</span>}>
                  <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                  Description
                </Popup>
              </label>
            }
            placeholder='Roles'
            multiple
            selection
            options={API.TEMP_ROLES.map(roleId => ({ key: roleId, text: roleId, value: roleId }))}
            onChange={(event, data) => setUpdatedRoles(data.value)}
            value={updatedRoles}
          />
        </Form>
        <Divider hidden />
        <SSBButton
          primary
          disabled={loading}
          onClick={() => executePut({ data: { userId: userId, roles: roles } })}
        >
          Update user
        </SSBButton>
      </Modal.Content>
    </Modal>
  )
}

export default UpdateUser
