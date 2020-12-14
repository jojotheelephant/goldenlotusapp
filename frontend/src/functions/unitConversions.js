// conversion function. takes itme/date format used in MongoDB and returns date in MM/DD/YYYY
const dateConversion = (datetime) => {
    if (datetime) {
        const date = `${datetime.substring(5, 7)}/${datetime.substring(
            8,
            10
        )}/${datetime.substring(0, 4)}`;
        return date;
    }
};
// takes itme/date format used in MongoDB to AM/PM time
const timeConversion = (datetime) => {
    const hours = parseInt(datetime.substring(11, 13));
    const mins = parseInt(datetime.substring(14, 16));
    if (hours > 12) {
        const formattedHours = hours - 12;
        return `${formattedHours}:${mins}PM`;
    } else {
        return `${hours}:${mins}AM`;
    }
};
// ensures two decimal places for prices
const formatPrice = (price) => {
    const formattedPrice = price.toFixed(2);
    return formattedPrice;
};

export { dateConversion, timeConversion, formatPrice };
