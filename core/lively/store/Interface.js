module('lively.store.Interface').requires().toRun(function() {

Object.extend(lively.store, {
    cachedStorageAccessors: {},
    get: function(spec) {
        if (this.cachedStorageAccessors[spec.id]) {
            return this.cachedStorageAccessors[spec.id];
        }
        if (!spec.type) {
            throw new Error('Storage type must be specified!');
        }
        var storageClass = lively.store[spec.type];
        if (!storageClass) {
            throw new Error('No such storage type ' + spec.type);
        }
        var storage = new storageClass(spec);
        return this.cachedStorageAccessors[spec.id] = storage;
    }
});

Object.subclass('lively.store.ObjectStorage',
'initializing', {
    initialize: function(spec) {
        this.stored = {}
    }
},
'accessing', {
    set: function(key, value) {
        this.stored[key] = value;
    },

    get: function(key) {
        return this.stored[key];
    }
});

Object.subclass('lively.store.FileStorage',
'initializing', {
    initialize: function(spec) {
        this.url = spec.url;
    }
},
'accessing', {
    set: function(data) {
        var webR = new WebResource(this.url);
        webR.put(data);
    },

    get: function(optCb) {
        var webR = new WebResource(this.url),
            result = webR.get().content;
        if (optCb) optCb(null, result);
        return result;
    }
});

}); // end of module