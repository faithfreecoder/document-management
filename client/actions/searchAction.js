import axios from 'axios';
import toastr from 'toastr';
import types from './actionTypes';
import { listDocument } from './documentAction';
import { listUsers } from './userAction';


/**
 *
 *
 * @export
 * @param {Object} result
 * @returns {Object} constaining type and payload
 */
export function searchUserSuccess(result) {
  return { type: types.SEARCH_USER, result };
}

export const listUsersSuccess = users => ({
  type: types.LIST_USERS, users });

/**
 *
 *
 * @export
 * @param {Object} result
 * @returns {Object} conataining type and payload
 */
export function searchDocumentSuccess(documents) {
  return { type: types.LIST_DOCUMENT, documents };
}

/**
 *
 *
 * @export
 * @param {Object} event
 * @param {String} term
 * @param {Number} offset
 * @returns {func|Object} containing type and payload
 */
export function searchUser(event, term, limit, offset) {
  return (dispatch) => {
    if (term === '') {
      dispatch(searchUserSuccess({
        message: '',
        users: {
          rows: []
        },
        pagination: {}
      }));
      return dispatch(listUsers());
    }
    return axios
    .get(`/search/users/?limit=${limit}&offset=${offset}&term=${term}`)
    .then((response) => {
      const users = response.data.users;
      const totalUsers = response.data.totalUsers;
      const pagination = response.data.pagination;
      response.data.term = term;
      const terms = response.data.term;
      const userList = { users, totalUsers, pagination, terms };
      dispatch(listUsersSuccess(userList));
    })
    .catch((error) => {
      dispatch({ type: types.SEARCH_USER_ERROR, error });
    });
  };
}

/**
 *
 * @export
 *
 * @param {Object} event
 * @param {String} term
 * @param {Number} offset
 * @returns {func|Object} containing type and/response data
 */
export function searchDocument(event, term, limit, offset, searchRoute) {
  return (dispatch) => {
    if (term === '') {
      dispatch(searchDocumentSuccess({
        message: '',
        documents: {
          rows: []
        },
        pagination: {}
      }));
      return dispatch(listDocument());
    }
    return axios
    .get(`/search/documents/?term=${term}&limit=${limit}&offset=${offset}&searchRoute=${searchRoute}`)
    .then((response) => {
      response.data.term = term;
      dispatch(searchDocumentSuccess(response.data));
      toastr.success('Document(s) found!');
    })
    .catch((error) => {
      dispatch({ type: types.LIST_DOCUMENT_ERROR, error });
      toastr.success('Document(s) not found!');
    });
  };
}

