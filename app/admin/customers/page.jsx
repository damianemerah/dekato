'use client';
import {
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  Badge,
  Page,
} from '@shopify/polaris';
import { useState, useCallback } from 'react';

function Customers() {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings, setItemStrings] = useState([
    'All',
    'Unpaid',
    'Open',
    'Closed',
    'Local delivery',
    'Local pickup',
  ]);

  const [selected, setSelected] = useState(0);

  const sortOptions = [
    { label: 'Order', value: 'order asc', directionLabel: 'Ascending' },
    { label: 'Order', value: 'order desc', directionLabel: 'Descending' },
    { label: 'Customer', value: 'customer asc', directionLabel: 'A-Z' },
    { label: 'Customer', value: 'customer desc', directionLabel: 'Z-A' },
    { label: 'Date', value: 'date asc', directionLabel: 'A-Z' },
    { label: 'Date', value: 'date desc', directionLabel: 'Z-A' },
    { label: 'Total', value: 'total asc', directionLabel: 'Ascending' },
    { label: 'Total', value: 'total desc', directionLabel: 'Descending' },
  ];
  const [sortSelected, setSortSelected] = useState(['order asc']);
  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {};

  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };

  const [queryValue, setQueryValue] = useState('');

  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    []
  );

  const customers = [
    {
      id: '1020',
      customer: 'Jaydon Stanton',
      email: <Badge>Not subscribed</Badge>,
      location: 'Lagos Nigeria',
      orders: 3,
      amountSpent: '$969.44',
    },
    {
      id: '1019',
      customer: 'Ruben Westerfelt',
      email: <Badge>Not subscribed</Badge>,
      location: 'Lagos Nigeria',
      orders: 3,
      amountSpent: '$701.19',
    },
    {
      id: '1018',
      customer: 'Leo Carder',
      email: <Badge tone='success'>Subscribed</Badge>,
      location: 'Lagos Nigeria',
      orders: 5,
      amountSpent: '$798.24',
    },
  ];
  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(customers);

  const rowMarkup = customers.map(
    ({ id, customer, email, location, orders, amountSpent }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>{customer}</IndexTable.Cell>
        <IndexTable.Cell>{email}</IndexTable.Cell>
        <IndexTable.Cell>{location}</IndexTable.Cell>
        <IndexTable.Cell>{orders}</IndexTable.Cell>
        <IndexTable.Cell>{amountSpent}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Page
      fullWidth
      title={'Customers'}
      primaryAction={{ content: 'Add customers' }}
      secondaryActions={[
        {
          content: 'Export',
          accessibilityLabel: 'Export customers list',
          onAction: () => alert('Export action'),
        },
        {
          content: 'Import',
          accessibilityLabel: 'Import customers list',
          onAction: () => alert('Import action'),
        },
      ]}
    >
      <LegacyCard>
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder='Searching in all'
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => setQueryValue('')}
          onSort={setSortSelected}
          primaryAction=''
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={[]}
          mode={mode}
          setMode={setMode}
          hideFilters
          filteringAccessibilityTooltip='Search (F)'
        />
        <IndexTable
          resourceName={resourceName}
          itemCount={customers.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: 'Customer' },
            { title: 'Email' },
            { title: 'Location' },
            { title: 'Orders' },
            { title: 'Amount spent' },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>
    </Page>
  );
}

export default Customers;
