jvm.adapter = jvm.adapter || {};

jvm.adapter.mootools = function(){
  'use strict';

  /**
   * Adapter class to handle array of elements
   * @constructor
   * @param {Array} Array of DomElement 
   */
  var MootoolsCollectionAdapter = new Class({
    Extends: Array,
    initialize: function(collection){
      var self = this;

      //Push the collection inside the instance
      collection.each(function(el){
        self.push(el);
      });

      //Getter/Setter methods forwarded directly to the MootoolsElementAdapter
      //If it's a setter, it'll affect to all elements
      //Else if it's a getter it'll only affect to the first element
      ['css','data','text','html','width','height'].each(function(method){
        this[method] = function(key, value){
          if(value || typeOf(key) === 'object'){
            this.invoke(method, arguments)
            return this;
          }else{
            return this[0][method].apply(this[0], arguments)
          }
        }
      }, this);
      
      //Setter methods forwarded directly to the MootoolsElementAdapter
      //They only affect to the first child
      ['addClass', 'appendChild', 'mousemove','mousedown','mouseup','mousewheel',
       'delegate','addEvent','click','trigger','show','hide','is'].each(function(method){
        this[method] = function(value){
          this[0][method].apply(this[0], arguments)
          return this;
        }
      }, this);

    },

    /**
     * Helper function to call a function for each element in the collection
     * @param {String} method The method to invoke
     * @param {Array} args The list of arguments to pass in
     */
    invoke: function(method, args){
      for(var i=0; i<this.length; i++){
        this[i][method].apply(this[i], args)
      }
    },

    /**
     * Add a new element to the collection
     * @param {DomElement} el1
     * @param {DomElement} el2
     * @param {DomElement} elN
     * @returns {Number} The number of elements
     */
    push: function(el1, el2, elN){
      var length = this.length;
      for (var i = 0, l = arguments.length; i < l; i++){
        var item = document.id(arguments[i]);
        if (item) this[length++] = new MootoolsElementAdapter(item);
      }
      return (this.length = length);
    },

    /**
     * Append a element or list of elements to the first element in the collection
     * @param {MootoolsElementAdapter|MootoolsCollectionAdapter} Elements to add
     * @returns {MootoolsCollectionAdapter}
     */
    append: function(element){
      Array.from(element).each(function(element){
        this[0].el.grab(element.el);
      }, this)
      return this;
    },

    /**
     * Find the elements that match with the first element of the collection
     * @param {String} Query selector
     * @returns {MootoolsCollectionAdapter}
     */
    find: function(selector){
      return this[0].find(selector)
    },

    /**
     * Append a element to the first element of the collection
     * @param {MootoolsElementAdapter} Element to add
     * @returns {MootoolsCollectionAdapter}
     */
    appendTo: function(element){
      this[0].appendTo(element);
      return this;
    },
    offset: function(){
      return this[0].offset();
    }
  });


  /**
   * Convert the mouse event to the jQuery style
   * @param {Event} e The mouse event
   * @returns {Event} The updated event object
   */
  var mouseEventAdapter = function(e){
    e.pageX = e.page.x;
    e.pageY = e.page.y;
    return e;
  }


  /**
   * Adapter class to handle for a jQuery element
   * @constructor
   * @param {DomElement} element The element to wrap
   */
  var MootoolsElementAdapter = new Class({
    initialize: function(element){
      this.el = element;
    },

    /**
     * jQuery.attr adapter method
     */
    attr: function(attr, value){
      if(value){
        this.el.set(attr, value);
        return this;
      }else {
        return this.el.get(attr);
      }
    },

    /**
     * jQuery.css adapter method
     */
    css: function(style, value){ 
      if(typeof(style) === 'object'){
        this.el.setStyles(style);
      }else{
        this.el.setStyle(style, value);
      }
      return this;
    },

    /**
     * jQuery.addClass adapter method
     */
    addClass: function(klass){
      this.el.addClass(klass);
      return this;
    },

    /**
     * jQuery.hide adapter method
     */
    hide: function(){
      this.css('display', 'none');
      return this;
    },

    /**
     * jQuery.show adapter method
     */
    show: function(){
      this.css('display', 'block');
      return this;
    },

    /**
     * jQuery.width adapter method
     */
    width: function(value){
      if(value){
        this.css('width', value);
        return this;
      }else{
        return this.el.getSize().x; 
      }
    },

    /**
     * jQuery.height adapter method
     */
    height: function(value){ 
      if(value){
        this.css('height', value);
        return this;
      }else{
        return this.el.getSize().y; 
      }
    },

    /**
     * jQuery.offset adapter method
     */
    offset: function(){
      var position = this.el.getPosition();
      return {
        top: position.y,
        left: position.x
      }
    },

    /**
     * jQuery.is adapter method
     * This method is a hack to work only when for: is(':visible') case
     */
    is: function(){
      return this.el.getStyle('display') != 'none';
    },

    /**
     * jQuery.data adapter method
     */
    data: function(key, value){
      if(!value) { return this.el.retrieve(key); }
      else {
        this.el.store(key, value);
        return this;
      }
    },

    /**
     * jQuery.addEvent adapter method
     */
    addEvent: function(){
      this.el.addEvent.call(this.el, arguments);
    },

    /**
     * jQuery.resize adapter method
     */
    resize: function(handler){
      this.el.addEvent('resize', handler);
      return this;
    },

    /**
     * jQuery.click adapter method
     */
    click: function(handler){
      this.el.addEvent('click', handler);
      return this;
    },

    /**
     * jQuery.mousemove adapter method
     */
    mousemove: function(handler){
      this.el.addEvent('mousemove', function(e){
        handler.call(this, mouseEventAdapter(e));
      });
      return this;
    },

    /**
     * jQuery.mousedown adapter method
     */
    mousedown: function(handler){
      this.el.addEvent('mousedown',function(e){
        handler.call(this, mouseEventAdapter(e));
      });
      return this;
    },

    /**
     * jQuery.mouseup adapter method
     */
    mouseup: function(handler){
      this.el.addEvent('mouseup', function(e){
        handler.call(this, mouseEventAdapter(e));
      });
      return this;
    },

    /**
     * jQuery.mousewheel adapter method
     */
    mousewheel: function(handler){
      this.el.addEvent('mousewheel', function(e){
        handler.call(this, mouseEventAdapter(e), null, null, e.wheel);
      });
      return this;
    },

    /**
     * jQuery.trigger adapter method
     */
    trigger: function(event){
      if(typeOf(event) === 'object'){
        this.el.fireEvent(event.eventName, [event].append(arguments[1]));
      }else {
        this.el.fireEvent(arguments);
      }
    },

    /**
     * jQuery.delegate adapter method
     */
    delegate: function(filter, events, handler){
      var eventList = events.split(' ');
      var lenght = eventList.length;
      var i;
      for(i=0; i<lenght; i++){ (function(i){
        var eventName = eventList[i];
        this.el.addEvent(eventName, function(e){
          $$(e.target).filter(filter).each(function(el){
            handler.call(el, {type: eventName});
          });
        })
      }.bind(this))(i)}
      return this;
    },

    /**
     * jQuery.bind adapter method
     */
    bind: function(event, handler){
      this.el.addEvent(event, handler)
      return this;
    },

    /**
     * jQuery.append adapter method
     */
    append: function(element){ 
      this.el.grab(typeOf(element.el)==='elements'?element.el[0]:element.el); 
      return this;
    },

    /**
     * jQuery.appendChild adapter method
     */
    appendChild: function(){
      this.el.appendChild.apply(this.el, arguments)
    },

    /**
     * jQuery.appendTo adapter method
     */
    appendTo: function(parent){
      parent.append(this);
      return this;
    },

    /**
     * jQuery.text adapter method
     */
    text: function(value){
      if(value) { 
        this.el.set('text', value);
        return this;
      }else{
        this.el.get('text');
      }
    },

    /**
     * jQuery.html adapter method
     */
    html: function(value){
       if(value) { 
        this.el.set('html', value);
        return this;
      }else{
        this.el.get('html');
      }
    },

    /**
     * jQuery.find adapter method
     */
    find: function(selector){
      return new MootoolsCollectionAdapter(this.el.getElements(selector));
    }
  })

  
  /**
   * Dom query selector adapter
   * It exposes a similar API to jQuery but the elements are
   * searched using Mootools and wrapped in the appropiate adapter
   * @param {String|Object} selector The query or object to wrap in
   * @returns {MootoolsElementAdapter|MootoolsCollectionAdapter}
   */
  var mootoolsAdapter = function(selector){
    var singleNodeRegex = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
    if (selector[0] === "<" && selector[selector.length-1] === ">" && selector.length >= 3) {
      var match = selector.match(singleNodeRegex);
      return new MootoolsCollectionAdapter([document.createElement(match[1])]);
    }else if(typeOf(selector) !== 'string'){
      if(instanceOf(selector, MootoolsCollectionAdapter)){
        return selector
      }else{
        return new MootoolsElementAdapter($(selector));
      }
    }else{
      return new MootoolsCollectionAdapter($$(selector));
    }
  }

  /**
   * jQuery.Event adapter
   */
  mootoolsAdapter.Event = function(name){
    return {
      eventName: name,
      preventDefault: function(){
        this._isDefaultPrevented = true;
      },
      isDefaultPrevented: function(){
        return this._isDefaultPrevented === true;
      }
    }
  }

  /**
   * jQuery.isArray adapter
   */
  mootoolsAdapter.isArray = function(value){
    return typeOf(value) === 'array';
  }

  /**
   * jQuery.extend adapter
   */
  mootoolsAdapter.extend = function(){
    var target = arguments[0];
    var length = arguments.length;
    var i = 1;
    var deep;
    var source;
    if (typeof target === "boolean"){
      deep = target;
      // skip the boolean and the target
      target = arguments[i] || {};
      i++;
    }
    for(;i<length; i++){
      Object.append(target, arguments[i]);
    }
    return target;
  }

  return mootoolsAdapter;
}

/**
 * Exposed method to start using this adapter
 * @example 
 *  jvm.adapter.mootools.use();
 *  jvm.WorldMap.addMap('world_mill_en', {....});
 *  var map = new jvm.WorldMap({....});
 *  map.set('focus', 'AU');
 */
jvm.adapter.mootools.use = function(){
  var WorldMap = jvm.WorldMap;
  
  jvm.$ = jvm.adapter.mootools();
  
  jvm.WorldMap = function(params){
    this.instance = new WorldMap(params);
  }
  jvm.WorldMap.prototype = {
    cmd: function(type, method){
      var methodName = method.capitalize();
      return this.instance[type+methodName].apply(this.instance, Array.prototype.slice.call(arguments, 2));
    },
    set: function(method, value){
      return this.cmd('set', method, value);
    },
    get: function(method){
      return this.cmd('get', method, value);
    }
  }

  jvm.WorldMap.addMap = function(map, data){
    WorldMap.maps[map] = data;
  }

  jvm.WorldMap.maps = WorldMap.maps;
  jvm.WorldMap.defaultParams = WorldMap.defaultParams;
  jvm.WorldMap.apiEvents = WorldMap.apiEvents;

}

