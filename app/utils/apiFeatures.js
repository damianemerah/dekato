import { SYNONYMS } from '@/app/utils/synonyms';

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'q'];
    excludedFields.forEach((el) => delete queryObj[el]);

    this.query = this.query.find(queryObj);
    return this;
  }

  search() {
    if (this.queryString.q == null) {
      return this;
    }

    const rawQuery = this.queryString.q.trim();
    if (rawQuery === '') {
      this.query = this.query.find({ _id: null });
      return this;
    }

    // Optionally expand synonyms here if you want

    // Use MongoDB text search
    this.query = this.query
      .find({
        $text: { $search: rawQuery },
      })
      .sort({
        score: { $meta: 'textScore' },
      })
      .select({
        score: { $meta: 'textScore' },
      });

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
