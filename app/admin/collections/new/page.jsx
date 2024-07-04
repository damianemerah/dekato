'use client';

import {
  Page,
  InlineGrid,
  BlockStack,
  Card,
  Text,
  TextField,
  RadioButton,
} from '@shopify/polaris';
import React, { useState, useCallback } from 'react';
import FileUploadComponent from '@/app/admin/ui/collections/FileUploadComponent';
function NewCollection() {
  const [value, setValue] = useState('disabled');

  const handleChange = useCallback((_, newValue) => setValue(newValue), []);

  return (
    <Page
      backAction={{ content: 'Customers', url: '/admin/collections' }}
      title='Create collection'
    >
      <InlineGrid columns={{ xs: 1, md: '2fr 1fr' }} gap='400'>
        <BlockStack gap='400'>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <TextField
                label='Title'
                value={''}
                onChange={''}
                placeholder='e.g Summer collection'
                autoComplete='off'
              />
              <TextField
                label='Description'
                value={'descriptionValue'}
                onChange={''}
                multiline={6}
                autoComplete='off'
              />
            </BlockStack>
          </Card>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <Text as='h2' variant='headingSm'>
                Collection type
              </Text>
              <RadioButton
                label='Manual'
                helpText='Add products to this collection one by one. Learn more about manual collections.'
                checked={value === 'disabled'}
                id='disabled'
                name='accounts'
                onChange={handleChange}
              />
              <RadioButton
                label='Automated'
                helpText='Existing and future products that match the conditions you set will automatically be added to this collection. Learn more about automated collections.'
                id='optional'
                name='accounts'
                checked={value === 'optional'}
                onChange={handleChange}
              />
            </BlockStack>
          </Card>
        </BlockStack>
        <BlockStack gap={{ xs: '400', md: '200' }}>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <Text as='h2' variant='headingSm'>
                Image
              </Text>
              <FileUploadComponent />
            </BlockStack>
          </Card>
        </BlockStack>
      </InlineGrid>
    </Page>
  );
}

export default NewCollection;
