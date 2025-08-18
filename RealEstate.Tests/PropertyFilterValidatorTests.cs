using FluentAssertions;
using NUnit.Framework;
using RealEstate.Api.Filters;
using RealEstate.Api.Validators;

namespace RealEstate.Tests;

public class PropertyFilterValidatorTests
{
    [Test]
    public void MinPrice_greater_than_MaxPrice_should_fail()
    {
        var v = new PropertyFilterValidator();
        var f = new PropertyFilter { MinPrice = 1000, MaxPrice = 10 };

        var r = v.Validate(f);

        r.IsValid.Should().BeFalse();
        r.Errors.Should().Contain(e => e.ErrorMessage.Contains("minPrice"));
    }

    [TestCase("price")]
    [TestCase("-price")]
    [TestCase("name")]
    [TestCase("-name")]
    public void Valid_sort_values_should_pass(string sort)
    {
        var v = new PropertyFilterValidator();
        var f = new PropertyFilter { Sort = sort };

        v.Validate(f).IsValid.Should().BeTrue();
    }
}
