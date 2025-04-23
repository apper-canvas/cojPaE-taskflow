import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import apperService from '../services/apperService';

/**
 * Custom hook for simplified data operations with the Apper backend
 * Provides a unified interface for fetching, creating, updating, and deleting data
 * 
 * @param {string} tableName - The name of the table to operate on
 * @param {object} options - Configuration options
 * @returns {object} - Data operations and state
 */
export function useApperData(tableName, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [record, setRecord] = useState(null);
  
  const dispatch = useDispatch();
  
  // Default options
  const defaultOptions = {
    fields: [],
    filter: null,
    orderBy: [{ field: 'CreatedOn', direction: 'desc' }],
    limit: 50,
    autoLoad: true,
    ...options
  };
  
  // Fetch data from the specified table
  const fetchData = useCallback(async (customOptions = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const mergedOptions = {
        ...defaultOptions,
        ...customOptions,
        pagingInfo: { 
          limit: customOptions.limit || defaultOptions.limit, 
          offset: customOptions.offset || 0 
        }
      };
      
      const fetchedData = await apperService.fetchRecords(tableName, mergedOptions);
      setData(fetchedData);
      return fetchedData;
    } catch (err) {
      setError(err.message || 'Error fetching data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tableName, defaultOptions]);
  
  // Fetch a single record by ID
  const fetchRecordById = useCallback(async (recordId, customOptions = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const mergedOptions = {
        ...defaultOptions,
        ...customOptions,
        filter: {
          conditions: [
            {
              field: 'Id',
              operator: 'Equal',
              value: recordId
            }
          ],
          logicalOperator: 'And'
        }
      };
      
      const fetchedData = await apperService.fetchRecords(tableName, mergedOptions);
      
      if (fetchedData && fetchedData.length > 0) {
        setRecord(fetchedData[0]);
        return fetchedData[0];
      } else {
        throw new Error('Record not found');
      }
    } catch (err) {
      setError(err.message || 'Error fetching record');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tableName, defaultOptions]);
  
  // Create a new record
  const createRecord = useCallback(async (recordData) => {
    setLoading(true);
    setError(null);
    
    try {
      const createdRecord = await apperService.createRecord(tableName, recordData);
      setData(prevData => [createdRecord, ...prevData]);
      return createdRecord;
    } catch (err) {
      setError(err.message || 'Error creating record');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tableName]);
  
  // Update an existing record
  const updateRecord = useCallback(async (recordId, recordData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedRecord = await apperService.updateRecord(tableName, recordId, recordData);
      
      // Update the record in the data array
      setData(prevData => prevData.map(item => 
        item.Id === recordId ? updatedRecord : item
      ));
      
      // Update the current record if it's the one being edited
      if (record && record.Id === recordId) {
        setRecord(updatedRecord);
      }
      
      return updatedRecord;
    } catch (err) {
      setError(err.message || 'Error updating record');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tableName, record]);
  
  // Delete a record
  const deleteRecord = useCallback(async (recordId) => {
    setLoading(true);
    setError(null);
    
    try {
      await apperService.deleteRecord(tableName, recordId);
      
      // Remove the record from the data array
      setData(prevData => prevData.filter(item => item.Id !== recordId));
      
      // Clear the current record if it's the one being deleted
      if (record && record.Id === recordId) {
        setRecord(null);
      }
      
      return recordId;
    } catch (err) {
      setError(err.message || 'Error deleting record');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tableName, record]);
  
  // Auto-load data on mount if enabled
  useEffect(() => {
    if (defaultOptions.autoLoad) {
      fetchData();
    }
  }, [fetchData, defaultOptions.autoLoad]);
  
  return {
    data,
    loading,
    error,
    record,
    fetchData,
    fetchRecordById,
    createRecord,
    updateRecord,
    deleteRecord,
    setRecord
  };
}

export default useApperData;