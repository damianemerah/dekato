import { Card, Text, TextField, Box } from '@shopify/polaris';
import { useState, useCallback } from 'react';

export function ProductOrganization() {
  const [value, setValue] = useState('');

  const handleChange = useCallback((newValue) => setValue(newValue), []);

  return (
    <Card roundedAbove='sm'>
      <Text as='h2' variant='headingSm'>
        Product Organisation
      </Text>
      <Box paddingBlock='200'>
        <TextField
          label='Product Type'
          value={value}
          onChange={handleChange}
          autoComplete='off'
        />
      </Box>
      <Box paddingBlock='200'>
        <TextField
          label='Vendor'
          value={value}
          onChange={handleChange}
          autoComplete='off'
        />
      </Box>
      <Box paddingBlock='200'>
        <TextField
          label='Collection'
          value={value}
          onChange={handleChange}
          autoComplete='off'
        />
      </Box>
      <Box paddingBlock='200'>
        <TextField
          label='Tags'
          value={value}
          onChange={handleChange}
          autoComplete='off'
        />
      </Box>
    </Card>
  );
}
