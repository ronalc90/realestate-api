using Microsoft.OpenApi.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using RealEstate.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(o =>
{
    o.JsonSerializerOptions.PropertyNamingPolicy = null;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "RealEstate", Version = "v1" });
});

builder.Services.AddCors(o =>
{
    o.AddPolicy("dev", p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

builder.Services.Configure<MongoOptions>(builder.Configuration.GetSection("Mongo"));
builder.Services.AddSingleton<IMongoClient>(_ =>
{
    var cs = Environment.GetEnvironmentVariable("MONGODB_URI")
             ?? throw new InvalidOperationException("MONGODB_URI not set");
    var settings = MongoClientSettings.FromConnectionString(cs);
    settings.ServerApi = new ServerApi(ServerApiVersion.V1);
    settings.ConnectTimeout = TimeSpan.FromSeconds(5);
    settings.SocketTimeout = TimeSpan.FromSeconds(10);
    settings.RetryWrites = true;
    settings.MaxConnectionPoolSize = 200;
    return new MongoClient(settings);
});
builder.Services.AddSingleton<MongoContext>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("dev");

app.MapControllers();

app.MapGet("/healthz", async (MongoContext ctx) =>
{
    await ctx.Db.RunCommandAsync((Command<BsonDocument>)"{ ping: 1 }");
    return Results.Ok(new { status = "ok" });
});

app.Run();
