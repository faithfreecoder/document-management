import db from '../models/';

const allRoles = ['admin', 'regular', 'editor'];
const Roles = db.Role;
const Users = db.User;

export default {
  createRole(req, res) {
    if (allRoles.indexOf(req.body.title) === -1) {
      return res.status(403).json({ message: 'Invalid role title' });
    }
    Roles
      .create(
        req.body
      )
      .then(role => res.status(201).send({
        message: 'Role created succesfully',
        role
      }))
      .catch((error) => {
        res.status(400).send({
          message: 'Error creating new role',
          error
        });
      });
  },

  listRole(req, res) {
    return Roles
      .findAll()
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Roles Not Found',
          });
        }
        return res.status(200).send({ role });
      })
      .catch(error => res.status(400).send({
        error,
        message: 'Error retrieving all roles'
      }));
  },

  retrieveRole(req, res) {
    return Roles
      .findById(req.params.id, {
        include: [{
          model: Users,
          attributes: [
            'username'
          ]
        }],
      })
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role Not Found'
          });
        }
        return res.status(200).send({ role });
      })
      .catch(error => res.status(400).send({
        error,
        message: 'Error occured while retrieving role'
      }));
  },

  updateRole(req, res) {
    return Roles
      .findById(req.params.id)
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return role
          .update(req.body)
          .then(() => res.status(200).send({
            message: 'Role updated successfully.',
            role
          }))
          .catch(error => res.status(400).send({
            message: 'Role did not update successfully.',
            error
          }));
      })
      .catch(error => res.status(400).send({
        error,
        message: 'Error updating role'
      }));
  },

  deleteRole(req, res) {
    return Roles
      .findById(req.params.id)
      .then((role) => {
        if (!role) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return role
          .destroy()
          .then(() => res.status(200).send({
            message: 'Role deleted successfully.'
          }));
      })
      .catch(error => res.status(400).send({
        message: 'Cannot delete role with users assigned to it.',
        error
      }));
  },
};

