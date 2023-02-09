import downloadSVG from '@plone/volto/icons/download.svg';

import SiteDataView from './SiteDataView';
import SiteDataEdit from './SiteDataEdit';

const installSiteDataBlock = (config) => {
  config.blocks.blocksConfig.siteData = {
    id: 'siteData',
    title: 'Site Data',
    icon: downloadSVG,
    group: 'site',
    view: SiteDataView,
    edit: SiteDataEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  return config;
};

export default installSiteDataBlock;
