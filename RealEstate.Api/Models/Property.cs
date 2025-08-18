using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Api.Models;

public class Property
{
    // _id de Mongo como string (ObjectId)
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    // Campos tal como estarán en tu colección de Atlas
    [BsonElement("ownerId")]
    public string OwnerId { get; set; } = default!;

    [BsonElement("name")]
    public string Name { get; set; } = default!;

    [BsonElement("address")]
    public string Address { get; set; } = default!;

    // Guardamos decimal como Decimal128 en Mongo (preciso para dinero)
    [BsonElement("price")]
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Price { get; set; }

    [BsonElement("imageUrl")]
    public string ImageUrl { get; set; } = default!;
}
