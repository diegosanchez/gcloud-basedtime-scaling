module.exports = {
    current: function() {
        return new Date();
    },

    isBetween: function(current, from, to) {
        return current >= from && current <= to;
    }
}
