const Product = require("../models/productmodels");
const Errorhandler = require("../utils/errrorhandeler");
const catchAsyncErrors = require("../middelware/catchAsyncerror");
const ApiFeatures = require("../utils/apifeatures");

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

exports.getAllproducts = catchAsyncErrors(async (req, res) => {
  const resultperpage = 5;
  const productCount = await Product.countDocuments();

  const apifeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
    
  let products = await apifeatures.query;
  let filterdProductsCount = products.length;
  apifeatures.pagination(resultperpage);

  //products = await apifeatures.query;

  res.status(200).json({
    success: true,
    products,
    productCount,
    resultperpage,
    filterdProductsCount,
  });
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindandModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
    
  });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});
