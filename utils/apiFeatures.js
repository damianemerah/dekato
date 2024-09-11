class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "q"];
    excludedFields.forEach((el) => delete queryObj[el]);

    this.query = this.query.find(queryObj);
    return this;
  }

  search() {
    if (this.queryString.q) {
      const searchQuery = this.queryString.q.trim();
      const searchWords = searchQuery.split(" ").map((word) => word.trim());

      // Construct a regex pattern that checks if each word in the query appears at the start of words
      const regexPattern = searchWords.map((word) => `\\b${word}`).join(".*");

      this.query = this.query.find({
        $or: [
          { name: { $regex: regexPattern, $options: "i" } },
          { description: { $regex: regexPattern, $options: "i" } },
          { tag: { $elemMatch: { $regex: regexPattern, $options: "i" } } },
        ],
      });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
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
