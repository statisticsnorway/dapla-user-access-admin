import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Form, Header, Icon, Modal, Popup } from 'semantic-ui-react'
import { Button as SSBButton } from '@statisticsnorway/ssb-component-library'

import { ApiContext, LanguageContext } from '../../utilities'
import { API, SSB_COLORS, SSB_STYLE } from '../../configurations'
import { TEST_IDS, UI, USER } from '../../enums'

function UpdateUser ({ isNew, refetch, roles, userId }) {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [modalOpen, setModalOpen] = useState(false)
  const [updatedRoles, setUpdatedRoles] = useState(roles)
  const [updatedUserId, setUpdatedUserId] = useState(userId)

  const [{ data: getData, loading: getLoading, error: getError }, refetchGet] = useAxios(`${authApi}${API.GET_ROLES}`)
  const [{ loading: putLoading, error: putError, response: putResponse }, executePut] = useAxios(
    {
      url: `${authApi}${API.PUT_USER(userId)}`,
      method: 'PUT'
    }, {
      manual: true
    }
  )

  useEffect(() => {
    if (!putLoading && putResponse) {
      console.log(putResponse)
    }
    if (!putLoading && putError) {
      console.log(putError.response)
    }
  }, [putError, putLoading, putResponse])

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
                size='big'
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
            search
            multiple
            required
            selection
            value={updatedRoles}
            placeholder={USER.ROLES[language]}
            noResultsMessage={UI.SEARCH_NO_RESULTS[language]}
            onChange={(event, { value }) => setUpdatedRoles(value)}
            options={!getLoading && !getError && getData !== undefined ? getData[API.ROLES].map(role => ({
              key: role.roleId,
              text: role.roleId,
              value: role.roleId
            })) : []}
            label={
              <label>
                <Popup basic flowing trigger={<span>{USER.ROLES[language]} </span>}>
                  <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
                  Description
                </Popup>
                <Popup basic flowing trigger={
                  <Icon
                    link
                    loading={getLoading}
                    name='sync alternate'
                    onClick={() => refetchGet()}
                    style={{ color: SSB_COLORS.BLUE }}
                  />
                }>
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
          disabled={putLoading}
          onClick={() => executePut({ data: { userId: updatedUserId, roles: updatedRoles } })}
        >
          {isNew ? USER.CREATE_USER[language] : USER.UPDATE_USER[language]}
        </SSBButton>
      </Modal.Content>
    </Modal>
  )
}

export default UpdateUser
