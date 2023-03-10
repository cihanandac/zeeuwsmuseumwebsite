"""Setup tests for this package."""
from plone import api
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from Products.CMFPlone.utils import get_installer
from zeeuwsmuseumwebsite.testing import ZEEUWSMUSEUMWEBSITE_INTEGRATION_TESTING

import unittest


class TestSetup(unittest.TestCase):
    """Test that zeeuwsmuseumwebsite is properly installed."""

    layer = ZEEUWSMUSEUMWEBSITE_INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer["portal"]
        self.setup = self.portal.portal_setup
        self.installer = get_installer(self.portal, self.layer["request"])

    def test_product_installed(self):
        """Test if zeeuwsmuseumwebsite is installed."""
        self.assertTrue(self.installer.is_product_installed("zeeuwsmuseumwebsite"))

    def test_browserlayer(self):
        """Test that IZEEUWSMUSEUMWEBSITELayer is registered."""
        from plone.browserlayer import utils
        from zeeuwsmuseumwebsite.interfaces import IZEEUWSMUSEUMWEBSITELayer

        self.assertIn(IZEEUWSMUSEUMWEBSITELayer, utils.registered_layers())

    def test_latest_version(self):
        """Test latest version of default profile."""
        self.assertEqual(
            self.setup.getLastVersionForProfile("zeeuwsmuseumwebsite:default")[0],
            "20230118001",
        )


class TestUninstall(unittest.TestCase):

    layer = ZEEUWSMUSEUMWEBSITE_INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer["portal"]
        self.installer = get_installer(self.portal, self.layer["request"])
        roles_before = api.user.get_roles(TEST_USER_ID)
        setRoles(self.portal, TEST_USER_ID, ["Manager"])
        self.installer.uninstall_product("zeeuwsmuseumwebsite")
        setRoles(self.portal, TEST_USER_ID, roles_before)

    def test_product_uninstalled(self):
        """Test if zeeuwsmuseumwebsite is cleanly uninstalled."""
        self.assertFalse(self.installer.is_product_installed("zeeuwsmuseumwebsite"))

    def test_browserlayer_removed(self):
        """Test that IZEEUWSMUSEUMWEBSITELayer is removed."""
        from plone.browserlayer import utils
        from zeeuwsmuseumwebsite.interfaces import IZEEUWSMUSEUMWEBSITELayer

        self.assertNotIn(IZEEUWSMUSEUMWEBSITELayer, utils.registered_layers())
