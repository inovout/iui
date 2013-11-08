var HashMap = Class.create(Enumerable, {
    initialize: function (keyFn) {
        this.clear(true);
        if (keyFn) {
            this.getKey = keyFn;
        }
    },
    generation: 0,

    /**
     * Gets the number of items in the hash.
     * @return {Number} The number of items in the hash.
     */
    getCount: function () {
        return this.length;
    },

    /**
     * Implementation for being able to extract the key from an object if only
     * a single argument is passed.
     * @private
     * @param {String} key The key
     * @param {Object} value The value
     * @return {Array} [key, value]
     */
    getData: function (key, value) {
        // if we have no value, it means we need to get the key from the object
        if (value === undefined) {
            value = key;
            key = this.getKey(value);
        }

        return [key, value];
    },

    /**
     * Extracts the key from an object. This is a default implementation, it may be overridden
     * @param {Object} o The object to get the key from
     * @return {String} The key to use.
     */
    getKey: function (o) {
        return o.id || o.uid || o.toString();
    },

    /**
     * Adds an item to the collection. Fires the {@link #event-add} event when complete.
     *
     * @param {String/Object} key The key to associate with the item, or the new item.
     *
     * If a {@link #getKey} implementation was specified for this HashMap,
     * or if the key of the stored items is in a property called `id`,
     * the HashMap will be able to *derive* the key for the new item.
     * In this case just pass the new item in this parameter.
     *
     * @param {Object} [o] The item to add.
     *
     * @return {Object} The item added.
     */
    add: function (key, value) {
        var me = this;
        key = me.getKey(key);
        // Need to check arguments length here, since we could have called:
        // map.add('foo', undefined);
        if (arguments.length === 1) {
            value = key;
            key = me.getKey(value);
        }

        if (me.containsKey(key)) {
            return me.replace(key, value);
        }

        me.map[key] = value;
        ++me.length;
        me.generation++;
        return value;
    },

    /**
     * Replaces an item in the hash. If the key doesn't exist, the
     * {@link #method-add} method will be used.
     * @param {String} key The key of the item.
     * @param {Object} value The new value for the item.
     * @return {Object} The new value of the item.
     */
    replace: function (key, value) {
        var me = this,
            map = me.map,
            old;

        // Need to check arguments length here, since we could have called:
        // map.replace('foo', undefined);
        if (arguments.length === 1) {
            value = key;
            key = me.getKey(value);
        }

        if (!me.containsKey(key)) {
            me.add(key, value);
        }
        old = map[key];
        map[key] = value;
        me.generation++;
        return value;
    },

    /**
     * Remove an item from the hash.
     * @param {Object} o The value of the item to remove.
     * @return {Boolean} True if the item was successfully removed.
     */
    remove: function (o) {
        var key = this.findKey(o);
        if (key !== undefined) {
            return this.removeAtKey(key);
        }
        return false;
    },

    /**
     * Remove an item from the hash.
     * @param {String} key The key to remove.
     * @return {Boolean} True if the item was successfully removed.
     */
    removeAtKey: function (key) {
        var me = this,
            value;

        if (me.containsKey(key)) {
            value = me.map[key];
            delete me.map[key];
            --me.length;
            return true;
        }
        return false;
    },

    /**
     * Retrieves an item with a particular key.
     * @param {String} key The key to lookup.
     * @return {Object} The value at that key. If it doesn't exist, `undefined` is returned.
     */
    get: function (key) {
        var map = this.map;
        key = this.getKey(key);
        return map.hasOwnProperty(key) ? map[key] : undefined;
    },

    /**
     * Removes all items from the hash.
     * @return {Ext.util.HashMap} this
     */
    clear: function (/* private */ initial) {
        var me = this;

        // Only clear if it has ever had any content
        if (initial || me.generation) {
            me.map = {};
            me.length = 0;
            me.generation = initial ? 0 : me.generation + 1;
        }
        return me;
    },

    /**
     * Checks whether a key exists in the hash.
     * @param {String} key The key to check for.
     * @return {Boolean} True if they key exists in the hash.
     */
    containsKey: function (key) {
        var map = this.map;
        return map.hasOwnProperty(key) && map[key] !== undefined;
    },

    /**
     * Checks whether a value exists in the hash.
     * @param {Object} value The value to check for.
     * @return {Boolean} True if the value exists in the dictionary.
     */
    contains: function (value) {
        return this.containsKey(this.findKey(value));
    },

    /**
     * Return all of the keys in the hash.
     * @return {Array} An array of keys.
     */
    getKeys: function () {
        return this.getArray(true);
    },

    /**
     * Return all of the values in the hash.
     * @return {Array} An array of values.
     */
    getValues: function () {
        return this.getArray(false);
    },

    /**
     * Gets either the keys/values in an array from the hash.
     * @private
     * @param {Boolean} isKey True to extract the keys, otherwise, the value
     * @return {Array} An array of either keys/values from the hash.
     */
    getArray: function (isKey) {
        var arr = [],
            key,
            map = this.map;
        for (key in map) {
            if (map.hasOwnProperty(key)) {
                arr.push(isKey ? key : map[key]);
            }
        }
        return arr;
    },

    /**
     * Executes the specified function once for each item in the hash.
     * Returning false from the function will cease iteration.
     *
     * @param {Function} fn The function to execute.
     * @param {String} fn.key The key of the item.
     * @param {Number} fn.value The value of the item.
     * @param {Number} fn.length The total number of items in the hash.
     * @param {Object} [scope] The scope to execute in. Defaults to <tt>this</tt>.
     * @return {Ext.util.HashMap} this
     */
    each: function (fn, scope) {
        // copy items so they may be removed during iteration.
        var items = Ext.apply({}, this.map),
            key,
            length = this.length;

        scope = scope || this;
        for (key in items) {
            if (items.hasOwnProperty(key)) {
                if (fn.call(scope, key, items[key], length) === false) {
                    break;
                }
            }
        }
        return this;
    },

    /**
     * Performs a shallow copy on this hash.
     * @return {Ext.util.HashMap} The new hash object.
     */
    clone: function () {
        var hash = new this.self(this.initialConfig),
            map = this.map,
            key;

        hash.suspendEvents();
        for (key in map) {
            if (map.hasOwnProperty(key)) {
                hash.add(key, map[key]);
            }
        }
        hash.resumeEvents();
        return hash;
    },

    /**
     * @private
     * Find the key for a value.
     * @param {Object} value The value to find.
     * @return {Object} The value of the item. Returns <tt>undefined</tt> if not found.
     */
    findKey: function (value) {
        var key,
            map = this.map;

        for (key in map) {
            if (map.hasOwnProperty(key) && map[key] === value) {
                return key;
            }
        }
        return undefined;
    }
});
var Event = Class.create({
    initialize: function (name, observable) {
        /// <summary>
        /// 事件构造器
        /// </summary>
        /// <param name="observable" type="Object">
        /// 被观察者
        /// </param>
        /// <param name="name" type="String">
        /// 事件名称
        /// </param>
        /// <returns type="Event" />

        this.observable = observable;
        /// <field type = 'String'>事件名称</field>
        this.name = name;
        this.listeners = [];
    },
    suspended: 0,
    addListener: function (fn, scope, options) {
        var me = this,
            listeners, listener, priority, isNegativePriority, highestNegativePriorityIndex,
            hasNegativePriorityIndex, length, index, i, listenerPriority;

        scope = scope || me.observable;

        if (!me.isListening(fn, scope)) {
            listener = me.createListener(fn, scope, options);
            if (me.firing) {
                // if we are currently firing this event, don't disturb the listener loop
                me.listeners = me.listeners.slice(0);
            }
            listeners = me.listeners;
            index = length = listeners.length;
            priority = options && options.priority;
            highestNegativePriorityIndex = me._highestNegativePriorityIndex;
            hasNegativePriorityIndex = (highestNegativePriorityIndex !== undefined);
            if (priority) {
                // Find the index at which to insert the listener into the listeners array,
                // sorted by priority highest to lowest.
                isNegativePriority = (priority < 0);
                if (!isNegativePriority || hasNegativePriorityIndex) {
                    // If the priority is a positive number, or if it is a negative number
                    // and there are other existing negative priority listenrs, then we
                    // need to calcuate the listeners priority-order index.
                    // If the priority is a negative number, begin the search for priority
                    // order index at the index of the highest existing negative priority
                    // listener, otherwise begin at 0
                    for (i = (isNegativePriority ? highestNegativePriorityIndex : 0) ; i < length; i++) {
                        // Listeners created without options will have no "o" property
                        listenerPriority = listeners[i].o ? listeners[i].o.priority || 0 : 0;
                        if (listenerPriority < priority) {
                            index = i;
                            break;
                        }
                    }
                } else {
                    // if the priority is a negative number, and there are no other negative
                    // priority listeners, then no calculation is needed - the negative
                    // priority listener gets appended to the end of the listeners array.
                    me._highestNegativePriorityIndex = index;
                }
            } else if (hasNegativePriorityIndex) {
                // listeners with a priority of 0 or undefined are appended to the end of
                // the listeners array unless there are negative priority listeners in the
                // listeners array, then they are inserted before the highest negative
                // priority listener.
                index = highestNegativePriorityIndex;
            }

            if (!isNegativePriority && index <= highestNegativePriorityIndex) {
                me._highestNegativePriorityIndex++;
            }
            if (index === length) {
                me.listeners[length] = listener;
            } else {
                arrayInsert(me.listeners, index, [listener]);
            }
        }
    },
    createListener: function (fn, scope, o) {
        scope = scope || this.observable;

        var me = this,
            listener = {
                fn: fn,
                scope: scope,
                ev: me
            },
            handler = fn;

        listener.fireFn = handler;
        return listener;
    },

    findListener: function (fn, scope) {
        var listeners = this.listeners,
        i = listeners.length,
        listener,
        s;

        while (i--) {
            listener = listeners[i];
            if (listener) {
                s = listener.scope;

                // Compare the listener's scope with *JUST THE PASSED SCOPE* if one is passed, and only fall back to the owning Observable if none is passed.
                // We cannot use the test (s == scope || s == this.observable)
                // Otherwise, if the Observable itself adds Ext.emptyFn as a listener, and then Ext.emptyFn is added under another scope, there will be a false match.
                if (listener.fn == fn && (s == (scope || this.observable))) {
                    return i;
                }
            }
        }

        return -1;
    },

    isListening: function (fn, scope) {
        return this.findListener(fn, scope) !== -1;
    },

    removeListener: function (fn, scope) {
        var me = this,
            index,
            listener,
            highestNegativePriorityIndex,
            k;
        index = me.findListener(fn, scope);
        if (index != -1) {
            listener = me.listeners[index];
            highestNegativePriorityIndex = me._highestNegativePriorityIndex;

            if (me.firing) {
                me.listeners = me.listeners.slice(0);
            }

            // cancel and remove a buffered handler that hasn't fired yet
            if (listener.task) {
                listener.task.cancel();
                delete listener.task;
            }

            // cancel and remove all delayed handlers that haven't fired yet
            k = listener.tasks && listener.tasks.length;
            if (k) {
                while (k--) {
                    listener.tasks[k].cancel();
                }
                delete listener.tasks;
            }

            // Remove this listener from the listeners array
            // We can use splice directly. The IE8 bug which Ext.Array works around only affects *insertion*
            // http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/6e946d03-e09f-4b22-a4dd-cd5e276bf05a/
            me.listeners.splice(index, 1);

            // if the listeners array contains negative priority listeners, adjust the
            // internal index if needed.
            if (highestNegativePriorityIndex) {
                if (index < highestNegativePriorityIndex) {
                    me._highestNegativePriorityIndex--;
                } else if (index === highestNegativePriorityIndex && index === me.listeners.length) {
                    delete me._highestNegativePriorityIndex;
                }
            }
            return true;
        }

        return false;
    },

    // Iterate to stop any buffered/delayed events
    clearListeners: function () {
        var listeners = this.listeners,
            i = listeners.length;

        while (i--) {
            this.removeListener(listeners[i].fn, listeners[i].scope);
        }
    },

    suspend: function () {
        this.suspended += 1;
    },

    resume: function () {
        if (this.suspended) {
            this.suspended--;
        }
    },

    fire: function () {
        var me = this,
            listeners = me.listeners,
            count = listeners.length,
            i,
            args,
            listener,
            len;

        if (!me.suspended && count > 0) {
            me.firing = true;
            args = arguments.length ? $A(arguments) : []
            len = args.length;
            for (i = 0; i < count; i++) {
                listener = listeners[i];
                if (listener.o) {
                    args[len] = listener.o;
                }
                if (listener && listener.fireFn.apply(listener.scope || me.observable, args) === false) {
                    return (me.firing = false);
                }
            }
        }
        me.firing = false;
        return true;
    },
    hasListeners: function () {
        return this.listeners.length > 0;
    }
});var EventAdapter = Class.create({
    initialize: function (event) {
        this.event = event;
        return this;
    },
    listen: function (sender, args) {
        Function("sender,args", "this." + this.fnExpression).call(this.scope, sender, args);

        //var me = this;
        //var listenerArgs = [];
        //var propertyNames = this.lfnArgs.split(",")
        //propertyNames.each(function (propertyName) {
        //    var propertyNameArray = propertyName.split(".");
        //    var propertyValue = propertyName;
        //    if (propertyNameArray[0] == "sender") {
        //        propertyValue = sender;
        //    }
        //    else if (propertyNameArray[0] == "args") {
        //        propertyValue = args;
        //        for (var i = 1; i < propertyNameArray.length; i++) {
        //            propertyValue = propertyValue[propertyNameArray[i]]
        //        }
        //    }
        //    listenerArgs.push(propertyValue);

        //});
        //this.lfn.apply(this.scope, listenerArgs);

    },
    addListener: function (fnExpression, scope, options) {
        this.fnExpression = fnExpression;
        this.scope = scope;
        this.event.addListener(this.listen, this, options);
    }
});