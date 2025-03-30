const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Review = require('../models/Review');
const { addReview, getReviews, updateReview, deleteReview, getAllReviews } = require('../controllers/reviewController');
const { expect } = chai;

chai.use(chaiHttp);

describe('AddReview Function Test', () => {

  it('should create a new review successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { productName: "Product A", reviewContent: "Great product", rating: 5 }
    };

    // Mock review that would be created
    const createdReview = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Review.create to return the createdReview
    const createStub = sinon.stub(Review, 'create').resolves(createdReview);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addReview(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdReview)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Review.create to throw an error
    const createStub = sinon.stub(Review, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { productName: "Product A", reviewContent: "Great product", rating: 5 }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addReview(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('getAllReviews Function Test', () => {
  
    afterEach(() => {
      sinon.restore(); // Restore original functions after each test
    });
  
    it('should return all reviews successfully', async () => {
      // Mock review data
      const reviews = [
        { _id: new mongoose.Types.ObjectId(), productName: "Product A", reviewContent: "Good!", rating: 4, userId: { _id: new mongoose.Types.ObjectId(), name: "John Doe" } },
        { _id: new mongoose.Types.ObjectId(), productName: "Product B", reviewContent: "Not bad", rating: 3, userId: { _id: new mongoose.Types.ObjectId(), name: "Jane Doe" } }
      ];
  
      // Stub Review.find().populate() to return mock reviews
      const findStub = sinon.stub(Review, 'find').returns({ populate: sinon.stub().resolves(reviews) });
  
      // Mock response object
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };
  
      // Mock request object (empty, since we don't need any request parameters)
      const req = {};
  
      // Call the function
      await getAllReviews(req, res);
  
      // Assertions
      expect(findStub.calledOnce).to.be.true;
      expect(res.json.calledWith(reviews)).to.be.true;
      expect(res.status.called).to.be.false; // No error status should be set
  
      // Restore stubbed methods
      findStub.restore();
    });
  
    it('should return 500 on server error', async () => {
      // Stub Review.find().populate() to throw an error
      const findStub = sinon.stub(Review, 'find').returns({ populate: sinon.stub().throws(new Error('DB Error')) });
  
      // Mock request object
      const req = {};
  
      // Mock response object
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };
  
      // Call the function
      await getAllReviews(req, res);
  
      // Assertions
      expect(findStub.calledOnce).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Server Error' })).to.be.true;
  
      // Restore stubbed methods
      findStub.restore();
    });
  
  });


describe('UpdateReview Function Test', () => {

  it('should update review successfully', async () => {
    // Mock review data
    const reviewId = new mongoose.Types.ObjectId();
    const existingReview = {
      _id: reviewId,
      productName: "Product A",
      reviewContent: "Great product",
      rating: 5,
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Review.findById to return mock review
    const findByIdStub = sinon.stub(Review, 'findById').resolves(existingReview);

    // Mock request & response
    const req = {
      params: { id: reviewId },
      body: { productName: "Updated Product", reviewContent: "Updated content", rating: 4 }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateReview(req, res);

    // Assertions
    expect(existingReview.productName).to.equal("Updated Product");
    expect(existingReview.reviewContent).to.equal("Updated content");
    expect(existingReview.rating).to.equal(4);
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if review is not found', async () => {
    const findByIdStub = sinon.stub(Review, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateReview(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Review not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Review, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateReview(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });

});


describe('GetReviews Function Test', () => {

  it('should return reviews for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock review data
    const reviews = [
      { _id: new mongoose.Types.ObjectId(), productName: "Product 1", userId },
      { _id: new mongoose.Types.ObjectId(), productName: "Product 2", userId }
    ];

    // Stub Review.find to return mock reviews
    const findStub = sinon.stub(Review, 'find').resolves(reviews);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getReviews(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(reviews)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Review.find to throw an error
    const findStub = sinon.stub(Review, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getReviews(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteReview Function Test', () => {

  it('should delete a review successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock review found in the database
    const review = { remove: sinon.stub().resolves() };

    // Stub Review.findById to return the mock review
    const findByIdStub = sinon.stub(Review, 'findById').resolves(review);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteReview(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(review.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Review deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if review is not found', async () => {
    // Stub Review.findById to return null
    const findByIdStub = sinon.stub(Review, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteReview(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Review not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Review.findById to throw an error
    const findByIdStub = sinon.stub(Review, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteReview(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});
