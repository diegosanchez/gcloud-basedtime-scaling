var google = require("googleapis"),
    instanceGroupManager = google.compute("v1").instanceGroupManagers;

module.exports = function(size, instanceGroup, options, callback) {
    var args = Array.prototype.slice.call(arguments, 0);
        jwt  = new google.auth.JWT(
        options.credentials.client_email,
        null,
        options.credentials.private_key,
        [
            "https://www.googleapis.com/auth/compute",
            "https://www.googleapis.com/auth/cloud-platform"
        ],
        null
    );

    instanceGroupManager.resize({
        auth: jwt,
        project: options.projectId,
        zone: instanceGroup.zone,
        instanceGroupManager: instanceGroup.name,
        size: size
    }, function(err) {

        callback.apply(null, args.slice(0,0,err) /* insert error at the beginning */);
    });
}
