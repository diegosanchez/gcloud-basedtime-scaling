var moment = require("moment");

module.exeport = {
    current: function() {
        return moment();
    },

    isBetween: function(current, from, to) {
        return current.isBetween(from, to);
    },

    isSame: function(one, another) {
        return one.isSame(another);
    }
}
