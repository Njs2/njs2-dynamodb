const { UPDATE_TYPE } = require('../constants/constant');

module.exports.generateUpdateExpression = (updateValue, updateKey, schema, updateExpressionKey, initialKey = null) => {
    try {
        const updateTypes = Object.keys(UPDATE_TYPE);

        if (
            updateExpressionKey - 1 < 0 ||
            updateTypes.length < updateExpressionKey - 1
        ) {
            throw new Error("Invalid update types");
        }

        let updateExpression = updateTypes[updateExpressionKey - 1];
    let value = {}, key = {};

    // Update only if the length of keys and values are same.
    if (updateValue.length == updateKey.length) {

        // Iterate over each key.
        updateKey.forEach((upKey, index) => {

                let isExprAttrValueRequired = true;
            // If Key is not present then don't update.
                if (schema[upKey] && updateValue[index]) {

                // For avoiding error on reserved keywords we are converting keys with # and values with :.
                let currKey = ""
                if (initialKey) currKey = '#' + initialKey + `k${upKey}${index}`;
                else currKey = `#k${upKey}${index}`;

                    if (updateExpressionKey === UPDATE_TYPE.SET) {
                updateExpression += ` ${currKey} = :v${upKey}${index}`;
                    }
                    else if (updateExpressionKey === UPDATE_TYPE.ADD) {
                        updateExpression +=  ` ${currKey} :v${upKey}${index}`;
                    }
                    else if (updateExpressionKey === UPDATE_TYPE.REMOVE) {
                        if (updateValue[index] > -1) {
                            updateExpression += `${upKey}[${updateValue[index]}]`;
                        }
                        else {
                            updateExpression += `${upKey}`;
                            isExprAttrValueRequired = false;
                        }
                    }

                    if (updateValue[index + 1]) {
                    updateExpression += ', '
                }

                    if (isExprAttrValueRequired) {
                        value[`:v${upKey}${index}`] = {[schema[upKey].AttributeType]: `${updateValue[index]}`};
                    }

                key[currKey] = upKey;
            }
        })
    }
        else {
            throw new Error ("something went wrong");
        }

    return {
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: key,
        ExpressionAttributeValues: value
    }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

