// import React from 'react';
// import NavItem from './NavItem';

// const NavItems = ({ items, lang }) => {
//   return (
//     <>
//       {items.map((item) => (
//         <NavItem item={item} lang={lang} key={item.url} />
//       ))}
//     </>
//   );
// };

// export default NavItems;

import React from 'react';
import NavItem from '@plone/volto/components/theme/Navigation/NavItem';
import { Dropdown } from 'semantic-ui-react';
import { FaChevronDown } from 'react-icons/fa';

const NavItems = ({ items, lang }) => {
  return (
    <>
      {items.map((item) =>
        item && item.items && item.items.length > 0 ? (
          <Dropdown
            text={item.title}
            className="item simple"
            key={item.url}
            icon={<FaChevronDown color="#808080" />}
          >
            <Dropdown.Menu key={item.url}>
              {item.items.map((dropdownitem) => (
                <NavItem
                  item={dropdownitem}
                  lang={lang}
                  key={dropdownitem.url}
                  id="dropdownItemA"
                />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        ) : item.title === 'Home' ? (
          ''
        ) : (
          <NavItem item={item} lang={lang} key={item.url} />
        ),
      )}
    </>
  );
};

export default NavItems;
