import axios from 'axios';
import chai from 'chai';

var expect = chai.expect

import { createPlaceholderItem, deleteAllItemsInStore } from './helperFunctions.js';
import { BASE_URL } from './vars.js'

beforeEach(async function() {
    // Clean all items in the store before initiating test
    this.timeout(15000);
    await deleteAllItemsInStore();
});

describe('CRUD Operations', () => {
    const placeholderKey = "placeholderKey"
    const placeholderValue = "placeholderValue"

    // READ
    it('Get all entries', async () => {
        // Add placeholder entries
        await createPlaceholderItem(placeholderKey, placeholderValue) 
        // Test
        const response = await axios.get(`${BASE_URL}`);
        expect(response.status).to.equal(200);
        const hasKeyValuePair = response.data.some(item => item.main_key === placeholderKey && item.value === placeholderValue);
        expect(hasKeyValuePair).to.be.true;
        
    }).timeout(5000);

    // CREATE
    it('Create an entry with new key and value', async () => {
        // Test
        const parameters = {
            value: "postvalue1",
            main_key: "postkey1"
          };
        const response = await axios.post(BASE_URL, parameters);
        expect(response.status).to.equal(200);
        expect(response.data.main_key).to.equal('postkey1');
        expect(response.data.value).to.equal('postvalue1');       
    }).timeout(5000);

    it('Create an entry with existing key', async () => {
        // Add placeholder entries
        await createPlaceholderItem(placeholderKey, placeholderValue) 
        // Test
        const parameters = {
            value: "postvalue2",
            main_key: placeholderKey
          };
        const response = await axios.post(BASE_URL, parameters);
        expect(response.status).to.not.equal(200);
    }).timeout(5000);

    it('Create an entry with existing value', async () => {
        // Add placeholder entries
        await createPlaceholderItem(placeholderKey, placeholderValue) 
        // Test
        const parameters = {
            value: placeholderValue,
            main_key: "postkey4"
          };
        const response = await axios.post(BASE_URL, parameters);
        expect(response.status).to.equal(200);
        expect(response.data.main_key).to.equal('postkey4');
        expect(response.data.value).to.equal(placeholderValue);
    }).timeout(5000);

    it('Create an entry with incorrect key format', async () => {
        try {
            const parameters = {
                value: "postvalue5",
                main_key: true
            };
            const response = await axios.post(BASE_URL, parameters);
            expect(response.status).to.equal(200);
        } catch (error) {
            if (error.response) {
                expect(error.response.status).to.equal(400);
            } else {
                throw error; 
            }
        }
    }).timeout(5000);

    it('Create an entry with incorrect value format', async () => {
        // Test
        try {
            const parameters = {
                value: true,
                main_key: "postkey6"
            };
            const response = await axios.post(BASE_URL, parameters);
            expect(response.status).to.equal(200);
        } catch (error) {
            if (error.response) {
                expect(error.response.status).to.equal(400);
            } else {
                throw error; 
            }
        }
    }).timeout(5000);

    it('Create an entry without body', async () => {
        // Test
        try {
            const parameters = {

            };
            const response = await axios.post(BASE_URL, parameters);
            expect(response.status).to.not.equal(200);
        } catch (error) {
            if (error.response) {
                expect(error.response.status).to.equal(400);
            } else {
                throw error; 
            }
        }
    }).timeout(5000);

    it('POST exceed quota', async () => {
        // Add 10 entries
        const iterations = 10;
            for(let i = 1; i <= iterations; i++) {
                const key = `postquota${i}`;
                const parameters = {
                    value: key,
                    main_key: key
                };
                const response = await axios.post(BASE_URL, parameters);
                expect(response.status).to.equal(200);
                expect(response.data.main_key).to.equal(key);
                expect(response.data.value).to.equal(key);
            }
        // Attempt to add 11th entry
        try {
            const parameters = {
                value: "postquota11",
                main_key: "postquota11"
              };
            const response = await axios.post(BASE_URL, parameters);
            expect(response.status).to.not.equal(200);
        } catch (error) {
            if (error.response) {
                expect(error.response.status).to.equal(400);
            } else {
                throw error; 
            }
        }
    }).timeout(15000);

    // UPDATE
    it('Add new key and value', async () => {

        // Test
        const parameters = {
            value: "putvalue1",
            main_key: "putkey1"
          };
        const response = await axios.put(BASE_URL, parameters);
        expect(response.status).to.equal(200);
        expect(response.data.main_key).to.equal('putkey1');
        expect(response.data.value).to.equal('putvalue1');
    }).timeout(5000);

    it('Add a new value to existing key', async () => {
        // Add placeholder value
        await createPlaceholderItem(placeholderKey, placeholderValue) 
        // Test
        const parameters = {
            value: "putvalue2",
            main_key: placeholderKey
          };
        const response = await axios.put(BASE_URL, parameters);
        expect(response.status).to.equal(200);
        expect(response.data.main_key).to.equal(placeholderKey);
        expect(response.data.value).to.equal('putvalue1');
    }).timeout(5000);

    it('Add a new key to existing value', async () => {
        // Add placeholder value
        await createPlaceholderItem(placeholderKey, placeholderValue) 
        // Test
        const parameters = {
            value: placeholderValue,
            main_key: "putkey3"
          };
        const response = await axios.put(BASE_URL, parameters);
        expect(response.status).to.equal(200);
        expect(response.data.main_key).to.equal('putkey3');
        expect(response.data.value).to.equal(placeholderValue);
    }).timeout(5000);

    it('Update entry with incorrect key format', async () => {
        // Add placeholder value
        await createPlaceholderItem(placeholderKey, placeholderValue) 
        // Test
        try {
            const parameters = {
                value: true,
                main_key: placeholderKey
            };
            const response = await axios.put(BASE_URL, parameters);
            expect(response.status).to.not.equal(200);
        } catch (error) {
            if (error.response) {
                expect(error.response.status).to.equal(400);
            } else {
                throw error; 
            }
        }
        
    }).timeout(5000);

    it('Update entry with incorrect value format', async () => {
        // Add placeholder value
        await createPlaceholderItem(placeholderKey, placeholderValue) 
        // Test
        try {
            const parameters = {
                value: placeholderValue,
                main_key: true
            };
            const response = await axios.put(BASE_URL, parameters);
            expect(response.status).to.not.equal(200);
        } catch (error) {
            if (error.response) {
                expect(error.response.status).to.equal(400);
            } else {
                throw error; 
            }
        }
    }).timeout(5000);

    it('Update an entry without body', async () => {
        // Test
        try {
            const parameters = {

            };
            const response = await axios.put(BASE_URL, parameters);
            expect(response.status).to.not.equal(200);
        } catch (error) {
            if (error.response) {
                expect(error.response.status).to.equal(400);
            } else {
                throw error; 
            }
        }
    }).timeout(5000);

    it('PUT exceed quota', async () => {
        // Add 10 entries
        const iterations = 10;
            for(let i = 1; i <= iterations; i++) {
                const key = `putquota${i}`;
                const parameters = {
                    value: key,
                    main_key: key
                };
                const response = await axios.put(BASE_URL, parameters);
                expect(response.status).to.equal(200);
                expect(response.data.main_key).to.equal(key);
                expect(response.data.value).to.equal(key);
            }
        // Attempt to add 11th entry
        try {
            const parameters = {
                value: "putquota11",
                main_key: "putquota11"
              };
            const response = await axios.put(BASE_URL, parameters);
            expect(response.status).to.not.equal(200);
        } catch (error) {
            if (error.response) {
                expect(error.response.status).to.equal(400);
            } else {
                throw error; 
            }
        }
    }).timeout(15000);

    // DELETE
    it('Delete a single entry', async () => {
        await createPlaceholderItem(placeholderKey, placeholderValue)
        const parameters = {
            main_key: placeholderKey
          };
        const response = await axios.delete(BASE_URL, {data: parameters});
        expect(response.status).to.equal(200);
    }).timeout(5000);

    it('Delete an already deleted entry', async () => {
        await createPlaceholderItem(placeholderKey, placeholderValue) 
        const parameters = {
            main_key: placeholderKey
          };
        let response = await axios.delete(BASE_URL, {data: parameters});
        expect(response.status).to.equal(200);
        response = await axios.delete(BASE_URL, {data: parameters});
        expect(response.status).to.not.equal(200);
    }).timeout(5000);
});
