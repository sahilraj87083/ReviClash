import { api } from "./api.services";


export const getMyCollections = async () => {
  const res = await api.get("/collections");
  return res.data.data;
};


export const createCollection = async (data) => {
  const res = await api.post("/collections", data);
  return res.data.data;
};


export const deleteCollection = async (collectionId) => {
  const res = await api.delete(`/collections/${collectionId}`);
  return res.data.data; // consistency
};


export const getCollectionById = async (collectionId) => {
  const res = await api.get(`/collections/${collectionId}`);
  return res.data.data;
};


export const getCollectionAllQuestions = async (collectionId) => {
  const res = await api.get(`/collections/${collectionId}/questions`);
  return res.data.data; 
  // expected: { collection, questions }
};



export const addQuestionToCollection = async (collectionId, questionId) => {
  const res = await api.post(
    `/collections/${collectionId}/questions`,
    { questionId } 
  );
  return res.data;
};



export const removeQuestionFromCollection = async (collectionId, questionId) => {
  const res = await api.delete(
    `/collections/${collectionId}/questions/${questionId}`
  );
  return res.data;
};


export const bulkAddQuestions = async (collectionId, questionIds) => {
  const res = await api.post(`/collections/${collectionId}/questions/bulk`, {questionIds})
  return res.data.data
}

export const bulkRemoveQuestions = async () => {
  
}