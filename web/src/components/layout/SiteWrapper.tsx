import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/NotificationsNone";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { mainMenuItems, secondaryMenuItems } from "../../utils/mainMenuItems";
import { Link } from "react-router-dom";
import { useWindowSize } from "../../utils/useWindowSize";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${ drawerWidth }px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    paper: {
      backgroundColor: '#233c46'
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
    },
    content: {
      width: '100%',
      flexGrow: 1,
      padding: theme.spacing(3),
      paddingLeft: window.innerWidth < 700 ? theme.spacing(0) : theme.spacing(3),
      paddingRight: window.innerWidth < 700 ? theme.spacing(0) : theme.spacing(3),
      overflowX: 'hidden'
    },
    title: {
      color: '#000'
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    grow: {
      flexGrow: 1,
    },
  }),
);

const renderMenu = () => {
  return <>
    <List>
      { mainMenuItems.map(item => (
        <Link key={ item.id } to={ item.link }>
          <ListItem button key={ item.id }>
            <ListItemIcon key={ item.id }>
              { item.icon }
            </ListItemIcon>
            <ListItemText
              data-test={ `menu-${ item.name }` }
              key={ item.name } primary={ item.name }
              className={ 'drawer-text' }
            />
          </ListItem>
        </Link>
      )) }
    </List>
    <Divider/>
    <List>
      { secondaryMenuItems.map(item => (
        <Link key={ item.id } to={ item.link }>
          <ListItem button key={ item.id }>
            <ListItemIcon key={ item.id }>
              { item.icon }
            </ListItemIcon>
            <ListItemText key={ item.name } primary={ item.name } className={ 'drawer-text' }/>
          </ListItem>
        </Link>
      )) }
    </List>
  </>
}

export const SiteWrapper: React.FC = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [width, height] = useWindowSize();

  useEffect(() => {
    if (width < 900 && open) {
      console.log('entered')
      setOpen(false);
    }
  }, [width, height, open]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (localStorage.getItem('drawerStatus') === 'null') {
      localStorage.setItem('drawerStatus', 'expanded');
      return;
    }

    setOpen(localStorage.getItem('drawerStatus') === 'expanded');
  }, []);

  useEffect(() => {
    localStorage.setItem('drawerStatus', open ? 'expanded' : 'hidden');
  }, [open]);

  const appBarStyle = width > 900 ? {
    [classes.appBarShift]: open,
  } : {};

  return (
    <div className={ classes.root } data-test={ 'site-wrapper' }>
      <CssBaseline/>
      <AppBar
        data-test={ 'site-header' }
        style={ { background: '#fff' } }
        position="fixed"
        className={ clsx(classes.appBar, appBarStyle) }
      >
        <Toolbar>
          <IconButton
            data-test={ 'menu-icon' }
            aria-label="open drawer"
            onClick={ () => width > 900 ? handleDrawerOpen() : setMobileDrawerOpen(true) }
            edge="start"
            className={ clsx(classes.menuButton, {
              [classes.hide]: open,
            }) }
          >
            <MenuIcon/>
          </IconButton>
          <Typography data-test={ 'site-name' } variant="h6" noWrap className={ classes.title }>
            TPocket
          </Typography>
          <div className={ classes.grow }/>
          <div className={ classes.sectionDesktop }>
            <IconButton aria-label="show 4 new mails">
              <Badge badgeContent={ 4 } color="primary">
                <MailIcon/>
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications">
              <Badge badgeContent={ 17 } color="primary">
                <NotificationsIcon/>
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
            >
              <AccountCircle/>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      { width > 900 ? <Drawer
          variant="permanent"
          className={ clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }) }
          classes={ {
            paper: clsx(classes.paper, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          } }
        >
          <div className={ classes.toolbar }>
            <IconButton onClick={ handleDrawerClose }>
              { theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/> }
            </IconButton>
          </div>
          <Divider/>
          { renderMenu() }
        </Drawer>
        : <SwipeableDrawer
          onOpen={ () => setMobileDrawerOpen(true) }
          classes={ {
            paper: clsx(classes.paper, {
              [classes.drawerOpen]: mobileDrawerOpen,
              [classes.drawerClose]: !mobileDrawerOpen,
            })
          } }
          className={ classes.drawer }
          anchor={ 'left' }
          open={ mobileDrawerOpen }
          onClose={ () => setMobileDrawerOpen(false) }
        >
          { renderMenu() }
        </SwipeableDrawer>
      }
      <main className={ classes.content }>
        <div className={ classes.toolbar }/>
        { children }
      </main>
    </div>
  );
}
