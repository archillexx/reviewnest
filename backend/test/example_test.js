const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Review = require('../models/Review');
const { getReviews, addReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { expect } = chai;

chai.use(chaiHttp);

describe('Review Controller Tests', () => {

  describe('AddReview Function Test', () => {
    it('should create a new review successfully', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { productName: "Product A", reviewContent: "Great product!", rating: 5 }
      };
      const createdReview = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };
      const createStub = sinon.stub(Review, 'create').resolves(createdReview);
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      
      await addReview(req, res);
      
      expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdReview)).to.be.true;
      createStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
      const createStub = sinon.stub(Review, 'create').throws(new Error('DB Error'));
      const req = { user: { id: new mongoose.Types.ObjectId() }, body: { productName: "Product A", reviewContent: "Great!", rating: 5 } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      
      await addReview(req, res);
      
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
      createStub.restore();
    });
  });

  describe('GetReviews Function Test', () => {
    it('should return reviews for the given user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const reviews = [
        { _id: new mongoose.Types.ObjectId(), productName: "Product A", reviewContent: "Amazing!", rating: 5, userId },
        { _id: new mongoose.Types.ObjectId(), productName: "Product B", reviewContent: "Not bad", rating: 3, userId }
      ];
      const findStub = sinon.stub(Review, 'find').resolves(reviews);
      const req = { user: { id: userId } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      
      await getReviews(req, res);
      
      expect(findStub.calledOnceWith({ userId })).to.be.true;
      expect(res.json.calledWith(reviews)).to.be.true;
      findStub.restore();
    });

    it('should return 500 on error', async () => {
      const findStub = sinon.stub(Review, 'find').throws(new Error('DB Error'));
      const req = { user: { id: new mongoose.Types.ObjectId() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      
      await getReviews(req, res);
      
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
      findStub.restore();
    });
  });

  describe('UpdateReview Function Test', () => {
    it('should update a review successfully', async () => {
      const reviewId = new mongoose.Types.ObjectId();
      const existingReview = { _id: reviewId, productName: "Old Product", reviewContent: "Old review", rating: 2, save: sinon.stub().resolvesThis() };
      const findByIdStub = sinon.stub(Review, 'findById').resolves(existingReview);
      const req = { params: { id: reviewId }, body: { productName: "Updated Product", rating: 4 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      
      await updateReview(req, res);
      
      expect(existingReview.productName).to.equal("Updated Product");
      expect(existingReview.rating).to.equal(4);
      expect(res.json.calledOnce).to.be.true;
      findByIdStub.restore();
    });

    it('should return 404 if review is not found', async () => {
      const findByIdStub = sinon.stub(Review, 'findById').resolves(null);
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      
      await updateReview(req, res);
      
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Review not found' })).to.be.true;
      findByIdStub.restore();
    });

    it('should return 500 on error', async () => {
      const findByIdStub = sinon.stub(Review, 'findById').throws(new Error('DB Error'));
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      
      await updateReview(req, res);
      
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
      findByIdStub.restore();
    });
  });

  describe('DeleteReview Function Test', () => {
    it('should delete a review successfully', async () => {
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const review = { remove: sinon.stub().resolves() };
      const findByIdStub = sinon.stub(Review, 'findById').resolves(review);
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
  
      await deleteReview(req, res);
  
      expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(review.remove.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'Review deleted' })).to.be.true;
  
      findByIdStub.restore();
    });
  
    it('should return 404 if review is not found', async () => {
      const findByIdStub = sinon.stub(Review, 'findById').resolves(null);
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
  
      await deleteReview(req, res);
  
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Review not found' })).to.be.true;
  
      findByIdStub.restore();
    });
  
    it('should return 500 if an error occurs', async () => {
      const findByIdStub = sinon.stub(Review, 'findById').throws(new Error('DB Error'));
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
  
      await deleteReview(req, res);
  
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  
      findByIdStub.restore();
    });
  });
  

});
