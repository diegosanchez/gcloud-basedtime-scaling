module.exports = {
    current: function() {
        return new Date();
    },

    isBetween: function(current, from, to) {
        return current >= from && current <= to;
    },

    isSame: function(one, another) {
        return one.valueOf() === another.valueOf();
    }
}
