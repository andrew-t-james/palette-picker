const chai = require('chai');

const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('Should return index.html', () =>
    chai.request(server)
      .get('/')
      .then(res => { // had to use .then because end threw warning
        res.should.have.status(200);
        res.should.be.html;
      })
      .catch(error => {
        throw error;
      }));
  it('Should return a 404 when a route does not exist', () =>
    chai.request(server)
      .get('/non-existent-route')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(error => {
        throw error;
      }));
});

describe('API Routes', () => {
  beforeEach(done => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => knex.seed.run()
            .then(() => {
              done();
            }));
      });
  });

  describe('GET /api/v1/projects', () => {
    it('should return an array of projects', done => {
      chai.request(server)
        .get('/api/v1/projects')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.length.should.equal(2);
          res.body[0].should.have.property('id');
          res.body[0].id.should.equal(1);
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('Dark Tones');
          res.body[0].should.have.property('created_at');
          res.body[1].should.have.property('id');
          res.body[1].id.should.equal(2);
          res.body[1].should.have.property('name');
          res.body[1].name.should.equal('Light Tones');
          res.body[1].should.have.property('created_at');
          done();
        });
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('should return an array of palettes', done => {
      chai.request(server)
        .get('/api/v1/palettes')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.length.should.equal(4);
          res.body[0].should.have.property('id');
          res.body[0].id.should.equal(1);
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('Dark Colors');
          res.body[0].should.have.property('created_at');
          res.body[0].should.have.property('color_1');
          res.body[0].color_1.should.equal('#FFFFFF');
          res.body[0].should.have.property('color_2');
          res.body[0].color_2.should.equal('#1b263b');
          res.body[0].should.have.property('color_3');
          res.body[0].color_3.should.equal('#415a77');
          res.body[0].should.have.property('color_4');
          res.body[0].color_4.should.equal('#7b9e87');
          res.body[0].should.have.property('color_5');
          res.body[0].color_5.should.equal('#7b9e87');
          done();
        });
    });
  });
});
