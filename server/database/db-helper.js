
import debug from 'debug';

debug('db:DBHelper');

class DBHelper {
  /**
   * Manages reading, adding, and updating Tasks in Cosmos DB
   * @param {CosmosClient} cosmosClient
   * @param {string} databaseId
   * @param {string} containerId
   */
  constructor(cosmosClient, databaseId, containerId) {
    this.client = cosmosClient;
    this.databaseId = databaseId;
    this.collectionId = containerId;

    this.database = null;
    this.container = null;
  }

  async init() {
    debug('Setting up the database...');
    const dbResponse = await this.client.databases.createIfNotExists({
      id: this.databaseId
    });
    this.database = dbResponse.database;
    debug('Setting up the database...done!');
    debug('Setting up the container...');
    const coResponse = await this.database.containers.createIfNotExists({
      id: this.collectionId
    });
    this.container = coResponse.container;
    debug('Setting up the container...done!');
  }

  async addItem(item) {
    debug('Adding an item to the database');
    const { resource: doc } = await this.container.items.create(item);
    return doc;
  }

  async getAllItems() {
    const querySpec = {
      query: 'SELECT * from c'
    };

    const { resources: items } = await this.container.items
      .query(querySpec)
      .fetchAll();

    return items;
  }
}

export default DBHelper;
