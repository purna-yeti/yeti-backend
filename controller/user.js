// const Product = require('../model/product');
// const Page = require('../model/page');

// const { smartTrim, enlargePhoto } = require('../helpers/product');

exports.createProfile = (req, res, next) => {
    //at end of for loop
    res.status(201).json({
      address: "jakarta"
    }); 
};

exports.updateProfile = (req, res, next) => {
  //at end of for loop
  res.status(201).json({
    address: "jakarta"
  }); 
};

exports.getProfile = (req, res, next) => {
  //at end of for loop
  res.status(200).json({
    address: "jakarta"
  }); 
};