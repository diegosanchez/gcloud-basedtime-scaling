var chai = require("chai"),
    sinonChai = require("sinon-chai"),
    sinon = require("sinon");

var stubGoogleScaler = require("../scalers/googleStub"),
    gautoscaler = require("../lib/gautoscaler");

chai.use(sinonChai);

describe("gautoscaler", function() {

    describe("user record an event", function() {
        var size = 4,
            group = [{name: "group", zone: "zone"}],
            object = {
                scaleUp: stubGoogleScaler(null /* error */),
                instanceGroups: group
            },
            start = new Date(),
            end = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate() + 5);


        it("should trigger success callback upon scale", function() {
            var spySuccess = sinon.spy(),
                gscaler = gautoscaler.createFrom(object);

            gscaler.recordEvent(start, end, "summary", size);
            gscaler.scale(spySuccess, sinon.spy());

            var expected = {
                start: start,
                end: end,
                summary: "summary",
                size: size
            };
            chai.expect(spySuccess).to.have.been.calledWith(sinon.match(expected));
        });

        it("should trigger error callback upon scale", function() {
            var spyError = sinon.spy(),
                object = {
                    scaleUp: stubGoogleScaler( "error" ),
                    instanceGroups: group
                },
                gscaler = gautoscaler.createFrom(object);

            gscaler.recordEvent(start, end, "summary", size);
            gscaler.scale(sinon.spy(), spyError);


            chai.expect(spyError).to.have.been.calledWith("error" );
        });

        it("shouldn't add events with same date (start and end)", function() {
            var spySuccess = sinon.spy(),
                gscaler = gautoscaler.createFrom(object);

            gscaler.recordEvent(start, end, "summary", size);
            gscaler.recordEvent(start, end, "summary", size);
            gscaler.scale(spySuccess, sinon.spy());

            chai.expect(spySuccess).to.have.been.calledOnce;

        });
    });

    describe("scale up events", function() {
        var size = 4,
            group = [{name: "group", zone: "zone"}],
            object = {
                scaleUp: stubGoogleScaler(null /* error */),
                minimumInstances: 4,
                instanceGroups: group
            },
            start = new Date(),
            end = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate() + 5);

        it("shouldn't trigger any events because date is out of range", function() {
            var spySuccess = sinon.spy(),
                spyError = sinon.spy(),
                gscaler = gautoscaler.createFrom(object);

            gscaler.recordEvent(new Date("Dec 25, 1995"), new Date("Dec 25, 1996"),
                                "summary", 25);
            gscaler.scale(spySuccess, spyError);
            var expected = {
                summary: "default size setup",
                size: 4
            };
            chai.expect(spySuccess).to.have.been.calledWith(sinon.match(expected));
            chai.expect(spyError).to.not.have.been.called;
        });

        it("should scale default size if there aren't inprogress events", function() {
            var spySuccess = sinon.spy(),
                spyError = sinon.spy(),
                gscaler = gautoscaler.createFrom(object);

            gscaler.scale(spySuccess,spyError);

            var expected = {
                summary: "default size setup",
                size: 4
            };
            chai.expect(spySuccess).to.have.been.calledWith(sinon.match(expected));
        });
    });
});
