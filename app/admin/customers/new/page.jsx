import { Page, Button, LegacyCard } from '@shopify/polaris';
import React from 'react';

function NewCustomer() {
  return (
    <Page
      backAction={{ content: 'Settings', url: '#' }}
      title='General'
      primaryAction={<Button variant='primary'>Save</Button>}
    >
      <LegacyCard title='Customer Overview' sectioned>
        <p>Credit card information</p>
      </LegacyCard>
    </Page>
  );
}

export default NewCustomer;
