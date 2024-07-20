"use client";
import { useState, useCallback, useRef } from "react";

import "@shopify/polaris/build/esm/styles.css";
import "./admin.css";
import {
  AppProvider,
  Frame,
  Navigation,
  TopBar,
  ActionList,
  ContextualSaveBar,
  Toast,
} from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";
import { LinkWrapper, TopBarMarkup } from "./components";
import {
  HomeMinor,
  OrdersFilledMinor,
  ProductsFilledMinor,
  CustomersFilledMinor,
} from "@shopify/polaris-icons";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const paths = pathname.split("/").filter(Boolean);
  const selected = paths.length > 0 ? paths[paths.length - 1] : "home";

  const [selectedNavItem, setSelectedNavItem] = useState(selected);
  const [exclude, setExclude] = useState(null);

  const handleNavItemClick = useCallback((item) => {
    setSelectedNavItem(item);
    setExclude(item);
  }, []);

  const handleSubItemClick = useCallback((item) => {
    setExclude(item);
  }, []);

  //TopBar

  const defaultState = useRef({
    emailFieldValue: "dharma@jadedpixel.com",
    nameFieldValue: "Jaded Pixel",
  });
  const skipToContentRef = useRef(null);

  const [toastActive, setToastActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userMenuActive, setUserMenuActive] = useState(false);
  // const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  // const [modalActive, setModalActive] = useState(false);
  const [nameFieldValue, setNameFieldValue] = useState(
    defaultState.current.nameFieldValue,
  );
  const [emailFieldValue, setEmailFieldValue] = useState(
    defaultState.current.emailFieldValue,
  );
  const [storeName, setStoreName] = useState(
    defaultState.current.nameFieldValue,
  );
  // const [supportSubject, setSupportSubject] = useState('');
  // const [supportMessage, setSupportMessage] = useState('');

  // const handleSubjectChange = useCallback(
  //   (value) => setSupportSubject(value),
  //   []
  // );
  // const handleMessageChange = useCallback(
  //   (value) => setSupportMessage(value),
  //   []
  // );
  const handleDiscard = useCallback(() => {
    setEmailFieldValue(defaultState.current.emailFieldValue);
    setNameFieldValue(defaultState.current.nameFieldValue);
    setIsDirty(false);
  }, []);
  const handleSave = useCallback(() => {
    defaultState.current.nameFieldValue = nameFieldValue;
    defaultState.current.emailFieldValue = emailFieldValue;

    setIsDirty(false);
    setToastActive(true);
    setStoreName(defaultState.current.nameFieldValue);
  }, [emailFieldValue, nameFieldValue]);
  // const handleNameFieldChange = useCallback((value) => {
  //   setNameFieldValue(value);
  //   value && setIsDirty(true);
  // }, []);
  // const handleEmailFieldChange = useCallback((value) => {
  //   setEmailFieldValue(value);
  //   value && setIsDirty(true);
  // }, []);
  const handleSearchResultsDismiss = useCallback(() => {
    setSearchActive(false);
    setSearchValue("");
  }, []);
  const handleSearchFieldChange = useCallback((value) => {
    setSearchValue(value);
    setSearchActive(value.length > 0);
  }, []);
  const toggleToastActive = useCallback(
    () => setToastActive((toastActive) => !toastActive),
    [],
  );
  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((userMenuActive) => !userMenuActive),
    [],
  );
  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive,
      ),
    [],
  );
  // const toggleIsLoading = useCallback(
  //   () => setIsLoading((isLoading) => !isLoading),
  //   []
  // );
  // const toggleModalActive = useCallback(
  //   () => setModalActive((modalActive) => !modalActive),
  //   []
  // );

  // const toastMarkup = toastActive ? (
  //   <Toast onDismiss={toggleToastActive} content='Changes saved' />
  // ) : null;

  const userMenuActions = [
    {
      items: [{ content: "Community forums" }],
    },
  ];

  // const contextualSaveBarMarkup = isDirty ? (
  //   <ContextualSaveBar
  //     message='Unsaved changes'
  //     saveAction={{
  //       onAction: handleSave,
  //     }}
  //     discardAction={{
  //       onAction: handleDiscard,
  //     }}
  //   />
  // ) : null;

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name="Dharma"
      detail={storeName}
      initials="D"
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
    />
  );

  const searchResultsMarkup = (
    <ActionList
      items={[
        { content: "Shopify help center" },
        { content: "Community forums" },
      ]}
    />
  );

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchFieldChange}
      value={searchValue}
      placeholder="Search"
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      searchResultsVisible={searchActive}
      searchField={searchFieldMarkup}
      searchResults={searchResultsMarkup}
      onSearchResultsDismiss={handleSearchResultsDismiss}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  //Ends

  const navigationItems = [
    {
      url: "/admin",
      excludePaths: ["#"],
      label: "Home",
      icon: HomeMinor,
      onClick: () => handleNavItemClick("home"),
      selected: selectedNavItem === "home",
      excludePaths: exclude === "home" ? [] : ["/home"],
    },
    {
      url: "/admin/orders",
      excludePaths: ["#"],
      label: "Orders",
      icon: OrdersFilledMinor,
      badge: "15",
      onClick: () => handleNavItemClick("orders"),
      selected: selectedNavItem === "orders",
      excludePaths: exclude === "orders" ? [] : ["/orders"],
    },
    {
      url: "/admin/products",
      label: "Products",
      icon: ProductsFilledMinor,
      selected: true,
      badge: "20",
      onClick: () => handleNavItemClick("products"),
      selected: selectedNavItem === "products",
      excludePaths: exclude === "products" ? [] : ["/products"],
      subNavigationItems: [
        {
          url: "/admin/collections",
          excludePaths: ["#"],
          disabled: false,
          label: "Collections",
          onClick: () => handleSubItemClick("collections"),
          excludePaths: exclude === "collections" ? [] : ["/collections"],
        },
        {
          url: "/admin/products/inventory",
          disabled: false,
          label: "Inventory",
          onClick: () => handleSubItemClick("inventory"),
          excludePaths: exclude === "inventory" ? [] : ["/inventory"],
        },
      ],
    },
    {
      url: "/admin/customers",
      excludePaths: ["#"],
      label: "Customers",
      icon: CustomersFilledMinor,
      onClick: () => handleNavItemClick("customers"),
      selected: selectedNavItem === "customers",
      excludePaths: exclude === "customers" ? [] : ["/customers"],
    },
  ];

  const logo = {
    width: 86,
    topBarSource:
      "https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png",
    contextualSaveBarSource:
      "https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png",
    accessibilityLabel: "Shopify",
  };

  return (
    <html lang="en">
      <body>
        <AppProvider linkComponent={LinkWrapper} i18n={en}>
          <Frame
            logo={logo}
            topBar={topBarMarkup}
            navigation={
              <Navigation location={pathname}>
                <Navigation.Section items={navigationItems} />
              </Navigation>
            }
          >
            {children}
          </Frame>
        </AppProvider>
      </body>
    </html>
  );
}
