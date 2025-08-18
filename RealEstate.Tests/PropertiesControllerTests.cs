using System.Text.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Mongo2Go;
using MongoDB.Driver;
using NUnit.Framework;
using RealEstate.Api.Controllers;
using RealEstate.Api.Data;
using RealEstate.Api.Models;

namespace RealEstate.Tests;

[NonParallelizable]
public class PropertiesControllerTests
{
    private MongoDbRunner _runner = null!;
    private MongoClient _client = null!;
    private MongoContext _ctx = null!;

    [SetUp]
    public void SetUp()
    {
        _runner = MongoDbRunner.Start();
        _client = new MongoClient(_runner.ConnectionString);

        var opts = Options.Create(new MongoOptions
        {
            Database = "realestate_test",
            PropertiesCollection = "properties"
        });

        _ctx = new MongoContext(_client, opts);

        _ctx.Properties.DeleteMany(Builders<Property>.Filter.Empty);
        _ctx.Properties.InsertMany(new[]
        {
            new Property { OwnerId = "o1", Name = "Modern Loft NYC", Address = "123 Main St, New York, NY, USA", Price = 950000, ImageUrl = "https://img/1" },
            new Property { OwnerId = "o2", Name = "Loft Chapinero", Address = "Calle 59 #7-45, Bogotá, Colombia", Price = 380000, ImageUrl = "https://img/2" },
            new Property { OwnerId = "o3", Name = "Casa Poblado", Address = "Cra 30 #10-25, Medellín, Colombia", Price = 520000, ImageUrl = "https://img/3" }
        });
    }

    [TearDown]
    public void TearDown()
    {
        _client?.Dispose();
        _runner?.Dispose();
    }

    [Test]
    public async Task GetById_returns_dto_when_exists()
    {
        var first = _ctx.Properties.Find(Builders<Property>.Filter.Empty).First();
        var controller = new PropertiesController(_ctx);

        var result = await controller.GetById(first.Id!.ToString(), default);

        result.Should().BeOfType<OkObjectResult>();
        var ok = (OkObjectResult)result;

        var json = JsonSerializer.Serialize(ok.Value);
        json.Should().Contain(first.Name).And.Contain(first.Address);
    }

    [Test]
    public async Task Get_sorts_by_price_desc()
    {
        var controller = new PropertiesController(_ctx);

        var result = await controller.Get(
            null,           // name
            null,           // address
            null,           // minPrice
            null,           // maxPrice
            1,              // page
            10,             // pageSize
            "-price",       // sort
            default         // CancellationToken (posicional)
        );

        result.Should().BeOfType<OkObjectResult>();
        var ok = (OkObjectResult)result;

        using var doc = JsonDocument.Parse(JsonSerializer.Serialize(ok.Value));
        var root = doc.RootElement;

        root.GetProperty("total").GetInt32().Should().Be(3);
        var firstName = root.GetProperty("items")[0].GetProperty("Name").GetString();
        firstName.Should().Be("Modern Loft NYC"); // más caro primero
    }

    [Test]
    public async Task Get_returns_400_when_min_greater_than_max()
    {
        var controller = new PropertiesController(_ctx);

        var result = await controller.Get(
            null, null, 1000, 10, 1, 10, null, default);

        result.Should().BeOfType<BadRequestObjectResult>();
        ((BadRequestObjectResult)result).StatusCode.Should().Be(400);
    }
}
