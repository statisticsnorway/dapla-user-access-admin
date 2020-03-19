import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Form, Header, Icon, Modal, Popup } from 'semantic-ui-react'
import { Button as SSBButton } from '@statisticsnorway/ssb-component-library'

import { ApiContext, LanguageContext } from '../../utilities'
import { API, SSB_COLORS, SSB_STYLE } from '../../configurations'
import { USER } from '../../enums'

function CreateUser () {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [modalOpen, setModalOpen] = useState(false)
  const [userId, setUserId] = useState('')
  const [roles, setRoles] = useState([])

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
            <Icon
              link
              onClick={() => setModalOpen(true)}
              size='big'
              name='user plus'
              style={{ color: SSB_COLORS.GREEN }}
            />
          }
        >
          <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
          Description
        </Popup>
      }
      open={modalOpen}
      onClose={() => setModalOpen(false)}
    >
      <Header as='h2' style={SSB_STYLE}>
        <Icon name='user plus' style={{ color: SSB_COLORS.GREEN }} />
        {USER.CREATE_USER[language]}
      </Header>
      <Modal.Content style={SSB_STYLE}>
        <Form size='large'>
          <Form.Input
            required
            label={
              <label>
                <Popup basic flowing trigger={<span>{USER.USER_ID[language]}</span>}>
                  <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                  Description
                </Popup>
              </label>
            }
            placeholder={USER.USER_ID[language]}
            onChange={(event, data) => setUserId(data.value)}
          />
          <Form.Dropdown
            required
            label={
              <label>
                <Popup basic flowing trigger={<span>{USER.ROLES[language]}</span>}>
                  <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                  Description
                </Popup>
              </label>
            }
            placeholder={USER.ROLES[language]}
            multiple
            selection
            options={API.TEMP_ROLES.map(roleId => ({ key: roleId, text: roleId, value: roleId }))}
            onChange={(event, data) => setRoles(data.value)}
            value={roles}
          />
        </Form>
        <Divider hidden />
        <SSBButton
          primary
          disabled={loading}
          onClick={() => executePut({ data: { userId: userId, roles: roles } })}
        >
          {USER.CREATE_USER[language]}
        </SSBButton>
      </Modal.Content>
    </Modal>
  )
}

export default CreateUser
