'use client';

import { useState, useRef, useEffect } from 'react';
import MediaUpload from '@/app/admin/ui/MediaUpload';
import { createCategory, updateCategory } from '@/app/action/categoryAction';
import { ButtonPrimary } from '@/app/components/button';
import { Checkbox, message } from 'antd';
import { getFiles } from '@/app/admin/utils/utils';
import DropDown from '@/app/admin/ui/DropDown';
import { getAllCategories } from '@/app/action/categoryAction';
import useSWR, { mutate } from 'swr';
import { SmallSpinner } from '@/app/components/spinner';
import dynamic from 'next/dynamic';

const TextEditor = dynamic(() => import('@/app/components/text-editor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[120px] rounded-md border p-4">Loading editor...</div>
  ),
});

export default function NewCategory({ categoryId }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [cParent, setCParent] = useState(null);
  const [actionType, setActionType] = useState('');
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [isPinned, setIsPinned] = useState(false);
  const [description, setDescription] = useState('');

  const titleRef = useRef(null);
  const pinnedRef = useRef(null);

  const { data: allCategories, isLoading } = useSWR(
    '/api/allCategories',
    () => getAllCategories({ limit: 100 }),
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (isLoading) return;
    if (allCategories?.data?.length > 0) {
      const category = allCategories?.data
        .map((cat) => ({
          value: cat.id,
          label: (
            <p>
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}{' '}
              {cat.parent?.name
                ? `(${cat.parent.name.charAt(0).toUpperCase() + cat.parent.name.slice(1)})`
                : ''}
            </p>
          ),
          parent: cat.parent,
          disabled: cat.parent !== null,
        }))
        .sort((a, b) => a.disabled - b.disabled);

      setCatList(category);
    }
    if (categoryId !== 'new' && allCategories?.data.length) {
      const selectedCategory = allCategories?.data.find((category) => {
        return category.id === categoryId;
      });

      if (selectedCategory) {
        setActionType('edit');
        setSelectedCategory(selectedCategory);
        setIsPinned(selectedCategory.pinned || false);
      } else {
        window.location.href = '/admin/categories';
      }
    } else if (categoryId === 'new') {
      setActionType('create');
      setCParent(null);
      setIsPinned(false);
    }
  }, [allCategories?.data, isLoading, categoryId]);

  useEffect(() => {
    if (selectedCategory) {
      selectedCategory.parent && setCParent(selectedCategory?.parent.id);
      const selectedImgs = selectedCategory.image.map((img, index) => ({
        uid: index,
        name: 'image.png',
        status: 'done',
        url: img,
      }));
      setDefaultFileList(selectedImgs);

      if (titleRef.current) titleRef.current.value = selectedCategory?.name;
      setDescription(selectedCategory?.description || '');
      if (pinnedRef.current)
        pinnedRef.current.checked = selectedCategory?.pinned;
      setIsPinned(selectedCategory?.pinned || false);
    }
  }, [selectedCategory]);

  // Handle form submission
  const handleCreateCategory = async (formData, type) => {
    try {
      if (formData.get('pinned') === 'true') {
        formData.set('pinned', true);
      } else {
        formData.set('pinned', false);
      }
      const medias = getFiles(fileList);
      medias.images.forEach((file) => {
        formData.append('image', file);
      });
      medias.videos.forEach((file) => {
        formData.append('video', file);
      });

      if (cParent?.length > 0) {
        formData.append('parent', cParent);
      }
      formData.append('description', description);

      // Ensure top-level categories cannot be pinned
      if (!cParent) {
        formData.set('pinned', false);
      }

      // Check the number of pinned categories under the selected parent
      const parentCategory = allCategories?.data.find(
        (cat) => cat.id === cParent
      );
      const pinnedCount = allCategories?.data.filter(
        (cat) => cat.parent?.id === cParent && cat.pinned
      ).length;
      const isAlreadyPinned = selectedCategory?.pinned;
      if (pinnedCount >= 5 && !isAlreadyPinned) {
        message.error(
          `Cannot pin more than 5 categories under ${parentCategory.name}`
        );
        return;
      }

      if (type === 'edit') {
        const id = allCategories?.data.find(
          (category) => category.id === categoryId
        ).id;
        formData.append('id', id);

        // Prevent category from using itself as a parent
        if (cParent === id) {
          message.warning('A category cannot be its own parent.');
          return;
        }

        const updatedCategory = await updateCategory(formData);

        if (updatedCategory.error) {
          message.error(updatedCategory.message);
          return;
        }

        message.success('Category updated');
        titleRef.current.value = '';
        setDescription('');

        return;
      }

      const newCategory = await createCategory(formData);
      if (newCategory.error) {
        message.error(newCategory.message);
        return;
      }
      mutate('/api/allCategories');
      message.success('Category created');
      titleRef.current.value = '';
      setDescription('');
      setFileList([]);
    } catch (error) {
      message.error(error.message);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex h-screen items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );

  if (!allCategories?.data) return <LoadingSpinner />;

  return (
    <form
      action={(formData) => handleCreateCategory(formData, actionType)}
      className="px-3 py-12 md:px-8"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}
    >
      <div className="mx-auto grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="shadow-shadowSm mb-4 rounded-lg bg-white p-4 lg:col-span-2">
          <div className="mb-4">
            <label
              htmlFor="title"
              className="text-xxs mb-1 block font-bold tracking-[0.12em] text-primary"
            >
              TITLE
            </label>
            <input
              ref={titleRef}
              type="text"
              name="name"
              required
              id="title"
              autoComplete="off"
              placeholder="Short sleeve t-shirt"
              className="shadow-shadowSm hover:border-grayOutline block w-full rounded-md px-3 py-3 text-sm hover:border"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="text-xxs mb-1 block font-bold tracking-[0.12em] text-primary"
            >
              DESCRIPTION
            </label>
            <TextEditor
              value={description}
              onChange={setDescription}
              name="description"
            />
          </div>
        </div>
        <div>
          <div className="shadow-shadowSm mb-6 rounded-lg bg-white p-6">
            <MediaUpload
              multiple={false}
              fileList={fileList}
              setFileList={setFileList}
              defaultFileList={defaultFileList}
              setDefaultFileList={setDefaultFileList}
            />
          </div>

          <div className="shadow-shadowSm mb-4 rounded-lg bg-white p-4">
            <div
              className={`${!cParent ? 'hidden' : ''} mb-4 flex items-center gap-2`}
            >
              <h4
                className="text-xxs block font-bold leading-none tracking-[0.12em] text-primary"
                title="Pinned categories can be featured on the homepage"
              >
                PINNED
              </h4>

              <Checkbox
                ref={pinnedRef}
                name="pinned"
                value="true"
                checked={isPinned}
                onChange={() => setIsPinned(!isPinned)}
              />
            </div>
            <h4 className="text-xxs mb-1 block font-bold uppercase tracking-[0.12em] text-primary">
              Parent Category
            </h4>
            <DropDown
              options={catList}
              selectedKeys={[cParent]}
              handleChange={(value) => {
                if (value === selectedCategory?.id) {
                  message.warning('A category cannot be its own parent.');
                  return;
                }
                setCParent(value);
              }}
            />
          </div>
          <ButtonPrimary
            type="submit"
            loading={isLoading}
            className={`mb-4 ml-auto flex w-full items-center justify-center !rounded-md bg-blue-500 px-2 text-right text-base font-bold tracking-wide text-white`}
          >
            {actionType === 'edit' ? 'Update category' : 'Create category'}
          </ButtonPrimary>
        </div>
      </div>
    </form>
  );
}
