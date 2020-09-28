import React from "react";
import { IMenuItem } from "../interfaces/IMenuItem";
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CategoryIcon from '@material-ui/icons/Category';
import HelpOutlineIcon from '@material-ui/icons/Help';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import EmailIcon from '@material-ui/icons/Email';

export const mainMenuItems: Array<IMenuItem> = [
  {
    id: 1,
    link: '/home',
    name: 'Home',
    icon: <HomeIcon className={ 'light-grey-icon' }/>
  },
  {
    id: 2,
    link: '/account',
    name: 'Account',
    icon: <AccountCircleIcon className={ 'light-grey-icon ' }/>
  },
  {
    id: 3,
    link: '/categories',
    name: 'Categories',
    icon: <CategoryIcon className={ 'light-grey-icon' }/>
  }
];

export const secondaryMenuItems: Array<IMenuItem> = [
  {
    id: 1,
    link: '/help',
    name: 'Help',
    icon: <HelpOutlineIcon className={ 'light-grey-icon' }/>
  },
  {
    id: 2,
    link: '/writeus',
    name: 'Support',
    icon: <EmailIcon className={ 'light-grey-icon' }/>
  },
  {
    id: 3,
    link: '/logout',
    name: 'Sign out',
    icon: <ExitToAppIcon className={ 'light-grey-icon ' }/>
  }
];
