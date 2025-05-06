'use server';

import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import dbConnect from '@/app/lib/mongoConnection';
import Blog from '@/models/blog';
import handleAppError from '@/app/utils/appError';
import { formDataToObject } from '@/app/utils/filterObj';
import { uploadFiles } from '@/app/lib/s3Func';
import { restrictTo } from '@/app/utils/checkPermission';

const toObject = (data) => {
  if (typeof data.categories === 'string') {
    try {
      data.categories = JSON.parse(data.categories);
    } catch (err) {
      console.error('Error parsing categories:', err);
      data.categories = [];
    }
  }

  if (typeof data.tags === 'string') {
    try {
      data.tags = JSON.parse(data.tags);
    } catch (err) {
      console.error('Error parsing tags:', err);
      data.tags = [];
    }
  }
};

export async function createBlog(formData) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const data = formDataToObject(formData);

    const { featuredImage } = data;
    if (featuredImage) {
      const imageData = new FormData();
      imageData.append('file', featuredImage);
      const [imageUrl] = await uploadFiles(imageData, 'blog');
      data.featuredImage = imageUrl;
    }

    toObject(data);

    const blog = await Blog.create(data);

    revalidatePath('/blog');
    revalidatePath('/fashion');
    revalidatePath('/admin/blog');
    return { id: blog._id.toString(), ...blog.toObject() };
  } catch (err) {
    console.error('Create blog error:', err);
    const error = handleAppError(err);
    throw new Error(error.message || 'Failed to create blog post');
  }
}

export async function updateBlog(id, formData) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const data = formDataToObject(formData);
    const { featuredImage } = data;
    if (featuredImage && featuredImage.size > 0) {
      const imageData = new FormData();
      imageData.append('file', featuredImage);
      const [imageUrl] = await uploadFiles(imageData, 'blog');
      data.featuredImage = imageUrl;
    }
    toObject(data);
    const blog = await Blog.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    );

    if (!blog) {
      throw new Error('Blog post not found');
    }

    revalidatePath('/blog');
    revalidatePath('/fashion');
    revalidatePath('/admin/blog');
    revalidatePath(`/blog/${blog.slug}`);
    return { id: blog._id.toString(), ...blog.toObject() };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || 'Failed to update blog post');
  }
}

export async function getBlog(id) {
  await dbConnect();

  try {
    const blog = await Blog.findById(id)
      .populate('author', 'name email')
      .populate('categories', 'name slug _id')
      .lean();

    if (!blog) {
      throw new Error('Blog post not found');
    }

    const formattedBlog = {
      id: blog._id.toString(),
      ...blog,
      categories: blog.categories?.map((cat) => ({
        id: cat._id.toString(),
        _id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
      })),
    };

    return formattedBlog;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || 'Failed to fetch blog post');
  }
}

// Cached server action for blog fetching
export const getAllBlogs = cache(
  async ({ page = 1, limit = 10, status, category, tag, search } = {}) => {
    await dbConnect();

    try {
      const query = {};

      if (status) {
        query.status = status;
      }

      if (category) {
        query.categories = category;
      }

      if (tag) {
        query.tags = tag;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (page - 1) * limit;

      const [blogs, total] = await Promise.all([
        Blog.find(query)
          .populate('author', 'name email')
          .populate('categories', 'name slug')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Blog.countDocuments(query),
      ]);

      const blogsWithId = blogs.map((blog) => ({
        ...blog,
        id: blog._id.toString(),
        _id: blog._id.toString(), // Ensure consistent ID format
        categories: blog.categories?.map((cat) => ({
          ...cat,
          id: cat._id.toString(),
          _id: cat._id.toString(),
        })),
      }));

      return {
        data: blogsWithId,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      console.error('Error fetching blogs:', err);
      throw new Error(err.message || 'Failed to fetch blog posts');
    }
  }
);

export async function deleteBlog(id) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      throw new Error('Blog post not found');
    }

    revalidatePath('/blog');
    revalidatePath('/fashion');
    revalidatePath('/admin/blog');
    return null;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || 'Failed to delete blog post');
  }
}

export async function getBlogBySlug(slug) {
  await dbConnect();

  try {
    const blog = await Blog.findOne({ slug })
      .populate('author', 'name email')
      .populate('categories', 'name slug _id')
      .lean();

    if (!blog) {
      return null;
    }

    const formattedBlog = {
      id: blog._id.toString(),
      ...blog,
      categories: blog.categories?.map((cat) => ({
        id: cat._id.toString(),
        _id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
      })),
    };

    return formattedBlog;
  } catch (err) {
    console.error('Error fetching blog by slug:', err);
    throw new Error(err.message || 'Failed to fetch blog post');
  }
}
