import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { wipeDisc, listContent } from '../redux/actions';
import { actions as appActions } from '../redux/app-feature';
import { actions as renameDialogActions } from '../redux/rename-dialog-feature';
import { useShallowEqualSelector } from '../utils';
import Link from '@material-ui/core/Link';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

import RefreshIcon from '@material-ui/icons/Refresh';
import EditIcon from '@material-ui/icons/Edit';
import GitHubIcon from '@material-ui/icons/GitHub';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import InfoIcon from '@material-ui/icons/Info';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';

const useStyles = makeStyles(theme => ({
    listItemIcon: {
        minWidth: theme.spacing(5),
    },
}));

export const TopMenu = function() {
    const classes = useStyles();
    const dispatch = useDispatch();

    let { mainView, darkMode } = useShallowEqualSelector(state => state.appState);
    let discTitle = useShallowEqualSelector(state => state.main.disc?.title ?? ``);

    const githubLinkRef = React.useRef<null | HTMLAnchorElement>(null);
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(menuAnchorEl);

    const handleMenuOpen = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            setMenuAnchorEl(event.currentTarget);
        },
        [setMenuAnchorEl]
    );

    const handleDarkMode = useCallback(() => {
        dispatch(appActions.setDarkMode(!darkMode));
    }, [dispatch, darkMode]);

    const handleMenuClose = useCallback(() => {
        setMenuAnchorEl(null);
    }, [setMenuAnchorEl]);

    const handleWipeDisc = useCallback(() => {
        dispatch(wipeDisc());
        handleMenuClose();
    }, [dispatch, handleMenuClose]);

    const handleRefresh = useCallback(() => {
        dispatch(listContent());
        handleMenuClose();
    }, [dispatch, handleMenuClose]);

    const handleRenameDisc = useCallback(() => {
        dispatch(
            batchActions([
                renameDialogActions.setVisible(true),
                renameDialogActions.setCurrentName(discTitle),
                renameDialogActions.setIndex(-1),
            ])
        );
        handleMenuClose();
    }, [dispatch, handleMenuClose, discTitle]);

    const handleExit = useCallback(() => {
        dispatch(appActions.setState('WELCOME'));
        handleMenuClose();
    }, [dispatch, handleMenuClose]);

    const handleShowAbout = useCallback(() => {
        dispatch(appActions.showAboutDialog(true));
        handleMenuClose();
    }, [dispatch, handleMenuClose]);

    const handleGithubLink = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            if (event.target !== githubLinkRef.current) {
                // Prevent opening the link twice
                githubLinkRef.current?.click();
            }
            handleMenuClose();
        },
        [handleMenuClose]
    );

    const menuItems = [];
    if (mainView === 'MAIN') {
        menuItems.push(
            <MenuItem key="update" onClick={handleRefresh}>
                <ListItemIcon className={classes.listItemIcon}>
                    <RefreshIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Reload TOC</ListItemText>
            </MenuItem>
        );
        menuItems.push(
            <MenuItem key="title" onClick={handleRenameDisc}>
                <ListItemIcon className={classes.listItemIcon}>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Rename Disc</ListItemText>
            </MenuItem>
        );
        menuItems.push(
            <MenuItem key="wipe" onClick={handleWipeDisc}>
                <ListItemIcon className={classes.listItemIcon}>
                    <DeleteForeverIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Wipe Disc</ListItemText>
            </MenuItem>
        );
        menuItems.push(
            <MenuItem key="exit" onClick={handleExit}>
                <ListItemIcon className={classes.listItemIcon}>
                    <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Exit</ListItemText>
            </MenuItem>
        );
    }
    menuItems.push(
        <MenuItem key="darkMode" onClick={handleDarkMode}>
            <ListItemIcon className={classes.listItemIcon}>
                {/* <Switch name="darkModeSwitch" inputProps={{ 'aria-label': 'Dark Mode switch' }} size="small" /> */}
                {darkMode ? <ToggleOnIcon fontSize="small" /> : <ToggleOffIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>Dark Mode</ListItemText>
        </MenuItem>
    );
    menuItems.push(
        <MenuItem key="about" onClick={handleShowAbout}>
            <ListItemIcon className={classes.listItemIcon}>
                <InfoIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>About</ListItemText>
        </MenuItem>
    );
    menuItems.push(
        <MenuItem key="github" onClick={handleGithubLink}>
            <ListItemIcon className={classes.listItemIcon}>
                <GitHubIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
                <Link
                    rel="noopener noreferrer"
                    href="https://github.com/cybercase/webminidisc"
                    target="_blank"
                    ref={githubLinkRef}
                    onClick={handleGithubLink}
                >
                    Fork me on GitHub
                </Link>
            </ListItemText>
        </MenuItem>
    );

    return (
        <React.Fragment>
            <IconButton aria-label="actions" aria-controls="actions-menu" aria-haspopup="true" onClick={handleMenuOpen}>
                <MoreVertIcon />
            </IconButton>
            <Menu id="actions-menu" anchorEl={menuAnchorEl} keepMounted open={menuOpen} onClose={handleMenuClose}>
                {menuItems}
            </Menu>
        </React.Fragment>
    );
};
