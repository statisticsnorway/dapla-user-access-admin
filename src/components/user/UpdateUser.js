import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Form, Header, Icon, Modal, Popup } from 'semantic-ui-react'
import { Button as SSBButton } from '@statisticsnorway/ssb-component-library'

import { ApiContext, LanguageContext } from '../../utilities'
import { API, SSB_COLORS, SSB_STYLE } from '../../configurations'
import { TEST_IDS, USER } from '../../enums'

function UpdateUser ({ isNew, refetch, roles, userId }) {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [updatedRoles, setUpdatedRoles] = useState(roles)
  const [updatedUserId, setUpdatedUserId] = useState(userId)
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
            isNew ?
              <Icon
                link
                size='huge'
                name='user plus'
                data-testid={TEST_IDS.NEW_USER}
                style={{ color: SSB_COLORS.GREEN }}
                onClick={() => setModalOpen(true)}
              />
              :
              <Icon.Group size='big' style={{ color: SSB_COLORS.BLUE }}>
                <Icon link name='user' onClick={() => setModalOpen(true)} data-testid={TEST_IDS.UPDATE_USER} />
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
        {isNew ?
          <>
            <Icon name='user plus' style={{ color: SSB_COLORS.GREEN }} />
            {USER.CREATE_USER[language]}
          </>
          :
          <>
            <Icon.Group size='large' style={{ marginRight: '0.2em', color: SSB_COLORS.BLUE }}>
              <Icon name='user' />
              <Icon corner name='edit' />
            </Icon.Group>
            {USER.UPDATE_USER[language]}
          </>
        }
      </Header>
      <Modal.Content style={SSB_STYLE}>
        <Form size='large'>
          <Form.Input
            required
            disabled={!isNew}
            value={updatedUserId}
            placeholder={USER.USER_ID[language]}
            onChange={(event, { value }) => setUpdatedUserId(value)}
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
          onClick={() => executePut({ data: { userId: updatedUserId, roles: roles } })}
        >
          {isNew ? USER.CREATE_USER[language] : USER.UPDATE_USER[language]}
        </SSBButton>
      </Modal.Content>
    </Modal>
  )
}

export default UpdateUser
