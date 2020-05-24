import React, { useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import classes from './navigation.module.css';
import { FaShoppingCart } from 'react-icons/fa';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink as NavLinkBoot,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

const Navigation = (props) => {

    console.log(props);
    const [isloggedin, loginhandler] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    return (
        <div>
            <Navbar color="dark" dark expand="sm" className="mb-5">
                <NavbarBrand tag={NavLink} className={ classes.NavLink } to="/">XYZ</NavbarBrand>
                <NavbarToggler onClick={ toggle } />
                <Collapse isOpen={ isOpen } navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLinkBoot tag={NavLink} className={ classes.NavLink } to="/components/">Components</NavLinkBoot>
                        </NavItem>
                        <NavItem>
                            <NavLinkBoot tag = {NavLink} className={ classes.NavLink } to="/user">GitHub</NavLinkBoot>
                        </NavItem>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Categories
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>
                                    Option 1
                                </DropdownItem>
                                <DropdownItem>
                                    Option 2
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                    <NavLinkBoot tag={NavLink} className={ classes.NavLink } to="/cart"><FaShoppingCart /></NavLinkBoot>
                </Collapse>
            </Navbar>
        </div>
    );
}
export default withRouter(Navigation);