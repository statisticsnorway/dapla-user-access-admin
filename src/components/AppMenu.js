import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, Header, Icon, Image, Menu } from 'semantic-ui-react'
import { LANGUAGE, SSB_COLORS, ssb_logo_rgb } from '@statisticsnorway/dapla-js-utilities'

import { LanguageContext } from '../utilities'
import { ROUTING } from '../configurations'
import { TEST_IDS, UI } from '../enums'

const routeIcons = ['user', 'users', 'address card']

function AppMenu ({ setSettingsOpen }) {
  const { language, setLanguage } = useContext(LanguageContext)

  const dropdownItems = Object.keys(LANGUAGE.LANGUAGES).map(languageName =>
    <Dropdown.Item
      key={languageName}
      content={LANGUAGE[languageName][language]}
      onClick={() => setLanguage(LANGUAGE.LANGUAGES[languageName].languageCode)}
    />
  )

  return (
    <Menu secondary size='huge' icon='labeled' style={{ padding: '1rem', paddingTop: '2rem' }}>
      <Menu.Item as={Link} to={ROUTING.BASE}>
        <Image size='medium' src={ssb_logo_rgb} />
      </Menu.Item>
      <Menu.Item>
        <Header size='huge' content={UI.HEADER[language]} />
      </Menu.Item>
      <Menu.Menu position='right'>
        {Object.entries(ROUTING).filter(([route]) => route !== 'BASE').map(([route, path], index) =>
          <Menu.Item key={path} as={Link} to={path}>
            <Icon link fitted name={routeIcons[index]} size='big' style={{ color: SSB_COLORS.BLUE }} />
            {UI[route][language]}
          </Menu.Item>
        )}
        <Menu.Item
          onClick={() => setSettingsOpen(true)}
          icon={{ name: 'setting', size: 'big', 'data-testid': TEST_IDS.ACCESS_SETTINGS_BUTTON }}
          style={{ color: SSB_COLORS.GREEN }}
        />
        <Dropdown item text={`${LANGUAGE.LANGUAGE[language]} (${LANGUAGE.LANGUAGE_CHOICE[language]})`}>
          <Dropdown.Menu>{dropdownItems}</Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
  )
}

export default AppMenu
