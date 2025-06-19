'use client';
import { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from 'react-pro-sidebar';
import HomeIcon from '@mui/icons-material/Home';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import 'react-pro-sidebar/dist/css/styles.css';

export default function GetButlrSidebar() {
  const { collapseSidebar, collapsed } = useProSidebar();
  const [dark, setDark] = useState(false);

  return (
    <Sidebar
      breakPoint="md"
      backgroundColor={dark ? '#2e2e2e' : '#ffffff'}
      style={{ height: '100vh', borderRight: '1px solid #ccc' }}
    >
      <Menu>
        <MenuItem icon={<HomeIcon />} onClick={() => collapseSidebar()}>
          Dashboard
        </MenuItem>
        <MenuItem icon={<TextFieldsIcon />}>SEO Suggestion</MenuItem>
        <SubMenu label="Thumbnail" icon={<ImageIcon />}>
          <MenuItem>Score & Feedback</MenuItem>
          <MenuItem>Edit Cover</MenuItem>
        </SubMenu>
        <MenuItem icon={<SettingsIcon />}>A/B Testing</MenuItem>
        <MenuItem icon={dark ? <Brightness7Icon /> : <Brightness4Icon />} onClick={() => setDark(!dark)}>
          {dark ? 'Light Mode' : 'Dark Mode'}
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}

