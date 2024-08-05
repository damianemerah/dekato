"use client";

import {
  Card,
  ChoiceList,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  IndexTable,
  Page,
  Thumbnail,
  Button,
} from "@shopify/polaris";
import Link from "next/link";

import { useState, useCallback } from "react";

// This example is for guidance purposes. Copying it will come with caveats.
function Collections() {
  function disambiguateLabel(key, value) {
    switch (key) {
      case "type":
        return value.map((val) => `type: ${val}`).join(", ");
      case "tone":
        return value.map((val) => `tone: ${val}`).join(", ");
      default:
        return value;
    }
  }
  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }

  const [itemStrings, setItemStrings] = useState(["All"]);
  const deleteView = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };
  const duplicateView = async (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    return true;
  };
  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onAction: () => {},
              onPrimaryAction: async (value) => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (name) => {
                duplicateView(name);
                return true;
              },
            },
            {
              type: "edit",
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                deleteView(index);
                return true;
              },
            },
          ],
  }));
  const [selected, setSelected] = useState(0);
  const onCreateNewView = async (value) => {
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };
  const sortOptions = [
    { label: "Product", value: "product asc", directionLabel: "Ascending" },
    { label: "Product", value: "product desc", directionLabel: "Descending" },
    { label: "Status", value: "tone asc", directionLabel: "A-Z" },
    { label: "Status", value: "tone desc", directionLabel: "Z-A" },
    { label: "Type", value: "type asc", directionLabel: "A-Z" },
    { label: "Type", value: "type desc", directionLabel: "Z-A" },
    { label: "Vendor", value: "vendor asc", directionLabel: "Ascending" },
    { label: "Vendor", value: "vendor desc", directionLabel: "Descending" },
  ];
  const [sortSelected, setSortSelected] = useState(["product asc"]);
  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {};
  const onHandleSave = async () => {
    return true;
  };
  const primaryAction =
    selected === 0
      ? {
          type: "save-as",
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };
  const [tone, setStatus] = useState(undefined);
  const [type, setType] = useState(undefined);
  const [queryValue, setQueryValue] = useState("");
  const handleStatusChange = useCallback((value) => setStatus(value), []);
  const handleTypeChange = useCallback((value) => setType(value), []);
  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    [],
  );
  const handleStatusRemove = useCallback(() => setStatus(undefined), []);
  const handleTypeRemove = useCallback(() => setType(undefined), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleStatusRemove();
    handleTypeRemove();
    handleQueryValueRemove();
  }, [handleStatusRemove, handleQueryValueRemove, handleTypeRemove]);
  const filters = [
    {
      key: "tone",
      label: "Status",
      filter: (
        <ChoiceList
          title="tone"
          titleHidden
          choices={[
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
            { label: "Archived", value: "archived" },
          ]}
          selected={tone || []}
          onChange={handleStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "type",
      label: "Type",
      filter: (
        <ChoiceList
          title="Type"
          titleHidden
          choices={[
            { label: "Brew Gear", value: "brew-gear" },
            { label: "Brew Merch", value: "brew-merch" },
          ]}
          selected={type || []}
          onChange={handleTypeChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
  ];
  const appliedFilters = [];
  if (tone && !isEmpty(tone)) {
    const key = "tone";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, tone),
      onRemove: handleStatusRemove,
    });
  }
  if (type && !isEmpty(type)) {
    const key = "type";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, type),
      onRemove: handleTypeRemove,
    });
  }
  const collections = [
    {
      id: "1020",
      title: "1ZPRESSO | J-MAX Manual Coffee Grinder",
      products: "12",
      productConditions: "Espresso Shot Coffee",
    },
    {
      id: "1018",
      title: "Acaia Pearl Set",
      products: "12",
      productConditions: "Espresso Shot Coffee",
    },
    {
      id: "1016",
      title: "AeroPress Go Brewer",
      products: "12",
      productConditions: "Espresso Shot Coffee",
    },
    {
      id: "1015",
      title: "Canadiano Brewer",
      products: "12",
      productConditions: "Espresso Shot Coffee",
    },
    {
      id: "1014",
      title: "Canadiano Brewer White Ash",
      products: "12",
      productConditions: "Espresso Shot Coffee",
    },
  ];
  const resourceName = {
    singular: "collection",
    plural: "collections",
  };
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(collections);
  const rowMarkup = collections.map(
    ({ id, title, products, productConditions }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Thumbnail
            source={"https://picsum.photos/50?random=" + String(index)}
            size="small"
            alt={"product thumbnail" + title}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>{title}</IndexTable.Cell>
        <IndexTable.Cell>{products}</IndexTable.Cell>
        <IndexTable.Cell>{productConditions}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );
  return (
    <Page
      fullWidth
      title={"Collections"}
      primaryAction={
        <Link href="/admin/collections/new">
          <Button variant="primary">Create collection</Button>
        </Link>
      }
    >
      <Card padding="0">
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => {}}
          onSort={setSortSelected}
          primaryAction={primaryAction}
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView
          onCreateNewView={onCreateNewView}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
        />
        <IndexTable
          resourceName={resourceName}
          itemCount={collections.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          sortable={[false, true, true, true, true, true, true]}
          headings={[
            { title: "" },
            { title: "Title" },
            { title: "Products" },
            { title: "Products conditions" },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
    </Page>
  );
}

export default Collections;
