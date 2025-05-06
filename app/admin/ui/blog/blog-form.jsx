'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  message,
  Typography,
  Space,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { createBlog, updateBlog } from '@/app/action/blogAction';
import { getAllCategories } from '@/app/action/categoryAction';
import useSWR from 'swr';
import MediaUpload from '@/app/admin/ui/MediaUpload';

const { Title } = Typography;
const { TextArea } = Input;

// Dynamically import the text editor to avoid SSR issues
const TextEditor = dynamic(() => import('@/app/components/text-editor'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] animate-pulse rounded-md bg-gray-100"></div>
  ),
});

const PreviewTab = ({ content, title, excerpt }) => {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <h1 className="mb-4 text-4xl font-bold">{title}</h1>
      <p className="mb-8 text-xl text-gray-600">{excerpt}</p>
      <TextEditor value={content} preview={true} onChange={() => {}} />
    </div>
  );
};

export default function BlogForm({ initialData }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState(initialData?.content || '');
  const [fileList, setFileList] = useState([]);
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [defaultCategoriesList, setDefaultCategoriesList] = useState([]);
  const [activeTab, setActiveTab] = useState('edit');

  const { data: categories } = useSWR('/api/categories', () =>
    getAllCategories({ limit: 100 })
  );

  useEffect(() => {
    if (initialData?.featuredImage) {
      setDefaultFileList([
        {
          uid: '-1',
          name: 'Featured Image',
          status: 'done',
          url: initialData.featuredImage,
        },
      ]);
    }
    if (initialData?.categories) {
      setDefaultCategoriesList(
        initialData.categories.map((cat) => ({
          value: cat._id || cat.id,
          label: cat.name,
        }))
      );
    }
  }, [initialData]);

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          if (key === 'categories' || key === 'tags') {
            formData.append(key, JSON.stringify(values[key]));
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      // Append content from rich text editor
      formData.append('content', content);

      // Handle featured image
      if (fileList.length > 0) {
        if (fileList[0].originFileObj) {
          formData.append('featuredImage', fileList[0].originFileObj);
        } else {
          formData.append('featuredImage', fileList[0].url);
        }
      }

      if (!initialData || initialData.status === 'draft') {
        if (formData.get('status') === 'published') {
          formData.append('publishedAt', new Date());
        }
      }

      if (initialData) {
        const id = initialData.id;
        await updateBlog(id, formData);
        message.success('Blog updated successfully');
      } else {
        const data = await createBlog(formData);
        message.success('Blog created successfully');
        router.push(`/admin/blogs/${data.id}`);
      }
    } catch (error) {
      message.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-3 py-12 md:px-8">
      <Card>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/blogs">
              <Button
                icon={<ArrowLeftOutlined />}
                className="flex items-center justify-center"
              />
            </Link>
            <Title level={2} className="!mb-0 text-xl sm:text-2xl">
              {initialData ? 'Edit Blog' : 'Create New Blog'}
            </Title>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              onClick={() =>
                setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')
              }
              className="w-full sm:w-auto"
            >
              {activeTab === 'edit' ? 'Preview' : 'Edit'}
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={isSubmitting}
              className="w-full sm:w-auto"
            >
              {initialData ? 'Update' : 'Publish'}
            </Button>
          </div>
        </div>

        {activeTab === 'preview' ? (
          <PreviewTab
            content={content}
            title={form.getFieldValue('title')}
            excerpt={form.getFieldValue('excerpt')}
          />
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              ...initialData,
              categories: initialData?.categories?.map(
                (cat) => cat._id || cat.id
              ),
            }}
          >
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[{ required: true, message: 'Please enter a title' }]}
                >
                  <Input placeholder="Enter blog title" />
                </Form.Item>

                <Form.Item
                  name="excerpt"
                  label="Excerpt"
                  rules={[
                    { required: true, message: 'Please enter an excerpt' },
                  ]}
                >
                  <TextArea
                    placeholder="Enter a brief excerpt"
                    rows={3}
                    maxLength={500}
                    showCount
                  />
                </Form.Item>

                <Form.Item label="Content" required>
                  <TextEditor value={content} onChange={setContent} />
                </Form.Item>
              </div>

              <div className="space-y-6">
                <Card title="Publishing" size="small">
                  <Form.Item name="status" label="Status">
                    <Select
                      options={[
                        { value: 'draft', label: 'Draft' },
                        { value: 'published', label: 'Published' },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item name="author" label="Author">
                    <Input placeholder="Enter author name" />
                  </Form.Item>
                </Card>

                <Card title="Featured Image" size="small">
                  <MediaUpload
                    multiple={false}
                    fileList={fileList}
                    setFileList={setFileList}
                    defaultFileList={defaultFileList}
                    setDefaultFileList={setDefaultFileList}
                  />
                </Card>

                <Card title="Categories & Tags" size="small">
                  <Form.Item name="categories" label="Categories">
                    <Select
                      mode="multiple"
                      placeholder="Select categories"
                      options={categories?.data?.map((cat) => ({
                        value: cat._id || cat.id,
                        label: cat.name,
                      }))}
                      defaultValue={defaultCategoriesList?.map(
                        (item) => item.value
                      )}
                    />
                  </Form.Item>

                  <Form.Item name="tags" label="Tags">
                    <Select
                      mode="tags"
                      placeholder="Add tags"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Card>

                <Card title="SEO" size="small">
                  <Form.Item name="metaTitle" label="Meta Title">
                    <Input
                      placeholder="Enter meta title"
                      maxLength={60}
                      showCount
                    />
                  </Form.Item>

                  <Form.Item name="metaDescription" label="Meta Description">
                    <TextArea
                      placeholder="Enter meta description"
                      rows={3}
                      maxLength={160}
                      showCount
                    />
                  </Form.Item>
                </Card>
              </div>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
}
