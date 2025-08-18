using FluentValidation;
using RealEstate.Api.Filters;

namespace RealEstate.Api.Validators;

public class PropertyFilterValidator : AbstractValidator<PropertyFilter>
{
    public PropertyFilterValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 50);

        RuleFor(x => x.MinPrice)
            .LessThanOrEqualTo(x => x.MaxPrice!.Value)
            .When(x => x.MinPrice.HasValue && x.MaxPrice.HasValue)
            .WithMessage("minPrice no puede ser mayor que maxPrice");

        RuleFor(x => x.Sort)
            .Must(s => s is null || new[] { "price", "-price", "name", "-name" }.Contains(s))
            .WithMessage("sort inválido (usa: price, -price, name, -name)");
    }
}
