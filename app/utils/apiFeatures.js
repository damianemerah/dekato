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
      // Split and clean search words
      const searchWords = searchQuery
        .split(/\s+/)
        .map((word) => word.trim())
        .filter((word) => word.length > 0);

      if (searchWords.length === 0) return this;

      // Create a simple regex pattern that allows partial matches
      const regexPatterns = searchWords.map(
        (word) => `\\b${word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}`,
      );
      const pattern = regexPatterns.join(".*");

      this.query = this.query.find({
        $or: [
          { name: { $regex: pattern, $options: "i" } },
          { description: { $regex: pattern, $options: "i" } },
          { tag: { $elemMatch: { $regex: pattern, $options: "i" } } },
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
