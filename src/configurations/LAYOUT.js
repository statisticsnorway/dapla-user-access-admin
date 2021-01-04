import React from 'react'
import { Icon, Popup } from 'semantic-ui-react'
import { ErrorMessage, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

import { DescriptionPopup } from '../utilities'

export const populatedDropdown = (label, loading, refetch, error, errorTitle) =>
  <label>
    {DescriptionPopup(<span>{label} </span>)}
    {DescriptionPopup(
      <Icon
        link
        fitted
        loading={loading}
        name='sync alternate'
        onClick={() => refetch()}
        style={{ color: SSB_COLORS.BLUE }}
      />
    )}
    {error &&
    <Popup
      basic
      flowing
      trigger={<Icon name='exclamation triangle' style={{ color: SSB_COLORS.YELLOW }} />}
    >
      <ErrorMessage error={error} title={errorTitle} />
    </Popup>
    }
  </label>
