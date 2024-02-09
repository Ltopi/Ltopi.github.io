class Product:
    """
    Ulopoiei diafora interfaces
    """
    # base properties AND methodoi
    type
    parameters: Set(ProductParameters)
    pricingModel

    # methodoi apo interfaces
    ## Sellable, Quotable
    priceQuotation(pricingModel, productConfiguration): Quotation


class ProductParameter:
    price: str


class ProductConfiguration:
    """
    """

# ----------------------------------


class JTBD:
    # Manufacturing products

    # Improved customer experience
    orderValidation

    # Selling products - COMMERCIAL
    quotation (improved_with_billOfMaterials)

    # Order satisfaction
    billOfMaterials
    
    # Misc (NO MONEY)
    designs
    printDocuments




