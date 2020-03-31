import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Form, Header, Icon, Modal, Popup } from 'semantic-ui-react'
import { Button as SSBButton } from '@statisticsnorway/ssb-component-library'

import { ErrorMessage } from '../'
import { ApiContext, DescriptionPopup, LanguageContext } from '../../utilities'
import { AUTH_API, SSB_COLORS, SSB_STYLE } from '../../configurations'
import { TEST_IDS, UI, USER } from '../../enums'

function UpdateUser ({ isNew, refetch, user }) {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [modalOpen, setModalOpen] = useState(false)
  const [updatedUserId, setUpdatedUserId] = useState(isNew ? '' : user[AUTH_API.USER_OBJECT.STRING])
  const [updatedRoles, setUpdatedRoles] = useState(isNew ? [] : user[AUTH_API.USER_OBJECT.ARRAY[1]])
  const [updatedGroups, setUpdatedGroups] = useState(isNew ? [] : user[AUTH_API.USER_OBJECT.ARRAY[0]])

  const [{ data: getRolesData, loading: getRolesLoading, error: getRolesError }, refetchRolesGet] =
    useAxios(`${authApi}${AUTH_API.GET_ROLES}`, { manual: true })
  const [{ data: getGroupsData, loading: getGroupsLoading, error: getGroupsError }, refetchGroupsGet] =
    useAxios(`${authApi}${AUTH_API.GET_GROUPS}`, { manual: true })
  const [{ loading: putLoading, error: putError, response: putResponse }, executePut] =
    useAxios({ url: `${authApi}${AUTH_API.PUT_USER(updatedUserId)}`, method: 'PUT' }, { manual: true })

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
      onMount={() => {
        refetchRolesGet()
        refetchGroupsGet()
      }}
      onClose={() => {
        setModalOpen(false)
        if (!isNew) {
          refetch()
        }
      }}
      trigger={DescriptionPopup(
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
          </Icon.Group>,
        'left center'
      )}
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
            label={<label>{DescriptionPopup(<span>{USER.USER_ID[language]}</span>)}</label>}
            onChange={(event, { value }) => setUpdatedUserId(value)}
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
            options={!getRolesLoading && !getRolesError && getRolesData !== undefined ?
              getRolesData[AUTH_API.ROLES].map(({ roleId }) => ({
                key: roleId,
                text: roleId,
                value: roleId
              }))
              : []}
            label={
              <label>
                {DescriptionPopup(<span>{USER.ROLES[language]} </span>)}
                {DescriptionPopup(
                  <Icon
                    link
                    name='sync alternate'
                    loading={getRolesLoading}
                    onClick={() => refetchRolesGet()}
                    style={{ color: SSB_COLORS.BLUE }}
                  />
                )}
                {getRolesError &&
                <Popup
                  basic
                  flowing
                  trigger={<Icon name='exclamation triangle' style={{ color: SSB_COLORS.YELLOW }} />}
                >
                  <ErrorMessage error={getRolesError} title={USER.ROLES_FETCH_ERROR[language]} />
                </Popup>
                }
              </label>
            }
          />
          <Form.Dropdown
            search
            multiple
            required
            selection
            value={updatedGroups}
            placeholder={USER.GROUPS[language]}
            noResultsMessage={UI.SEARCH_NO_RESULTS[language]}
            onChange={(event, { value }) => setUpdatedGroups(value)}
            options={!getGroupsLoading && !getGroupsError && getGroupsData !== undefined ?
              getGroupsData[AUTH_API.GROUPS].map(({ groupId }) => ({
                key: groupId,
                text: groupId,
                value: groupId
              }))
              : []}
            label={
              <label>
                {DescriptionPopup(<span>{USER.GROUPS[language]} </span>)}
                {DescriptionPopup(
                  <Icon
                    link
                    loading={getGroupsLoading}
                    name='sync alternate'
                    onClick={() => refetchGroupsGet()}
                    style={{ color: SSB_COLORS.BLUE }}
                  />
                )}
                {getGroupsError &&
                <Popup
                  basic
                  flowing
                  trigger={<Icon name='exclamation triangle' style={{ color: SSB_COLORS.YELLOW }} />}
                >
                  <ErrorMessage error={getGroupsError} title={USER.ROLES_FETCH_ERROR[language]} />
                </Popup>
                }
              </label>
            }
          />
        </Form>
        <Divider hidden />
        <SSBButton
          primary
          disabled={putLoading}
          onClick={() => executePut({
            data: {
              [AUTH_API.USER_OBJECT.STRING]: updatedUserId,
              [AUTH_API.USER_OBJECT.ARRAY[1]]: updatedRoles,
              [AUTH_API.USER_OBJECT.ARRAY[0]]: updatedGroups
            }
          })}
        >
          {isNew ? USER.CREATE_USER[language] : USER.UPDATE_USER[language]}
        </SSBButton>
      </Modal.Content>
    </Modal>
  )
}

export default UpdateUser
