import axios from 'axios';
import chai from 'chai';

var expect = chai.expect

import { BASE_URL } from './vars.js'

export async function createPlaceholderItem(mainKey, value) {
  try {
    const parameters = {
        value: value,
        main_key: mainKey
      };
    const response = await axios.put(BASE_URL, parameters);
    expect(response.data.main_key).to.equal(mainKey);
    return response.data;
  } catch (error) {
    console.error('Error adding entry:', error);
  }
}

export async function deleteAllItemsInStore() {
        // Fetch all the items from the store
        const response = await axios.get(BASE_URL);
        const items = response.data;
        // Iterate over each item and delete it
        for (let item of items) {
            const parameters = {
              main_key: item.main_key
            };
            const deleteResponse = await axios.delete(BASE_URL, {data: parameters});
            expect(deleteResponse.status).to.equal(200);
        }
        // Check to make sure the store is empty after deletion
        const checkResponse = await axios.get(BASE_URL);
        expect(checkResponse.data).to.be.empty;
}