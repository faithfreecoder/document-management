import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import db from '../models';
import Helper from '../helper/Helper';


const secret = process.env.SECRET || 'samplesecret';

export default {

  getAllUsers(req, res) {
    db.User.findAll({})
      .then(users => res.status(200).json({
        message: 'Successfull',
        users
      }))
      .catch(error => res.status(400).json({
        error
      }));
  },

  getOneUser(req, res) {
    // console.log(req.params.id);
    db.User.findById(req.params.id)
      .then(user => res.status(200)
        .json({
          message: 'Successful',
          user
        }))
      .catch(error => res.status(400).json({
        error
      }));
  },

  getUserPagination(req, res) {
    db.User.findAll({
      limit: 10
    })
      .then(limit => res.status(200).json({
        message: 'Successfull',
        limit
      }))
      .catch(error => res.status(400).json({
        error
      }));
  },

  getUserDocuments(req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      },
      include: {
        model: db.Document
      }
    }).then(documents => res.status(200)
      .json({
        message: 'Successfull',
        documents
      })).catch((error) => {
        res.status(400)
        .send(error);
      });
  },

  deleteUserDocuments(req, res) {
    res.send('Deletes all documents belonging to a user');
  },

  createUser(req, res) {
    db.User.findOne({ where: { email: req.body.email } }).then((user) => {
      if (user) {
        return res.status(409).send({ message: 'User already exists' });
      }
      db.User.create(req.body)
      .then((newUser) => {
        const token = jwt.sign({
          data:
          { id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            roleId: newUser.roleId }
        }, secret, {
          expiresIn: '24h' // expires in 24 hours
        });
        res.status(200)
          .send({
            token,
            newUser,
            message: 'User has been successfully created'
          });
      })
      .catch((error) => {
        res.status(400)
          .send(error);
      });
    });
  },

  login(req, res) {
    db.User
      .findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (!user) {
          return res.status(401).send({
            message: 'Authentication Failed. User not found.',
          });
        }
        // check if password matches
        if (!user.validPassword(req.body.password)) {
          return res.status(401).send({
            message: 'Authentication Failed. Wrong password.'
          });
        }
        const token = jwt.sign({
          data:
          { id: user.id,
            username: user.username,
            email: user.email,
            roleId: user.roleId }
        }, secret, {
          expiresIn: '24h' // expires in 24 hours
        });
        return res.status(200).send({
          message: 'User authenticated successfully',
          token
        });
      })
      .catch(error => res.status(400).send({
        error,
        message: 'Error occurred while authenticating user'
      }));
  },

  logout(req, res) {
    return res.status(200).send({
      message: 'You have successfully logged out'
    });
  },

  updateUser(req, res) {
    db.User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found'
          });
        }
        return user.update({
          firstname: req.body.name || user.firstname,
          lastname: req.body.lastname || user.lastname,
          username: req.body.username || user.username,
          email: req.body.email || user.email,
          password: bcrypt.hashSync(req.body.password,
          bcrypt.genSaltSync(10)) || user.password,
          roleId: req.body.roleId || user.roleId
        })
    .then(updatedUser => res.status(200)
        .send({
          message: 'User role updated',
          updatedUser
        }))
      .catch(error => res.status(400).send({
        error
      }));
      })
    .catch(error => res.status(400).send({
      error
    }));
  },

  deleteUser(req, res) {
    return db.User.findById(req.params.id)
      .then((user) => {
        user.destroy().then(res.status(200)
            .json({
              message: 'User successfully deleted'
            }))
          .catch(error => res.status(400).json(error));
      }).catch(error => res.status(400).json(error));
  }
};
