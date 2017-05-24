import axios from 'axios';
import types from './actionTypes';

export function createDocument(document) {
  console.log(document, 'document in documentAction');
  return (dispatch) => {
    return axios.post('/documents/', document)
    .then((response) => {
      console.log(response.data);
      dispatch({ type: types.ADD_DOCUMENT, document });
    });
  };
  // return { type: 'ADD_DOCUMENT', document };
}

export function creatingDocument() {
  return { type: types.ADDING_DOCUMENT };
}

export function listDocumentSuccess(documents) {
  return { type: types.LIST_DOCUMENT, documents };
}

export function listUserDocumentSuccess(documents) {
  return { type: types.LIST_USER_DOCUMENT, documents };
}

export function listDocument() {
  console.log(axios.defaults.headers);
  return (dispatch) => {
    axios.get('/documents')
    .then((response) => {
      console.log(response.data.document);
      const documents = response.data.document;
      dispatch(listDocumentSuccess(documents));
    })
    .catch((error) => {
      console.log(error.response);
    });
  };
  // return { type: 'LIST_DOCUMENT', documentList };
}

export function listUserDocument(id) {
  // console.log('')
  console.log(axios.defaults.headers)
  return (dispatch) => {
    axios.get(`/users/${id}/documents`)
    .then((response) => {
      console.log('user doc', console.log(axios.defaults.headers));
      const documents = response.data.documents;
      dispatch(listUserDocumentSuccess(documents));
    })
    .catch((error) => {
      console.log(error.response);
    });
  };
  // return { type: 'LIST_DOCUMENT', documentList };
}

export function viewDocument(id) {
  return (dispatch) => {
    axios.get(`/documents/${id}`)
    .then((response) => {
      console.log('document =>', response.data);
      const document = response.data.document;
      dispatch({ type: types.VIEW_DOCUMENT, document });
    })
    .catch((error) => {
      console.log(error);
    });
  };
  // return { type: 'VIEW_DOCUMENT', viewDocument };
}

export function updateDocument(id, updatedDocument) {
  console.log(updatedDocument);
  return (dispatch) => {
    return axios.put(`/documents/${id}`, updatedDocument)
    .then((response) => {
      console.log('response', response.data);
      dispatch({ type: types.UPDATE_DOCUMENT, updatedDocument });
    }).catch((error) => {
      console.log(error);
      dispatch({ type: types.UPDATE_ERROR, error });
    });
  };
  // return { type: types.UPDATE_DOCUMENT, documentUpdate };
}

export function deleteDocument(id) {
  return (dispatch) => {
    axios.delete(`/documents/${id}`)
    .then((response) => {
      console.log('message', response.data);
      dispatch({ type: types.DELETE_DOCUMENT, id });
    }).catch((error) => {
      console.log(error);
    });
  };
}