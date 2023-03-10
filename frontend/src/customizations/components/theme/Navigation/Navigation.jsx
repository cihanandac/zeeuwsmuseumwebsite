/* eslint-disable eqeqeq */
/**
 * Navigation components.
 * @module components/theme/Navigation/Navigation
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import { Menu, Accordion, Segment } from 'semantic-ui-react';
import cx from 'classnames';
import { BodyClass, getBaseUrl, hasApiExpander } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { getNavigation } from '@plone/volto/actions';
import { CSSTransition } from 'react-transition-group';
import NavItems from '@plone/volto/components/theme/Navigation/NavItems';
import { LanguageSelector, SearchWidget } from '@plone/volto/components';
// eslint-disable-next-line import/no-unresolved
import { FaChevronDown } from 'react-icons/fa';
import NavItem from '@plone/volto/components/theme/Navigation/NavItem';
// eslint-disable-next-line import/no-unresolved
import { AccordionLanguageSelector } from 'components';
import { NavLink } from 'react-router-dom';

const messages = defineMessages({
  closeMobileMenu: {
    id: 'Close menu',
    defaultMessage: 'Close menu',
  },
  openMobileMenu: {
    id: 'Open menu',
    defaultMessage: 'Open menu',
  },
});

/**
 * Navigation container class.
 * @class Navigation
 * @extends Component
 */

let menuArray = [];

class Navigation extends Component {
  state = { activeIndex: 0 };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getNavigation: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
      }),
    ).isRequired,
    lang: PropTypes.string.isRequired,
  };

  static defaultProps = {
    token: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Navigation
   */
  constructor(props) {
    super(props);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
    this.state = {
      isMobileMenuOpen: false,
    };
  }

  componentDidMount() {
    const { settings } = config;
    if (!hasApiExpander('navigation', getBaseUrl(this.props.pathname))) {
      this.props.getNavigation(
        getBaseUrl(this.props.pathname),
        settings.navDepth,
      );
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { settings } = config;
    if (
      nextProps.pathname !== this.props.pathname ||
      nextProps.token !== this.props.token
    ) {
      if (!hasApiExpander('navigation', getBaseUrl(this.props.pathname))) {
        this.props.getNavigation(
          getBaseUrl(nextProps.pathname),
          settings.navDepth,
        );
      }
    }
  }

  /**
   * Toggle mobile menu's open state
   * @method toggleMobileMenu
   * @returns {undefined}
   */
  toggleMobileMenu() {
    this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen });
    this.setState({ activeIndex: -1 });
  }

  /**
   * Close mobile menu
   * @method closeMobileMenu
   * @returns {undefined}
   */
  closeMobileMenu() {
    if (!this.state.isMobileMenuOpen) {
      return;
    }
    this.setState({ isMobileMenuOpen: false });
    this.setState({ activeIndex: -1 });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */

  render() {
    const { activeIndex } = this.state;

    return (
      <nav className="navigation" id="navigation" aria-label="navigation">
        <div className="hamburger-wrapper mobile tablet only">
          <button
            className={cx('hamburger hamburger--spin', {
              'is-active': this.state.isMobileMenuOpen,
            })}
            aria-label={
              this.state.isMobileMenuOpen
                ? this.props.intl.formatMessage(messages.closeMobileMenu, {
                    type: this.props.type,
                  })
                : this.props.intl.formatMessage(messages.openMobileMenu, {
                    type: this.props.type,
                  })
            }
            title={
              this.state.isMobileMenuOpen
                ? this.props.intl.formatMessage(messages.closeMobileMenu, {
                    type: this.props.type,
                  })
                : this.props.intl.formatMessage(messages.openMobileMenu, {
                    type: this.props.type,
                  })
            }
            type="button"
            onClick={this.toggleMobileMenu}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </button>
        </div>
        <Menu
          stackable
          pointing
          secondary
          className="computer large screen widescreen only"
          onClick={this.closeMobileMenu}
        >
          <NavItems items={this.props.items} lang={this.props.lang} />
          <div className="tools-search-wrapper">
            <LanguageSelector />
            <div className="search">
              <SearchWidget />
            </div>
          </div>
        </Menu>
        <CSSTransition
          in={this.state.isMobileMenuOpen}
          timeout={500}
          classNames="mobile-menu"
          unmountOnExit
        >
          <div key="mobile-menu-key" className="mobile-menu">
            <BodyClass className="has-mobile-menu-open" />
            <div className="mobile-menu-nav">
              <Menu stackable pointing secondary>
                <div className="search-tool">
                  <div className="tools-search-wrapper">
                    <div className="search">
                      <SearchWidget />
                    </div>
                  </div>
                </div>
                <AccordionLanguageSelector />
                {this.props.items.map((item) =>
                  item && item.items && item.items.length > 0 ? (
                    <Accordion active className="item simple">
                      <Accordion.Title
                        active={activeIndex === item.title}
                        index={item.title}
                        onClick={this.handleClick}
                        activeClassName="active"
                        className={this.activeClassName ? 'active' : ''}
                      >
                        {item.title} <FaChevronDown />
                      </Accordion.Title>
                      <Accordion.Content
                        active={activeIndex === item.title}
                        onClick={this.closeMobileMenu}
                        onClosing={this.handleClick}
                      >
                        {item.items.map((dropdownitem) => (
                          <NavItem
                            item={dropdownitem}
                            lang={this.lang}
                            key={dropdownitem.id}
                            id="dropdownItemA"
                          />
                        ))}
                      </Accordion.Content>
                    </Accordion>
                  ) : item.title === 'Home' ? (
                    ''
                  ) : (
                    <NavItem item={item} lang={this.lang} key={item.id} />
                  ),
                )}

                {/* This section is to render Breadcrumbs conditionally */}
                {this.props.content != undefined ? (
                  this.props.content['@type'] == 'Document' ||
                  this.props.content['@type'] == 'slideshow' ? (
                    <Segment>
                      <Menu stackable pointing secondary>
                        <Accordion className="item simple">
                          <Accordion.Title
                            active={activeIndex === 0}
                            index={0}
                            onClick={this.handleClick}
                          >
                            INHOUD <FaChevronDown />
                          </Accordion.Title>
                          <Accordion.Content
                            active={activeIndex === 0}
                            onClick={this.closeMobileMenu}
                          >
                            {(() => {
                              if (
                                this.props.menuItems['@type'] === 'Document'
                              ) {
                                let nav = this.props.navItems;
                                let parentTitle = this.props.menuItems.parent
                                  .title;

                                for (let item1 of nav) {
                                  if (item1.title == parentTitle) {
                                    menuArray = item1.items;
                                    for (let item of menuArray) {
                                      if (
                                        item.title == 'IMAGES' ||
                                        item.title == 'images'
                                      ) {
                                        // console.log(menuArray)
                                        let placeofItem = menuArray.indexOf(
                                          item,
                                        );
                                        if (placeofItem > -1) {
                                          menuArray.splice(placeofItem, 1);
                                        }
                                      }
                                    }
                                    break;
                                  }
                                  for (let item2 of item1.items) {
                                    if (item2.title == parentTitle) {
                                      menuArray = item2.items;
                                      // console.log(menuArray);

                                      for (let item of menuArray) {
                                        if (
                                          item.title == 'IMAGES' ||
                                          item.title == 'images'
                                        ) {
                                          let placeofItem = menuArray.indexOf(
                                            item,
                                          );
                                          if (placeofItem > -1) {
                                            menuArray.splice(placeofItem, 1);
                                          }
                                        }
                                      }
                                      break;
                                    }
                                    for (let item3 of item2.items) {
                                      if (item3.title == parentTitle) {
                                        menuArray = item3.items;
                                        // console.log(menuArray);
                                        for (let item of menuArray) {
                                          if (
                                            item.title == 'IMAGES' ||
                                            item.title == 'images'
                                          ) {
                                            // console.log(menuArray)
                                            let placeofItem = menuArray.indexOf(
                                              item,
                                            );
                                            if (placeofItem > -1) {
                                              menuArray.splice(placeofItem, 1);
                                            }
                                          }
                                        }
                                        break;
                                      }
                                      for (let item4 of item3.items) {
                                        if (item4.title == parentTitle) {
                                          menuArray = item4.items;
                                          for (let item of menuArray) {
                                            if (
                                              item.title == 'IMAGES' ||
                                              item.title == 'images'
                                            ) {
                                              // console.log(menuArray)
                                              let placeofItem = menuArray.indexOf(
                                                item,
                                              );
                                              if (placeofItem > -1) {
                                                menuArray.splice(
                                                  placeofItem,
                                                  1,
                                                );
                                              }
                                            }
                                          }
                                          break;
                                        }
                                      }
                                    }
                                  }
                                }
                              } else {
                                menuArray = [];
                                if (this.props.menuItems.items != undefined) {
                                  for (let item of this.props.menuItems.items) {
                                    if (
                                      menuArray.includes(item) == false &&
                                      item['@type'] == 'Document'
                                    ) {
                                      menuArray.push(item);
                                    }
                                  }
                                }
                              }
                            })()}

                            <ul className="accordionbreadcrumblist">
                              <li>
                                <NavLink
                                  to={
                                    this.props.breadcrumbItem.length !=
                                      undefined &&
                                    this.props.breadcrumbItem.length > 2
                                      ? this.props.menuItems['@type'] ==
                                        'Document'
                                        ? this.props.breadcrumbItem[
                                            this.props.breadcrumbItem.length - 2
                                          ].url
                                        : this.props.breadcrumbItem[
                                            this.props.breadcrumbItem.length - 1
                                          ].url
                                      : ''
                                  }
                                  key={
                                    this.props.breadcrumbItem.length !=
                                      undefined &&
                                    this.props.breadcrumbItem.length > 2
                                      ? this.props.menuItems['@type'] ==
                                        'Document'
                                        ? this.props.items[
                                            this.props.breadcrumbItem.length - 2
                                          ].title
                                        : this.props.items[
                                            this.props.breadcrumbItem.length - 1
                                          ].title
                                      : ''
                                  }
                                  className="accordion item simple"
                                  id="InhoudDropdown"
                                  activeClassName="active"
                                >
                                  Beeldimpressie
                                </NavLink>
                              </li>
                              {[...menuArray].map((x, i) => (
                                <li>
                                  <NavItem
                                    item={x}
                                    lang={this.lang}
                                    key={x.title}
                                    id="x"
                                  />
                                </li>
                              ))}
                            </ul>
                          </Accordion.Content>
                        </Accordion>
                      </Menu>
                    </Segment>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}
              </Menu>
            </div>
          </div>
        </CSSTransition>
      </nav>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state) => ({
      token: state.userSession.token,
      items: state.navigation.items,
      lang: state.intl.locale,
      content: state.content.data,
      navItems: state.navigation.items,
      breadcrumbItem: state.breadcrumbs.items,
    }),
    { getNavigation },
  ),
)(Navigation);
