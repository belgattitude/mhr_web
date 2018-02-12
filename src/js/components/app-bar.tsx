import React from 'react';
import {NavLink} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';

export interface MenuLinkProps {
    path: string;
    label: string;
    active: boolean;
}

interface IAppMenuProps {
    title: string;
    //menuLinks: MenuLinkProps[];
}

export type AppMenuProps = IAppMenuProps & RouteComponentProps<{}>;

export const AppBarComponent: React.SFC<AppMenuProps> = (props) => {

    const currentPath = props.location.pathname;

    //const menuItems = menu
    const menuItems: MenuLinkProps[]  = [
        {path: '/', label: 'Home'},
        {path: '/video-canvas', label: 'Canvas'},
        {path: '/gl-test', label: 'GLTest'},
        {path: '/test-scroll', label: 'Scroll'},
        {path: '/transition', label: 'Transition'},
        {path: '/pixi', label: 'Pixi'},
        {path: '/no-match', label: '404'},
    ].map((props: MenuLinkProps) => {
        return {...props, active: (currentPath == props.path)};
    });

    const LinkItem = (props: MenuLinkProps) => {
        const raised: string = props.active ? 'raised' : '';
        return (
            <NavLink to={props.path} className={raised}>
                {props.label}
            </NavLink>
        );
    };

    return (
        <div>
            {menuItems.map(({path, label, active}) => { return (
                    <LinkItem key={path} path={path} label={label} active={active} />
                ); }
            )}
        </div>
    );
};

export const AppBar = AppBarComponent;
