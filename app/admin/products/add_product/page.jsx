'use client';

import {
  Page,
  LegacyCard,
  InlineGrid,
  BlockStack,
  Card,
  Box,
  Divider,
  Bleed,
  TextField,
  DropZone,
  LegacyStack,
  Thumbnail,
  Text,
  FormLayout,
  Icon,
  Popover,
  ActionList,
  Grid,
  Collapsible,
  Button,
  TextContainer,
  OptionList,
} from '@shopify/polaris';

import {
  QuestionMarkMajor,
  PlusMinor,
  DragHandleMinor,
  DeleteMajor,
} from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';

function AddProduct() {
  const [files, setFiles] = useState([]);
  const [titleValue, setTitleValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [priceValue, setPriceValue] = useState('');
  const [compareAtPriceValue, setCompareAtPriceValue] = useState('');
  const [quantityValue, setQuantityValue] = useState('1');
  const [options, setOptions] = useState([{ name: '', values: [''] }]);

  const handleTitleChange = useCallback(
    (newValue) => setTitleValue(newValue),
    []
  );
  const handleDescriptionChange = useCallback(
    (newValue) => setDescriptionValue(newValue),
    []
  );
  const handlePriceChange = useCallback(
    (newValue) => setPriceValue(newValue),
    []
  );
  const handleCompareAtPriceChange = useCallback(
    (newValue) => setCompareAtPriceValue(newValue),
    []
  );
  const handleQuantityChange = useCallback(
    (newValue) => setQuantityValue(newValue),
    []
  );

  const handleAddOption = () => {
    setOptions([...options, { name: '', values: [''] }]);
  };

  const handleOptionNameChange = (index) => (newValue) => {
    const newOptions = [...options];
    newOptions[index].name = newValue;
    setOptions(newOptions);
  };

  const handleOptionValueChange = (optionIndex, valueIndex) => (newValue) => {
    const newOptions = [...options];
    newOptions[optionIndex].values[valueIndex] = newValue;
    setOptions(newOptions);

    // Check if the current option value being edited is the last one
    if (
      valueIndex === options[optionIndex].values.length - 1 &&
      newValue !== ''
    ) {
      // Add a new empty option value field
      newOptions[optionIndex].values.push('');
      setOptions(newOptions);
    }
  };

  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFiles((files) => [...files, ...acceptedFiles]),
    []
  );

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = !files.length && (
    <DropZone.FileUpload actionHint='Accepts images, videos' />
  );

  const uploadedFiles = files.length > 0 && (
    <LegacyStack vertical>
      {files.map((file, index) => (
        <LegacyStack alignment='center' key={index}>
          <Thumbnail
            size='small'
            alt={file.name}
            source={
              validImageTypes.includes(file.type)
                ? window.URL.createObjectURL(file)
                : NoteMinor
            }
          />
          <div>
            {file.name}{' '}
            <Text variant='bodySm' as='p'>
              {file.size} bytes
            </Text>
          </div>
        </LegacyStack>
      ))}
    </LegacyStack>
  );

  const [compareAtPopover, setCompareAtPopover] = useState(false);
  const [variantOptionPopover, setvariantOptionPopover] = useState(false);

  const handleTogglePopover = useCallback((popover) => {
    if (popover === 'popover1') setCompareAtPopover((open) => !open);
    if (popover === 'focused') setvariantOptionPopover(true);
    if (popover === 'popover2') setvariantOptionPopover((open) => !open);
  }, []);

  return (
    <Page backAction={{ content: 'Settings', url: '#' }} title='General'>
      <InlineGrid columns={{ xs: 1, lg: '2fr 1fr' }} gap='400'>
        <BlockStack gap='400'>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <TextField
                label='Title'
                placeholder='Short sleeve t-shirt'
                value={titleValue}
                onChange={handleTitleChange}
                autoComplete='off'
              />
              <TextField
                label='Description'
                value={descriptionValue}
                onChange={handleDescriptionChange}
                multiline={4}
                autoComplete='off'
              />
            </BlockStack>
          </Card>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <Text as='h2' variant='headingSm'>
                Media
              </Text>
              <DropZone onDrop={handleDropZoneDrop} variableHeight>
                {uploadedFiles}
                {fileUpload}
              </DropZone>
            </BlockStack>
          </Card>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <Text as='h2' variant='headingSm'>
                Pricing
              </Text>
              <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                  <TextField
                    label='Price'
                    value={priceValue}
                    onChange={handlePriceChange}
                    autoComplete='off'
                    prefix='₦'
                    placeholder='0.00'
                  />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                  <TextField
                    label='Compare-at price'
                    value={compareAtPriceValue}
                    onChange={handleCompareAtPriceChange}
                    autoComplete='off'
                    prefix='₦'
                    placeholder='0.00'
                    suffix={
                      <Popover
                        id='compare-at_price'
                        active={compareAtPopover}
                        activator={
                          <div
                            onMouseEnter={() => handleTogglePopover('popover1')}
                            onMouseLeave={() => handleTogglePopover('popover1')}
                          >
                            <Icon source={QuestionMarkMajor} tone='base' />
                          </div>
                        }
                        onClose={() => handleTogglePopover('popover1')}
                      >
                        <div className='max-w-64'>
                          <Card>
                            To display a markdown, enter a value higher than
                            your price. Often shown with a strikethrough.
                          </Card>
                        </div>
                      </Popover>
                    }
                  />
                </Grid.Cell>
              </Grid>
            </BlockStack>
          </Card>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <Text as='h2' variant='headingSm'>
                Inventory
              </Text>
              <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                  <TextField
                    label='Quantity'
                    type='number'
                    value={quantityValue}
                    onChange={handleQuantityChange}
                    autoComplete='off'
                  />
                </Grid.Cell>
              </Grid>
            </BlockStack>
          </Card>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <Text as='h2' variant='headingSm'>
                Variants
              </Text>
              <Collapsible
                open={open}
                id='basic-collapsible'
                transition={{
                  duration: '500ms',
                  timingFunction: 'ease-in-out',
                }}
                expandOnPrint
              >
                <Box borderColor='border' borderWidth='025' borderRadius='200'>
                  <ul>
                    {options.map((option, optionIndex) => (
                      <li key={optionIndex}>
                        <div className='grid grid-cols-variant gap-x-3 gap-y-1 p-4'>
                          <div className='col-start-2'>
                            <Text as='p' variant='bodyMd'>
                              Option name
                            </Text>
                          </div>
                          <button className='col-start-1 cursor-grab'>
                            <Icon source={DragHandleMinor} tone='base' />
                          </button>
                          <div className='col-start-2'>
                            <Popover
                              active={variantOptionPopover}
                              activator={
                                <TextField
                                  label='Option name'
                                  labelHidden
                                  value={option.name}
                                  autoComplete='off'
                                  onFocus={() => handleTogglePopover('focused')}
                                />
                              }
                              fullWidth
                              onClose={() => handleTogglePopover('popover2')}
                            >
                              <OptionList
                                onChange={handleOptionNameChange(optionIndex)}
                                options={[
                                  {
                                    value: 'Color',
                                    label: 'Color',
                                    active: false,
                                  },
                                  { value: 'Size', label: 'Size' },
                                  {
                                    value: 'Material',
                                    label: 'Material',
                                  },
                                  { value: 'Style', label: 'Style' },
                                ]}
                                selected={option.name}
                              />
                            </Popover>
                          </div>
                          <button className='col-start-3'>
                            <Icon source={DeleteMajor} tone='base' />
                          </button>
                        </div>
                        <div className='mb-4'>
                          <div className='flex flex-col gap-y-1'>
                            <div className='grid grid-cols-variant gap-x-3 px-5'>
                              <div className='col-start-2'>
                                <Text as='p' variant='bodyMd'>
                                  Option value
                                </Text>
                              </div>
                            </div>

                            {option.values.map((value, valueIndex) => (
                              <div
                                className='grid grid-cols-variant gap-x-3 gap-y-1 px-5'
                                key={valueIndex}
                              >
                                <button className='col-start-1 cursor-grab hidden justify-self-end'>
                                  <Icon source={DragHandleMinor} tone='base' />
                                </button>
                                <div className='col-start-2'>
                                  <TextField
                                    label='Option value'
                                    placeholder={
                                      valueIndex > 0
                                        ? 'Add another value'
                                        : 'Add Value'
                                    }
                                    labelHidden
                                    value={value}
                                    onChange={handleOptionValueChange(
                                      optionIndex,
                                      valueIndex
                                    )}
                                    autoComplete='off'
                                  />
                                </div>
                                <button className='col-start-3 hidden justify-self-start'>
                                  <Icon source={DeleteMajor} tone='base' />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className='grid grid-cols-variant gap-x-3 px-5 mt-4'>
                            <div className='col-start-2'>
                              <Button>Done</Button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Divider />
                  <div className='p-4'>
                    <Button
                      variant='plain'
                      size='slim'
                      textAlign='left'
                      onClick={handleAddOption}
                      ariaExpanded={open}
                      ariaControls='basic-collapsible'
                      icon={PlusMinor}
                    >
                      Add another option
                    </Button>
                  </div>
                </Box>
              </Collapsible>
              <Button
                variant='plain'
                textAlign='left'
                onClick={handleToggle}
                ariaExpanded={open}
                ariaControls='basic-collapsible'
                icon={PlusMinor}
              >
                Add options like size or colors
              </Button>
            </BlockStack>
          </Card>
        </BlockStack>
        <BlockStack gap={{ xs: '400', md: '200' }}>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <Box border='divider' borderRadius='base' minHeight='2rem' />
              <Box>
                <Bleed marginInline={{ xs: 400, sm: 500 }}>
                  <Divider />
                </Bleed>
              </Box>
              <Divider />
            </BlockStack>
          </Card>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <Box border='divider' borderRadius='base' minHeight='2rem' />
              <Box border='divider' borderRadius='base' minHeight='2rem' />
            </BlockStack>
          </Card>
        </BlockStack>
      </InlineGrid>
    </Page>
  );
}

export default AddProduct;
