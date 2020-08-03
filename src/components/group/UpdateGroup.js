import React, { useContext, useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Button, Divider, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react'
import { SSB_COLORS, SSB_STYLE } from '@statisticsnorway/dapla-js-utilities'

import { ApiContext, DescriptionPopup, LanguageContext } from '../../utilities'
import { AUTH_API, populatedDropdown } from '../../configurations'
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
        refetch()
      }}
      trigger={
        DescriptionPopup(
          <Icon.Group size={isNew ? 'huge' : 'big'} style={{ color: SSB_COLORS[isNew ? 'GREEN' : 'BLUE'] }}>
            <Icon link name='users' onClick={() => setModalOpen(true)} data-testid={TEST_IDS.UPDATE_GROUP} />
            <Icon corner='top right' link name={isNew ? 'plus' : 'pencil'} onClick={() => setModalOpen(true)} />
          </Icon.Group>,
          false,
          'left center'
        )
      }
    >
      <Header as='h2' style={SSB_STYLE}>
        <Icon.Group size='large' style={{ marginRight: '0.2em', color: SSB_COLORS[isNew ? 'GREEN' : 'BLUE'] }}>
          <Icon name='users' />
          <Icon corner name={isNew ? 'plus' : 'edit'} />
        </Icon.Group>
        {isNew ? GROUP.CREATE_GROUP[language] : GROUP.UPDATE_GROUP[language]}
      </Header>
      <Modal.Content style={SSB_STYLE}>
        <Form size='large'>
          <Grid columns='equal'>
            <Grid.Column>
              <Form.Input
                required
                disabled={!isNew}
                value={updatedGroupId}
                placeholder={GROUP.GROUP_ID[language]}
                label={<label>{DescriptionPopup(<span>{GROUP.GROUP_ID[language]}</span>)}</label>}
                onChange={(event, { value }) => setUpdatedGroupId(value)}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.TextArea
                rows={2}
                required
                value={updatedDescription}
                placeholder={GROUP.DESCRIPTION[language]}
                label={<label>{DescriptionPopup(<span>{GROUP.DESCRIPTION[language]}</span>)}</label>}
                onChange={(event, { value }) => setUpdatedDescription(value)}
              />
            </Grid.Column>
          </Grid>
          <Divider hidden />
          <Form.Dropdown
            search
            multiple
            required
            selection
            value={updatedRoles}
            placeholder={GROUP.ROLES[language]}
            noResultsMessage={UI.SEARCH_NO_RESULTS[language]}
            onChange={(event, { value }) => setUpdatedRoles(value)}
            label={populatedDropdown(
              GROUP.ROLES[language], getLoading, refetchGet, getError, GROUP.ROLES_FETCH_ERROR[language]
            )}
            options={!getLoading && !getError && getData !== undefined ? getData[AUTH_API.ROLES].map(({ roleId }) => ({
              key: roleId,
              text: roleId,
              value: roleId
            })) : []}
          />
        </Form>
        <Divider hidden />
        <Button
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
        </Button>
      </Modal.Content>
    </Modal>
  )
}

export default UpdateGroup
