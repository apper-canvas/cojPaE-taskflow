/**
 * Apper service for database operations
 * Provides a singleton ApperClient instance for the application
 */

const CANVAS_ID = "8ed36645d78f45529394e03a4c797d5a";

class ApperService {
  constructor() {
    if (!window.ApperSDK) {
      console.error("Apper SDK not loaded. Make sure the script is included in index.html");
      return;
    }
    
    const { ApperClient } = window.ApperSDK;
    this.client = new ApperClient(CANVAS_ID);
    this.UI = window.ApperSDK.ApperUI;
  }

  /**
   * Fetch records from a table
   * @param {string} tableName - Name of the table
   * @param {object} options - Query options like fields, filters, pagination
   * @returns {Promise} - Promise resolving to fetched records
   */
  async fetchRecords(tableName, options = {}) {
    try {
      const defaultParams = {
        fields: [],
        pagingInfo: { limit: 50, offset: 0 },
        orderBy: [{ field: "CreatedOn", direction: "desc" }],
        ...options
      };
      
      const response = await this.client.fetchRecords(tableName, defaultParams);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching ${tableName} records:`, error);
      throw error;
    }
  }

  /**
   * Create a new record
   * @param {string} tableName - Name of the table
   * @param {object} record - Record data to create
   * @returns {Promise} - Promise resolving to created record
   */
  async createRecord(tableName, record) {
    try {
      const response = await this.client.createRecord(tableName, { record });
      return response.data;
    } catch (error) {
      console.error(`Error creating ${tableName} record:`, error);
      throw error;
    }
  }

  /**
   * Update an existing record
   * @param {string} tableName - Name of the table
   * @param {string|number} recordId - ID of the record to update
   * @param {object} record - Updated record data
   * @returns {Promise} - Promise resolving to updated record
   */
  async updateRecord(tableName, recordId, record) {
    try {
      const response = await this.client.updateRecord(tableName, recordId, { record });
      return response.data;
    } catch (error) {
      console.error(`Error updating ${tableName} record:`, error);
      throw error;
    }
  }

  /**
   * Delete a record
   * @param {string} tableName - Name of the table
   * @param {string|number} recordId - ID of the record to delete
   * @returns {Promise} - Promise resolving to deletion result
   */
  async deleteRecord(tableName, recordId) {
    try {
      const response = await this.client.deleteRecord(tableName, recordId);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ${tableName} record:`, error);
      throw error;
    }
  }

  /**
   * Setup authentication UI
   * @param {string} targetElementId - ID of the element to render auth UI
   * @param {object} options - Auth UI options
   * @returns {void}
   */
  setupAuth(targetElementId, options = {}) {
    const defaultOptions = {
      target: targetElementId,
      clientId: CANVAS_ID,
      view: 'both',
      ...options
    };
    
    this.UI.setup(this.client, defaultOptions);
    this.UI.showLogin(targetElementId);
  }
}

// Create and export a singleton instance
const apperService = new ApperService();
export default apperService;