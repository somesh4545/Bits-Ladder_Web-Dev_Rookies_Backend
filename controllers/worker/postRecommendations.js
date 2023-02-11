const Workers = require("../../models/workers");
const Posts = require("../../models/post");

const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { default: mongoose } = require("mongoose");

const workerPostRecommendations = catchAsyncErrors(async (req, res) => {
  const { id: worker_id } = req.params;

  const worker = await Workers.findOne({ _id: worker_id }).select("skills");
  if (worker) {
    const { title, sort, numericFilters, skills, fields, location, radius } =
      req.query;
    const queryObject = {};
    var skillsArr = worker.skills;
    if (skills) {
      skillsArr = skills.split(",");
      queryObject.category = { $in: skillsArr };
    } else {
      queryObject.category = { $in: skillsArr };
      // use from the worker object for sorting them
    }

    if (title) queryObject.name = { $regex: title, $options: "i" };
    if (numericFilters) {
      const operatorMap = {
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
        "<": "$lt",
        "<=": "$lte",
      };
      const regEx = /\b(<|>|>=|=|<|<=)\b/g;
      let filters = numericFilters.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      );

      const options = ["createdAt", "minBudget", "maxBudget"];
      filters = filters.split(",").forEach((item) => {
        const [filed, operator, value] = item.split("-");
        if (options.includes(filed)) {
          queryObject[filed] = { [operator]: Number(value) };
        }
      });
    }

    let result;

    if (location) {
      let cord = location.split(",");

      let skillsObjectIdArray = skillsArr.map(
        (s) => new mongoose.Types.ObjectId(s)
      );

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      cord = cord.map((s) => parseFloat(s));

      result = Posts.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: cord,
            },
            key: "location",
            maxDistance: radius != null ? radius * 1069 : 10 * 1069,
            distanceField: "dist.calculated",
            sperical: true,
            query: {
              category: {
                $in: skillsObjectIdArray,
              },
              isOpen: true,
            },
          },
        },
        { $limit: skip + limit },
        { $skip: skip },
      ]);

      const posts = await result;

      res.status(200).json({ data: posts, count: posts.length });
    } else {
      queryObject.isOpen = true;

      result = Posts.find(queryObject);
      // sorting features
      if (sort) {
        const sortList = sort.split(",").join(" ");
        result = result.sort(sortList);
      } else {
        result = result.sort("createdAt");
      }

      // selecting required fields
      if (fields) {
        const fieldsList = fields.split(",").join(" ");
        result = result.select(fieldsList);
      }

      // pagination
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      result = result.skip(skip).limit(limit);

      const posts = await result;
      // console.log(queryObject);
      res.status(200).json({ data: posts, count: posts.length, page, limit });
    }
  } else {
    res.status(404).json({ success: false, message: "Invalid worker ID" });
  }
});

module.exports = {
  workerPostRecommendations,
};
