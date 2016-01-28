var util = require("util"),
    defaultDate = require("../dates/native"),
    defaultScaler = require("../scalers/google");

Array.prototype.forEachOrNone = function(noneCallback, eachCallback) {
    if ( this.length === 0 ) {
        noneCallback(null, null, this);
        return this;
    }

    this.forEach(eachCallback);

    return this;
};
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
        var inProgress = self.events.filter(self.isOnProgress.bind(self));

        inProgress.forEachOrNone(
            function() {
                var mockEvent = {
                    summary: "default size setup",
                    size: self.minimumInstances
                };

                self.scaleGroups(mockEvent, cbSuccess, cbError);

            },
            function(event) {
                self.scaleGroups(event,cbSuccess,cbError);
            });

    },

    scaleGroups: function(event, cbSuccess, cbError) {
        var self = this;
        self.instanceGroups.forEach(function(group) {
            self.scaleUp(event.size, group, self, function(err) {
                if ( err ) {
                    cbError(err, event, group);
                    return;
                }

                cbSuccess(event, group);
            });
        });
    },

    isOnProgress: function(event) {
        var current = this.currentDate();
        return this.currentDateIsBetween( this.currentDate(), event.start, event.end);
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
    },

    pushIfNotExist: function(event) {
        var self = this;
        var exist = self.events.some(isThereSome);

        if (exist) {
            return self;
        }

        self.events.push(event);

        return self;

        function isThereSome(e) {
            return self.currentDateIsSame(e.start, event.start) &&
                self.currentDateIsSame(e.end, event.end);
        }
    }
}

module.exports = {
    protocol: protocol,

    /***
     * Enrich a given object with gautoscaler protocol
     *
     * @param {object} object: it must have at least the properties listed below:
     *
     * @returns object enriched with protocl
     */
    createFrom: function(object) {
        object.scaleUp = object.scaleUp || defaultScaler;
        object.currentDate = object.currentDate || defaultDate.current;
        object.currentDateIsBetween = object.currentDateIsBetween || defaultDate.isBetween;
        object.currentDateIsSame = object.currentDateIsSame || defaultDate.isSame;
        object.__proto__ = protocol;

        object.events = [];

        return object;
    }
};
