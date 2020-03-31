import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Form, Header, Icon, Modal, Popup } from 'semantic-ui-react'
import { Button as SSBButton } from '@statisticsnorway/ssb-component-library'

import { ErrorMessage } from '../'
import { ApiContext, DescriptionPopup, LanguageContext } from '../../utilities'
import { AUTH_API, SSB_COLORS, SSB_STYLE } from '../../configurations'
import { GROUP, TEST_IDS, UI } from '../../enums'

function UpdateGroup ({ group, isNew, refetch }) {
  const { authApi } = useContext(ApiContext)
  const { language } = useContext(LanguageContext)

  const [modalOpen, setModalOpen] = useState(false)
  const [updatedRoles, setUpdatedRoles] = useState(isNew ? [] : group[AUTH_API.GROUP_OBJECT.LIST])
  const [updatedGroupId, setUpdatedGroupId] = useState(isNew ? '' : group[AUTH_API.GROUP_OBJECT.STRING[0]])
  const [updatedDescription, setUpdatedDescription] = useState(isNew ? '' : group[AUTH_API.GROUP_OBJECT.STRING[1]])

  const [{ data: getData, loading: getLoading, error: getError }, refetchGet] =
    useAxios(`${authApi}${AUTH_API.GET_ROLES}`, { manual: true })
  const [{ loading: putLoading, error: putError, response: putResponse }, executePut] =
    useAxios({ url: `${authApi}${AUTH_API.PUT_GROUP(updatedGroupId)}`, method: 'PUT' }, { manual: true })

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
      onMount={() => refetchGet()}
      onClose={() => {
        setModalOpen(false)
        if (!isNew) {
          refetch()
        }
      }}
      trigger={
        DescriptionPopup(
          <Icon.Group size='big' style={{ color: SSB_COLORS[isNew ? 'GREEN' : 'BLUE'] }}>
            <Icon link name='users' onClick={() => setModalOpen(true)} data-testid={TEST_IDS.UPDATE_GROUP} />
            <Icon corner link name={isNew ? 'plus' : 'edit'} onClick={() => setModalOpen(true)} />
          </Icon.Group>,
          'left center'
        )
      }
    >
      <Header as='h2' style={SSB_STYLE}>
        <Icon.Group size='big' style={{ marginRight: '0.2em', color: SSB_COLORS[isNew ? 'GREEN' : 'BLUE'] }}>
          <Icon name='users' />
          <Icon corner name={isNew ? 'plus' : 'edit'} />
        </Icon.Group>
        {isNew ? GROUP.CREATE_GROUP[language] : GROUP.UPDATE_GROUP[language]}
      </Header>
      <Modal.Content style={SSB_STYLE}>
        <Form size='large'>
          <Form.Input
            required
            disabled={!isNew}
            value={updatedGroupId}
            placeholder={GROUP.GROUP_ID[language]}
            label={<label>{DescriptionPopup(<span>{GROUP.GROUP_ID[language]}</span>)}</label>}
            onChange={(event, { value }) => setUpdatedGroupId(value)}
          />
          <Form.TextArea
            rows={2}
            required
            value={updatedDescription}
            placeholder={GROUP.DESCRIPTION[language]}
            label={<label>{DescriptionPopup(<span>{GROUP.DESCRIPTION[language]}</span>)}</label>}
            onChange={(event, { value }) => setUpdatedDescription(value)}
          />
          <Form.Dropdown
            search
            multiple
            required
            selection
            value={updatedRoles}
            placeholder={GROUP.ROLES[language]}
            noResultsMessage={UI.SEARCH_NO_RESULTS[language]}
            onChange={(event, { value }) => setUpdatedRoles(value)}
            options={!getLoading && !getError && getData !== undefined ? getData[AUTH_API.ROLES].map(({ roleId }) => ({
              key: roleId,
              text: roleId,
              value: roleId
            })) : []}
            label={
              <label>
                {DescriptionPopup(<span>{GROUP.ROLES[language]} </span>)}
                {DescriptionPopup(
                  <Icon
                    link
                    loading={getLoading}
                    name='sync alternate'
                    onClick={() => refetchGet()}
                    style={{ color: SSB_COLORS.BLUE }}
                  />
                )}
                {getError &&
                <Popup
                  basic
                  flowing
                  trigger={<Icon name='exclamation triangle' style={{ color: SSB_COLORS.YELLOW }} />}
                >
                  <ErrorMessage error={getError} title={GROUP.ROLES_FETCH_ERROR[language]} />
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
              [AUTH_API.GROUP_OBJECT.LIST]: updatedRoles,
              [AUTH_API.GROUP_OBJECT.STRING[0]]: updatedGroupId,
              [AUTH_API.GROUP_OBJECT.STRING[1]]: updatedDescription
            }
          })}
        >
          {isNew ? GROUP.CREATE_GROUP[language] : GROUP.UPDATE_GROUP[language]}
        </SSBButton>
      </Modal.Content>
    </Modal>
  )
}

export default UpdateGroup
