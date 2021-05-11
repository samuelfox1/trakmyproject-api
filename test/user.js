//https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const User = require('../models/user')

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('User', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.deleteMany({}, (err) => {
            done();
        });
    });
    /*
      * Test the /GET route
      */
    describe('/POST /api/user', () => {
        it('should create a new user', (done) => {
            const user = {
                username: 'sam1',
                password: 'password',
                data: {
                    profilePic: "https://i.imgur.com/4DDqtypt.jpg",
                    firstName: "sam",
                    lastName: "fox",
                    email: "sam1@email.com"
                }
            }
            chai.request(server)
                .post('/api/user')
                .send(user)
                .end((err, res) => {
                    // if (err) console.log(err)
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    // res.body.should.have.property('errors');
                    // res.body.errors.should.have.property('pages');
                    // res.body.errors.pages.should.have.property('kind').eql('required');
                    done()
                })
        })
    })
});
