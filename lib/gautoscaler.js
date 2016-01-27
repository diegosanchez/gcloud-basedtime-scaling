var protocol = {};

module.exports = {
    protocol: protocol,

    createFrom: function(object, options) {
        object.__proto__ = protocol;
        return object;
    }
};
