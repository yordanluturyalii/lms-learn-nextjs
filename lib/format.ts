export const formatPrice = (price : number) => {
    return new Intl.NumberFormat("en-USD", {
        style: "currency",
        currency: "USD"
    }).format(price);
}