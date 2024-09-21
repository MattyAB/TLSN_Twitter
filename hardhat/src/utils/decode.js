const fs = require('fs');


function toHexString(byteArray) {
    return '0x' + Array.from(byteArray, byte => byte.toString(16).padStart(2, '0')).join('');
}

function convertToByteArray(data) {
    if (Array.isArray(data)) {
        // Check if the array consists of integers (bytes)
        if (data.every(Number.isInteger) && data.every(num => num >= 0 && num <= 255)) {
            // return toHexString(new Uint8Array(data)); // Convert to Uint8Array{
            return new Uint8Array(data); // Convert to Uint8Array
        }
        // If it's an array of objects, iterate through them
        return data.map(convertToByteArray);
    } else if (typeof data === 'object' && data !== null) {
        // Recursively iterate through object keys
        const result = {};
        for (const key in data) {
            result[key] = convertToByteArray(data[key]);
        }
        return result;
    }
    return data; // Return the data as is for non-array/non-object types
}

function decode_file(filepath) {
    const data = fs.readFileSync(filepath, 'utf8');
    jsonData = JSON.parse(data);

    jsonData = convertToByteArray(jsonData);
    
    // output_data = JSON.stringify(jsonData);

    // console.log(output_data);
    // console.log(new Blob([output_data]).size);

    return jsonData;
}

module.exports = { decode_file };
