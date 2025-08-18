using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using RealEstate.Api.Data;
using RealEstate.Api.Dtos;
using RealEstate.Api.Models;
using System.Text.RegularExpressions;

namespace RealEstate.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly MongoContext _db;

        public PropertiesController(MongoContext db)
        {
            _db = db;
        }

        // GET /api/properties
        [HttpGet]
        public async Task<IActionResult> Get(
            [FromQuery] string? name,
            [FromQuery] string? address,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? sort = null,
            CancellationToken ct = default)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 50);
            if (minPrice.HasValue && maxPrice.HasValue && minPrice > maxPrice)
            {
                return BadRequest(new
                {
                    errors = new { minPrice = "minPrice cannot be greater than maxPrice" }
                });
            }


            var filter = Builders<Property>.Filter.Empty;

            if (!string.IsNullOrWhiteSpace(name))
                filter &= Builders<Property>.Filter.Regex(p => p.Name,
                    new BsonRegularExpression("^" + Regex.Escape(name), "i"));

            if (!string.IsNullOrWhiteSpace(address))
                filter &= Builders<Property>.Filter.Regex(p => p.Address,
                    new BsonRegularExpression("^" + Regex.Escape(address), "i"));

            if (minPrice.HasValue) filter &= Builders<Property>.Filter.Gte(p => p.Price, minPrice.Value);
            if (maxPrice.HasValue) filter &= Builders<Property>.Filter.Lte(p => p.Price, maxPrice.Value);

            var query = _db.Properties.Find(filter);

            query = sort switch
            {
                "price" => query.SortBy(p => p.Price),
                "-price" => query.SortByDescending(p => p.Price),
                "name" => query.SortBy(p => p.Name),
                "-name" => query.SortByDescending(p => p.Name),
                _ => query.SortBy(p => p.Name)
            };

            var total = await _db.Properties.CountDocumentsAsync(filter, cancellationToken: ct);

            var items = await query
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync(ct);

            var dto = items.Select(p => new PropertyDto(
                IdOwner: p.OwnerId,
                Name: p.Name,
                AddressProperty: p.Address,
                PriceProperty: p.Price,
                ImageUrl: p.ImageUrl
            ));

            return Ok(new { items = dto, total, page, pageSize });
        }

        // GET /api/properties/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id, CancellationToken ct = default)
        {
            var prop = await _db.Properties.Find(p => p.Id == id).FirstOrDefaultAsync(ct);
            if (prop is null) return NotFound();

            var dto = new PropertyDto(
                IdOwner: prop.OwnerId,
                Name: prop.Name,
                AddressProperty: prop.Address,
                PriceProperty: prop.Price,
                ImageUrl: prop.ImageUrl
            );

            return Ok(dto);
        }
    }
}
