// needs work

// import all models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id'
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'product_id'
});

// Products belongToMany Tags (through ProductTag): tbd = to be defined ***
Product.belongsToMany(Tag, {
  through: ProductTag,
  as: 'tbd',
  foreignKey: 'tbd'
});

// Tags belongToMany Products (through ProductTag): tbd = to be defined ***
Tag.belongsToMany(Product, {
  through: ProductTag,
  as: 'tbd',
  foreignKey: 'tbd'
});



module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};