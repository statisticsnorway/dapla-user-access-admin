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

  const [roles, setRoles] = useState([])
  const [userId, setUserId] = useState('')
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
      onClose={() => setModalOpen(false)}
      trigger={
        <Popup
          basic
          flowing
          trigger={
            <Icon
              link
              size='huge'
              name='user plus'
              style={{ color: SSB_COLORS.GREEN }}
              onClick={() => setModalOpen(true)}
            />
          }
        >
          <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
          Description
        </Popup>
      }
    >
      <Header as='h2' style={SSB_STYLE}>
        <Icon name='user plus' style={{ color: SSB_COLORS.GREEN }} />
        {USER.CREATE_USER[language]}
      </Header>
      <Modal.Content style={SSB_STYLE}>
        <Form size='large'>
          <Form.Input
            required
            value={userId}
            placeholder={USER.USER_ID[language]}
            onChange={(event, {value }) => setUserId(value)}
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
            value={roles}
            placeholder={USER.ROLES[language]}
            options={API.TEMP_ROLES.map(roleId => ({ key: roleId, text: roleId, value: roleId }))}
            onChange={(event, {value}) => setRoles(value)}
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
          {USER.CREATE_USER[language]}
        </SSBButton>
      </Modal.Content>
    </Modal>
  )
}

export default CreateUser
