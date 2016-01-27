var util = require("util");

var protocol = {
    recordEvent: function(start, end, summary, size) {
        var event = {
            start: start,
            end: end,
            summary: summary,
            size: size
        };

        return this.pushIfNotExist(event);
    },

    scale: function(cbSuccess, cbError) {
        var self = this;
        var inProgress = self.events.filter(this.isOnProgress);

        inProgress.forEach(function(event) {
            self.instanceGroups.forEach(function(group) {
                self.scaleUp(event.size, group, self, function(err) {
                    if ( err ) {
                        cbError(err, event, group);
                        return;
                    }

                    cbSuccess(event, group);
                });
            });
        });

    },

    pushIfNotExist: function(event) {
        var exist = this.events.some(function(e) {
            return e.start == event.start && e.end == event.end;
        });

        if (exist) {
            return this;
        }

        this.events.push(event);

        return this;
    },

    isOnProgress: function(event) {
        var current = new Date();
        return event.start <= current && event.end >= current;
    },

    status: function() {
        var result = "";

        result += "Event list:\n";
        this.events.forEach(function(e) {
            result += util.format(
                "start (%s) end (%s) summary (%s) size (%s)\n",
                e.start.toISOString(),
                e.end.toISOString(),
                e.summary,
                e.size);
        });
    }
}

module.exports = {
    protocol: protocol,

    createFrom: function(object, options) {
        object.scaleUp = object.scaleUp || require("../scalers/google");
        object.__proto__ = protocol;

        object.events = [];

        return object;
    }
};
