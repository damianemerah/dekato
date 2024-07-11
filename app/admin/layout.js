"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import en from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import {
  ActionList,
  AppProvider,
  LegacyCard,
  ContextualSaveBar,
  FormLayout,
  Frame,
  Layout,
  Loading,
  Modal,
  Navigation,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  BlockStack,
  TextField,
  Toast,
  TopBar,
} from "@shopify/polaris";
import {
  OrderFilledIcon,
  ProductFilledIcon,
  HomeFilledIcon,
  CollectionFilledIcon,
  PersonFilledIcon,
  InventoryFilledIcon,
} from "@shopify/polaris-icons";

import { LinkWrapper } from "./components";

function AdminLayout({ children }) {
  // Loading component and active navlink style
  const pathname = usePathname();

  // Split the pathname into an array of path segments
  const paths = pathname.split("/").filter(Boolean);
  // Get the last path segment, which represents the currently active page
  const selected = paths.length > 0 ? paths[paths.length - 1] : "admin";

  // State to manage the currently selected navigation item
  const [selectedNavItem, setSelectedNavItem] = useState(selected);

  // Callback function to handle navigation item clicks
  const handleNavItemClick = useCallback((item) => {
    // Update the selected navigation item
    setSelectedNavItem(item);
    // Set the loading state to true
    setIsLoading(true);
  }, []);

  // Effect to reset the loading state when the pathname changes
  useEffect(() => {
    // Set the loading state to false
    setIsLoading(false);
  }, [pathname]);

  // Ref to store the default state of the form
  const defaultState = useRef({
    emailFieldValue: "dharma@jadedpixel.com",
    nameFieldValue: "Jaded Pixel",
  });
  // Ref to store the skip-to-content target element
  const skipToContentRef = useRef(null);

  // State variables for managing various UI elements
  const [toastActive, setToastActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [nameFieldValue, setNameFieldValue] = useState(
    defaultState.current.nameFieldValue,
  );
  const [emailFieldValue, setEmailFieldValue] = useState(
    defaultState.current.emailFieldValue,
  );
  const [storeName, setStoreName] = useState(
    defaultState.current.nameFieldValue,
  );
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  // Callback functions to handle form field changes
  const handleSubjectChange = useCallback(
    (value) => setSupportSubject(value),
    [],
  );
  const handleMessageChange = useCallback(
    (value) => setSupportMessage(value),
    [],
  );
  // Callback function to handle discarding form changes
  const handleDiscard = useCallback(() => {
    // Reset the form fields to their default values
    setEmailFieldValue(defaultState.current.emailFieldValue);
    setNameFieldValue(defaultState.current.nameFieldValue);
    // Set the dirty state to false
    setIsDirty(false);
  }, []);
  // Callback function to handle saving form changes
  const handleSave = useCallback(() => {
    // Update the default state with the current form values
    defaultState.current.nameFieldValue = nameFieldValue;
    defaultState.current.emailFieldValue = emailFieldValue;

    // Set the dirty state to false
    setIsDirty(false);
    // Activate the toast message
    setToastActive(true);
    // Update the store name with the saved name
    setStoreName(defaultState.current.nameFieldValue);
  }, [emailFieldValue, nameFieldValue]);
  // Callback function to handle changes in the name field
  const handleNameFieldChange = useCallback((value) => {
    // Update the name field value
    setNameFieldValue(value);
    // Set the dirty state to true if the value is not empty
    value && setIsDirty(true);
  }, []);
  // Callback function to handle changes in the email field
  const handleEmailFieldChange = useCallback((value) => {
    // Update the email field value
    setEmailFieldValue(value);
    // Set the dirty state to true if the value is not empty
    value && setIsDirty(true);
  }, []);
  // Callback function to handle dismissing search results
  const handleSearchResultsDismiss = useCallback(() => {
    // Deactivate the search and clear the search value
    setSearchActive(false);
    setSearchValue("");
  }, []);
  // Callback function to handle changes in the search field
  const handleSearchFieldChange = useCallback((value) => {
    // Update the search value
    setSearchValue(value);
    // Activate the search if the value is not empty
    setSearchActive(value.length > 0);
  }, []);
  // Callback function to toggle the toast message
  const toggleToastActive = useCallback(
    () => setToastActive((toastActive) => !toastActive),
    [],
  );
  // Callback function to toggle the user menu
  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((userMenuActive) => !userMenuActive),
    [],
  );

  // Callback function to toggle the mobile navigation
  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive,
      ),
    [],
  );

  // Callback function to toggle the modal
  const toggleModalActive = useCallback(
    () => setModalActive((modalActive) => !modalActive),
    [],
  );

  // Markup for the toast message
  const toastMarkup = toastActive ? (
    <Toast onDismiss={toggleToastActive} content="Changes saved" />
  ) : null;

  // Actions for the user menu
  const userMenuActions = [
    {
      items: [{ content: "Community forums" }],
    },
  ];

  // Markup for the contextual save bar
  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message="Unsaved changes"
      saveAction={{
        onAction: handleSave,
      }}
      discardAction={{
        onAction: handleDiscard,
      }}
    />
  ) : null;

  // Markup for the user menu
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

  // Markup for the search results
  const searchResultsMarkup = (
    <ActionList
      items={[
        { content: "Shopify help center" },
        { content: "Community forums" },
      ]}
    />
  );

  // Markup for the search field
  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchFieldChange}
      value={searchValue}
      placeholder="Search"
    />
  );

  // Markup for the top bar
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

  // Markup for the navigation
  const navigationMarkup = (
    <Navigation location="/">
      <Navigation.Section
        items={[
          {
            url: "/admin",
            label: "Home",
            icon: HomeFilledIcon,
            onClick: () => handleNavItemClick("admin"),
            selected: selectedNavItem === "admin",
          },
          {
            url: "/admin/orders",
            label: "Orders",
            icon: OrderFilledIcon,
            onClick: () => handleNavItemClick("orders"),
            selected: selectedNavItem === "orders",
          },
          {
            url: "/admin/products",
            label: "Products",
            icon: ProductFilledIcon,
            onClick: () => handleNavItemClick("products"),
            selected: selectedNavItem === "products",
          },
          {
            url: "/admin/collections",
            icon: CollectionFilledIcon,
            label: "Collections",
            onClick: () => handleNavItemClick("collections"),
            selected: selectedNavItem === "collections",
          },
          {
            url: "/admin/products/inventory",
            icon: InventoryFilledIcon,
            label: "Inventory",
            onClick: () => handleNavItemClick("inventory"),
            selected: selectedNavItem === "inventory",
          },
          {
            url: "/admin/customers",
            label: "Customers",
            icon: PersonFilledIcon,
            onClick: () => handleNavItemClick("customers"),
            selected: selectedNavItem === "customers",
          },
        ]}
      />
    </Navigation>
  );

  // Markup for the loading indicator
  const loadingMarkup = isLoading ? <Loading /> : null;

  // Target element for the skip-to-content link
  const skipToContentTarget = (
    <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />
  );

  // Markup for the actual page content
  const actualPageMarkup = (
    <Page title="Account">
      <Layout>
        {/* Skip-to-content target */}
        {skipToContentTarget}
        {/* Annotated section for account details */}
        <Layout.AnnotatedSection
          title="Account details"
          description="Jaded Pixel will use this as your account information."
        >
          {/* Card for the account details form */}
          <LegacyCard sectioned>
            {/* Form layout for the account details fields */}
            <FormLayout>
              {/* Text field for the full name */}
              <TextField
                label="Full name"
                value={nameFieldValue}
                onChange={handleNameFieldChange}
                autoComplete="name"
              />
              {/* Text field for the email */}
              <TextField
                type="email"
                label="Email"
                value={emailFieldValue}
                onChange={handleEmailFieldChange}
                autoComplete="email"
              />
            </FormLayout>
          </LegacyCard>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );

  // Markup for the loading page
  const loadingPageMarkup = (
    <SkeletonPage>
      <Layout>
        <Layout.Section>
          <LegacyCard sectioned>
            <BlockStack>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={9} />
            </BlockStack>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );

  // Conditional rendering of the page based on loading state
  const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

  // Markup for the contact support modal
  const modalMarkup = (
    <Modal
      open={modalActive}
      onClose={toggleModalActive}
      title="Contact support"
      primaryAction={{
        content: "Send",
        onAction: toggleModalActive,
      }}
    >
      <Modal.Section>
        <FormLayout>
          {/* Text field for the support subject */}
          <TextField
            label="Subject"
            value={supportSubject}
            onChange={handleSubjectChange}
            autoComplete="off"
          />
          {/* Text field for the support message */}
          <TextField
            label="Message"
            value={supportMessage}
            onChange={handleMessageChange}
            autoComplete="off"
            multiline
          />
        </FormLayout>
      </Modal.Section>
    </Modal>
  );

  // Logo configuration for the frame
  const logo = {
    width: 86,
    topBarSource:
      "https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png",
    contextualSaveBarSource:
      "https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png",
    accessibilityLabel: "Shopify",
  };

  // Render the admin layout
  return (
    <html lang="en">
      <body>
        {/* App provider for Polaris components */}
        <AppProvider linkComponent={LinkWrapper}>
          {/* Frame for the admin interface */}
          <Frame
            logo={logo}
            topBar={topBarMarkup}
            navigation={navigationMarkup}
            showMobileNavigation={mobileNavigationActive}
            onNavigationDismiss={toggleMobileNavigationActive}
            skipToContentTarget={skipToContentRef}
          >
            {/* Contextual save bar for unsaved changes */}
            {contextualSaveBarMarkup}
            {/* Loading indicator */}
            {loadingMarkup}
            {/* Child components */}
            {children}
            {/* Toast message */}
            {toastMarkup}
            {/* Contact support modal */}
            {modalMarkup}
          </Frame>
        </AppProvider>
      </body>
    </html>
  );
}

export default AdminLayout;
