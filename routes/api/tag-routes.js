const router = require("express").Router();
const { Tag, Product, ProductTag, Category } = require("../../models");

// The `/api/tags` endpoint


// find all tags
  // be sure to include its associated Product data
router.get("/", (req, res) => {
  Tag.findAll()
    .then((dbTagData) => res.json(dbTagData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

  // find a single tag by its `id`
  // be sure to include its associated Product data
router.get("/:id", (req, res) => {

  Tag.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "tag_name"[
        (sequelize.literal(
          "(SELECT COUNT(*) FROM category WHERE id = tag_id)"
        ),
        "tag_count")
      ],
    ],
    include: [
      {
        model: Category,
        attributes: ["id", "category_name"],
        include: {
          model: Product,
          attributes: ["id"],
        },
      },
      {
        model: ProductTag,
        attributes: ["id"],
      },
    ],
  })
    .then((dbCategoryData) => {
      if (!dbCategoryData) {
        res.status(404).json({ message: "No Category found with this id" });
        return;
      }
      res.json(dbCategoryData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });

});



// // create a new tag
// router.post("/", (req, res) => {
//   Tag.create({
//     comment_text: req.body.comment_text,
//     id: req.body.id,
//   })
//     .then((dbTagData) => res.json(dbTagData))
//     .catch((err) => {
//       console.log(err);
//       res.status(400).json(err);
//     });

// });

// update a tag's name by its `id` value
router.put("/:id", (req, res) => {

  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      // find all associated tags from ProductTag
      return Product.findAll({ where: { product_id: req.params.id } });
    })
    // this feels wrong (?????); used same code from product-routes.js
    .then((Tags) => {
      // get list of current tag_ids
      const TagIds = Tags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newTags = req.body.tagIds
        .filter((tag_id) => !TagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const TagsToRemove = Tags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        Tag.destroy({ where: { id: TagsToRemove } }),
        Tag.bulkCreate(newTags),
      ]);
    })
    .then((updatedTags) => res.json(updatedTags))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// delete on tag by its `id` value
router.delete("/:id", (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbTagData) => {
      if (!dbTagData) {
        res.status(404).json({ message: "No Tag found with this id" });
        return;
      }
      res.json(dbTagData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;