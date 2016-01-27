module.exports = function(error) {

    return function(size, instanceGroup, options, callback) {
        callback.call(null, error);
    };

};
