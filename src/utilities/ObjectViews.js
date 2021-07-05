import React from 'react'
import { Icon, Popup } from 'semantic-ui-react'
import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

export const DescriptionPopup = (trigger, description = false, position = 'top left') =>
  <Popup basic flowing position={position} trigger={trigger}>
    <Icon name='info circle' style={{ color: SSB_COLORS.BLUE }} />
    {description ? description : ''}
  </Popup>
