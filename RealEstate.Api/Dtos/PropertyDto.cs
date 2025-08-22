namespace RealEstate.Api.Dtos;

public record PropertyDto(
    string Id,            
    string IdOwner,
    string Name,
    string AddressProperty,
    decimal PriceProperty,
    string ImageUrl
);
