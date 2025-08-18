using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RealEstate.Api.Models;

namespace RealEstate.Api.Data;

public class MongoOptions
{
    public string Database { get; set; } = "realestate";
    public string PropertiesCollection { get; set; } = "properties";
}

public class MongoContext
{
    public IMongoDatabase Db { get; }
    public IMongoCollection<Property> Properties { get; }

    public MongoContext(IMongoClient client, IOptions<MongoOptions> opts)
    {
        Db = client.GetDatabase(opts.Value.Database);
        Properties = Db.GetCollection<Property>(opts.Value.PropertiesCollection);

        var idx = new List<CreateIndexModel<Property>>
        {
            new(Builders<Property>.IndexKeys.Ascending(p => p.Price)),
            new(Builders<Property>.IndexKeys.Ascending(p => p.Name)),
            new(Builders<Property>.IndexKeys.Ascending(p => p.Address)),
        };
        Properties.Indexes.CreateMany(idx);
    }
}
